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
import { useEffect } from 'react';
import dynamic from "next/dynamic";
import { PDFDocument } from "@/components/pdfdocument";

export default function Home() {
  // const [currentTile, setTitle] = useState("")
  // const [currentNumberOfMessages, setNumberOfMessages] = useState<number>(0)
  const [pdfObject, setPdfObject] = useState<messageObject[]>([])
  const [data, setData] = useState<Conversation[]>()

  useEffect(() => {
    let genericArray:messageObject[] = []
    if (data != undefined) {
      data.forEach(element => {
        console.log(element)
        const messages = Object.values(element.mapping)
        const updateTime = new Date(element.update_time * 1000).toLocaleDateString('pt-br')


        const messagesList: Message[] = []
        for (const value of messages) {
          messagesList.push(value)
        }
        
        const transformedList = messagesList.filter((item) => item.message && item.message?.author?.role != 'system')
        const numberUserInputs = transformedList.filter((item) => item.message.author.role == "user").length
        genericArray.push({ title: element.title, numberMessages: numberUserInputs, updateTime })
        
      });
      setPdfObject(genericArray)
      pdfInput()
    }
  }, [data])

  const PDFDownloadLink = dynamic(
    () => import(`@react-pdf/renderer`).then((mod) => mod. PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
      
    } 
  ) 

  async function pdfInput() {
    await fetch('/pdf', {
      method: 'POST',
      body: pdfObject!
    })
  }

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

  const FinalDownloadLink = ({objectArray}: {objectArray: messageObject[]}) => (
    <PDFDownloadLink document={<PDFDocument objectArray={objectArray}/>}>
      {({ loading }) =>
        loading ? 'Loading document...' : 'Download now!'
      }
    </PDFDownloadLink>
  )

  return (
    <div className="font-[family-name:var(--font-geist-sans)] my-4">
      <h2 className="text-center text-xl mb-4">ChatGPT Exported Data Analysis</h2>
      { data && <FinalDownloadLink objectArray={pdfObject}/>}
      {/* <button onClick={() => pdfInput()}>click me when its done</button> */}
      <div className="text-center bg-blue-50 items-center flex justify-center gap-2">
        <span className="text-cyan-300 font-bold text-4xl">{data && data!.length}</span>
        <span>chats</span>
      </div>
      <p className="text-center mt-4 text-lg">which are:</p>
      <div className="grid grid-cols-2 m-12 gap-3">
        {data && data.map((conv) => {
          const updateTime = new Date(conv.update_time * 1000).toLocaleDateString('pt-br')
          const messages = Object.values(conv.mapping)


          const messagesList: Message[] = []
          for (const value of messages) {
            messagesList.push(value)
          }
          const transformedList = messagesList.filter((item) => item.message && item.message?.author?.role != 'system')
          const numberUserInputs = transformedList.filter((item) => item.message.author.role == "user").length
          // setTitle(conv.title)
          // setNumberOfMessages(numberUserInputs)
          // setPdfObject([...pdfObject, {title: conv.title, numberMessages: numberUserInputs}])
          return (
            <div className=" items-center border border-slate-200 px-12 py-8 rounded-sm max-h-64 overflow-scroll min-h-24" key={uuidv4()}>
              <h4 className="font-semibold text-cyan-800">{conv.title}</h4>
              <div className='text-slate-500'>
                <span>Number of user inputs: </span>
                <span className='text-xl text-blue-500 font-semibold'>{numberUserInputs}</span>

                <p>Last updated: {updateTime}</p>
              </div>
              {transformedList.map((item, secondIndex) => {
                return (
                  <div key={uuidv4()}>
                    {item.message && item.message.content.parts.map((text) => {
                      return (
                        <div key={item.id}>
                          {item.message.author.role == 'user' && <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger className='hover:no-underline hover:text-blue-400'>{text}</AccordionTrigger>
                              <AccordionContent className="max-h-48 overflow-scroll">
                                {secondIndex < transformedList.length - 1 && parse(marked(transformedList[secondIndex + 1].message.content.parts[0]))}
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
