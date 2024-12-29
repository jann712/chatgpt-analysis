'use client'

import { Message } from "./api/types";
import { ReactHTMLElement, useState } from "react";
import { Conversation } from "./api/types";

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
      const responseData:Conversation[] = JSON.parse(await (await response.blob()).text())
      setData(responseData)

    })
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h4>this is sick</h4>
      {data && data.map((conv, index) => {
        const messages = Object.values(conv.mapping)
        // console.log(conv.mapping)
        const messagesList:Message[] = []
        for (const value of messages) {
          messagesList.push(value)
        }
        
        console.log(messagesList)
        return (
          <div key={index} className="flex items-center border-4 border-blue-200 p-2 rounded-md">
            <h4>{conv.title}</h4>
            <p>Number of messages: {messagesList.length}</p>
            {messagesList.map((item, index) => {
              return (
                <p key={index}>
                  {/* {item.message && item.message.content.parts[0]} */}
                  
                </p>
              )
            })}
            
          </div>
        )
      })}
      <span>anyways here is an input of files</span>
      <input type="file" multiple={true} onChange={fileInput}/>
    </div>
  );
}
