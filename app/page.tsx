'use client'


import { marked } from 'marked'
import parse from 'html-react-parser';
import { Message } from "./api/types";
import { useState } from "react";
import { Conversation } from "./api/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { v4 as uuidv4 } from 'uuid';
import { messageObject } from "./api/types";
import dynamic from "next/dynamic";
import { PDFDocument } from "@/components/pdfdocument";

export default function Home() {
  // const [currentTile, setTitle] = useState("")
  // const [currentNumberOfMessages, setNumberOfMessages] = useState<number>(0)
  // const [pdfObject, setPdfObject] = useState<messageObject[]>([])
  const [data, setData] = useState<Conversation[]>()


  // const PDFDownloadLink = dynamic(
  //   () => import(`@react-pdf/renderer`).then((mod) => mod. PDFDownloadLink),
  //   {
  //     ssr: false,
  //     loading: () => <p>Loading...</p>
  //   } 
  // ) 


  async function fileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length == 0) {
      return
    }
    const file = e.target.files[0]
    await fetch('/api', {
      method: 'POST',
      body: file
    }).then(async (response) => {
      const responseData: Conversation[] = JSON.parse(await (await response.blob()).text())
      setData(responseData)

    })
  }

  // const FinalDownloadLink = () => (
  //   <PDFDownloadLink document={<PDFDocument objectArray={pdfObject}/>}/>
  // )

  return (
    <div className="font-[family-name:var(--font-geist-sans)] my-4">
      <h2 className="text-center text-xl mb-4">ChatGPT Exported Data Analysis</h2>
       {/* { pdfObject.length == data!.length && <FinalDownloadLink/>} */}
      <div className="text-center bg-blue-50 items-center flex justify-center gap-2">
        <span className="text-cyan-500 font-bold text-4xl">{data && data!.length}</span>
        <span>chats</span>
      </div>
      <p className="text-center mt-4 text-lg">which are:</p>
      <div className="grid grid-cols-2 m-12 gap-3">
        {data && data.map((conv) => {
          const updateTime = new Date(conv.update_time * 1000).toDateString()
          const messages = Object.values(conv.mapping)
          

          const messagesList: Message[] = []
          for (const value of messages) {
            messagesList.push(value)
          }
          const transformedList = messagesList.filter((item) => item.message && item.message?.author?.role != 'system')
          const numberUserInputs = transformedList.filter((item) => item.message.author.role == "user").length
          // setTitle(conv.title)
          // setNumberOfMessages(numberUserInputs)
          // setPdfObject([...pdfObject, {title: currentTile, numberMessages: currentNumberOfMessages}])
          return (
            <div className=" items-center border-2 border-slate-200 p-4 rounded-sm max-h-72 overflow-scroll" key={uuidv4()}>
              <h4 className="font-semibold text-cyan-800">{conv.title}</h4>
              <span>Number of user inputs: </span>
              <span className='text-xl text-blue-600 font-semibold'>{numberUserInputs}</span>
              
              <p>Last updated: {updateTime}</p>
              {transformedList.map((item, secondIndex) => {
                return (
                  <div key={uuidv4()}>
                    {item.message && item.message.content.parts.map((text) => {
                      return (
                        <div key={item.id}>
                          {item.message.author.role == 'user' && <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger>{text}</AccordionTrigger>
                              <AccordionContent className="max-h-48 overflow-scroll">
                                {secondIndex < transformedList.length - 1 && parse( marked(transformedList[secondIndex + 1].message.content.parts[0]))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>}
                        </div>

                      )
                    }
                    )}
                  </div>
                )
              })}

            </div>
          )
        })}
      </div>
      <span>anyways here is an input of files</span>
      <input type="file" multiple={true} onChange={fileInput} title=" " />
    </div>
  );
}
