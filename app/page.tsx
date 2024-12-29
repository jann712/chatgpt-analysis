'use client'

import { marked } from 'marked'
import parse from 'html-react-parser';
import { Message } from "./api/types";
import { ReactHTMLElement, useState } from "react";
import { Conversation } from "./api/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function Home() {
  const [data, setData] = useState<Conversation[]>()


  async function fileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length == 0) {
      return
    }

    const file = e.target.files[0]
    // const formData = new FormData()

    // for (const file of Array.from(files)) {
    //   formData.append("files", file)
    // }

    await fetch('/api', {
      method: 'POST',
      body: file
    }).then(async (response) => {
      const responseData: Conversation[] = JSON.parse(await (await response.blob()).text())
      setData(responseData)

    })
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)] my-4">
      <h2 className="text-center text-xl mb-4">ChatGPT Exported Data Analysis</h2>
      <div className="text-center bg-blue-50 items-center flex justify-center gap-2">
        <span className="text-cyan-500 font-bold text-4xl">{data && data!.length}</span>
        <span>chats</span>
      </div>
      <p className="text-center mt-4 text-lg">which are:</p>
      <div className="grid grid-cols-4 m-12 gap-3">
        {data && data.map((conv, index) => {
          const updateTime = new Date(conv.update_time * 1000).toDateString()
          const messages = Object.values(conv.mapping)
          // console.log(conv.mapping)
          const messagesList: Message[] = []
          for (const value of messages) {
            messagesList.push(value)
          }
          const transformedList = messagesList.filter((item) => item.message && item.message?.author?.role != 'system')
          console.log(transformedList)
          // console.log(messagesList)
          return (
            <div key={index} className=" items-center border-4 border-blue-200 p-2 rounded-md">
              <h4 className="font-semibold text-orange-500">{conv.title}</h4>
              <span>Number of user inputs: </span>
              <span className='text-xl text-blue-600 font-semibold'>{transformedList.filter((item) => item.message.author.role == "user").length}</span>
              <p>Last updated: {updateTime}</p>
              {transformedList.map((item, index) => {
                return (
                  <div key={item.id}>
                    {item.message && item.message.content.parts.map((text, itemIndex) => {
                      
                      // if (item.message.author.role == 'system') 
                      // if (item.message.author.role == 'assistant') {
                      //   const accordionContent = document.getElementById(transformedList[itemIndex - 1].id)
                      //   accordionContent.innerHTML = text
                      //   console.log(transformedList[index - 1].id)
                      //   return
                      // }
                      return (
                        // <div key={index} className='overflow-x-auto max-w-full'>{parse(marked.parse(text))}</div>
                        <>
                        {item.message.author.role == 'user' && <Accordion type="single" collapsible key={itemIndex}>
                          <AccordionItem value="item-1" key={item.id}>
                            <AccordionTrigger>{text}</AccordionTrigger>
                            <AccordionContent id={item.id}>
                              {itemIndex < transformedList.length - 1 &&  transformedList[itemIndex + 1].message.content.parts[0]}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>}
                        </>

                      )
                    })}

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
