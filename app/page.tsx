"use client";

import { marked } from "marked";
import parse from "html-react-parser";
import { Message } from "./api/types";
import { useState } from "react";
import { Conversation } from "./api/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { v4 as uuidv4 } from "uuid";
import { messageObject } from "./api/types";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { PDFDocument } from "@/components/pdfdocument";
import FinalizedLineChart from "@/components/linechart";

export default function Home() {
  // const [currentTile, setTitle] = useState("")
  // const [currentNumberOfMessages, setNumberOfMessages] = useState<number>(0)
  const [pdfObject, setPdfObject] = useState<messageObject[]>([]);
  const [data, setData] = useState<Conversation[]>();

  useEffect(() => {
    let genericArray: messageObject[] = [];
    if (data != undefined) {
      data.forEach((element) => {
        // console.log(element);
        const messages = Object.values(element.mapping);
        const updateTime = new Date(
          element.update_time * 1000
        ).toLocaleDateString("pt-br");

        const messagesList: Message[] = [];
        for (const value of messages) {
          messagesList.push(value);
        }

        const transformedList = messagesList.filter(
          (item) => item.message && (item.message?.author?.role == "assistant" || item.message?.author?.role == "user") && item.message.content.parts && item.message.content.parts[0].length > 2
        );

        
        const numberUserInputs = transformedList.filter(
          (item) => item.message.author.role == "user"
        ).length;
        genericArray.push({
          title: element.title,
          numberMessages: numberUserInputs,
          updateTime,
        });
      });
      setPdfObject(genericArray);
      // pdfInput()
    }
  }, [data]);

  const PDFDownloadLink = dynamic(
    () => import(`@react-pdf/renderer`).then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );

  // async function pdfInput() {
  //   await fetch('/pdf', {
  //     method: 'POST',
  //     body: pdfObject!
  //   })
  // }

  
  async function fileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length == 0) {
      return;
    }
    const file = e.target.files[0];
    await fetch("/api", {
      method: "POST",
      body: file,
    }).then(async (response) => {
      const responseData: Conversation[] = JSON.parse(
        await (await response.blob()).text()
      );
      setData(responseData);
    });
  }

  const FinalDownloadLink = ({
    objectArray,
  }: {
    objectArray: messageObject[];
  }) => (
    <PDFDownloadLink document={<PDFDocument objectArray={objectArray} />}>
      {
        //@ts-ignore
        ({ loading }) =>
          loading ? "Loading document..." : "Download the PDF now!"
      }
    </PDFDownloadLink>
  );

  return (
    <div className="font-[family-name:var(--font-geist-sans)] my-4">
      <div className="flex text-center flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          className=""
        >
          <path d="M 11.134766 1.0175781 C 10.87173 1.0049844 10.606766 1.0088281 10.337891 1.0332031 C 8.1135321 1.2338971 6.3362243 2.7940749 5.609375 4.8203125 C 3.8970488 5.1768339 2.4372723 6.3048522 1.671875 7.9570312 C 0.73398779 9.9840533 1.1972842 12.30076 2.5878906 13.943359 C 2.0402591 15.605222 2.2856216 17.434472 3.3320312 18.921875 C 4.6182099 20.747762 6.8565685 21.504693 8.9746094 21.121094 C 10.139659 22.427613 11.84756 23.130452 13.662109 22.966797 C 15.886521 22.766098 17.663809 21.205995 18.390625 19.179688 C 20.102972 18.823145 21.563838 17.695991 22.330078 16.042969 C 23.268167 14.016272 22.805368 11.697142 21.414062 10.054688 C 21.960697 8.3934373 21.713894 6.5648387 20.667969 5.078125 C 19.38179 3.2522378 17.143432 2.4953068 15.025391 2.8789062 C 14.032975 1.7660011 12.646869 1.0899755 11.134766 1.0175781 z M 11.025391 2.5136719 C 11.921917 2.5488523 12.754993 2.8745885 13.431641 3.421875 C 13.318579 3.4779175 13.200103 3.5164101 13.089844 3.5800781 L 9.0761719 5.8964844 C 8.7701719 6.0724844 8.5801719 6.3989531 8.5761719 6.7519531 L 8.5175781 12.238281 L 6.75 11.189453 L 6.75 6.7851562 C 6.75 4.6491563 8.3075938 2.74225 10.433594 2.53125 C 10.632969 2.5115 10.83048 2.5060234 11.025391 2.5136719 z M 16.125 4.2558594 C 17.398584 4.263418 18.639844 4.8251563 19.417969 5.9101562 C 20.070858 6.819587 20.310242 7.9019929 20.146484 8.9472656 C 20.041416 8.8773528 19.948163 8.794144 19.837891 8.7304688 L 15.826172 6.4140625 C 15.520172 6.2380625 15.143937 6.2352031 14.835938 6.4082031 L 10.052734 9.1035156 L 10.076172 7.0488281 L 13.890625 4.8476562 C 14.584375 4.4471562 15.36085 4.2513242 16.125 4.2558594 z M 5.2832031 6.4726562 C 5.2752078 6.5985272 5.25 6.7203978 5.25 6.8476562 L 5.25 11.480469 C 5.25 11.833469 5.4362344 12.159844 5.7402344 12.339844 L 10.464844 15.136719 L 8.6738281 16.142578 L 4.859375 13.939453 C 3.009375 12.871453 2.1365781 10.567094 3.0175781 8.6210938 C 3.4795583 7.6006836 4.2963697 6.8535791 5.2832031 6.4726562 z M 15.326172 7.8574219 L 19.140625 10.060547 C 20.990625 11.128547 21.865375 13.432906 20.984375 15.378906 C 20.522287 16.399554 19.703941 17.146507 18.716797 17.527344 C 18.724764 17.401695 18.75 17.279375 18.75 17.152344 L 18.75 12.521484 C 18.75 12.167484 18.563766 11.840156 18.259766 11.660156 L 13.535156 8.8632812 L 15.326172 7.8574219 z M 12.025391 9.7109375 L 13.994141 10.878906 L 13.966797 13.167969 L 11.974609 14.287109 L 10.005859 13.121094 L 10.03125 10.832031 L 12.025391 9.7109375 z M 15.482422 11.761719 L 17.25 12.810547 L 17.25 17.214844 C 17.25 19.350844 15.692406 21.25775 13.566406 21.46875 C 12.449968 21.579344 11.392114 21.244395 10.568359 20.578125 C 10.681421 20.522082 10.799897 20.48359 10.910156 20.419922 L 14.923828 18.103516 C 15.229828 17.927516 15.419828 17.601047 15.423828 17.248047 L 15.482422 11.761719 z M 13.947266 14.896484 L 13.923828 16.951172 L 10.109375 19.152344 C 8.259375 20.220344 5.8270313 19.825844 4.5820312 18.089844 C 3.9291425 17.180413 3.6897576 16.098007 3.8535156 15.052734 C 3.9587303 15.122795 4.0516754 15.205719 4.1621094 15.269531 L 8.1738281 17.585938 C 8.4798281 17.761938 8.8560625 17.764797 9.1640625 17.591797 L 13.947266 14.896484 z"></path>
        </svg>
        <h2 className="text-center text-xl font-semibold">
          Exported Data Analysis
        </h2>
      </div>

      <div className="w-full flex justify-center">
        {data && (
          <div className="my-5 flex justify-center rounded-full bg-blue-200 py-2 px-4 w-fit hover:text-white hover:bg-blue-800 transition font-semibold">
            <FinalDownloadLink objectArray={pdfObject} />
          </div>
        )}
      </div>
      {/* <button onClick={() => pdfInput()}>click me when its done</button> */}
      <div className="flex justify-center ">
        <div className="text-center  items-center flex justify-center gap-2 w-fit hover:scale-150 transition max-w-full [&>*]:hover:text-blue-700 ">
          <span className="text-blue-300 font-bold text-4xl transition">
            {data && data!.length}
          </span>
          {data && <span className="font-semibold transition">chats</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 m-12 gap-3">
        {data &&
          data.map((conv) => {
            const updateTime = new Date(
              conv.update_time * 1000
            ).toLocaleDateString("pt-br");
            const messages = Object.values(conv.mapping);

            const messagesList: Message[] = [];
            for (const value of messages) {
              messagesList.push(value);
            }
            const transformedList = messagesList.filter(
              (item) => item.message && item.message?.content?.parts && item.message?.content?.parts[0]?.length > 1
            );
            console.log(transformedList)
            const numberUserInputs = transformedList.filter(
              (item) => item.message.author.role == "user"
            ).length;
            return (
              <div
                className=" items-center border border-slate-200 px-12 py-8 rounded-sm max-h-64 overflow-scroll min-h-24"
                key={uuidv4()}
              >
                <h4 className="font-semibold text-cyan-800">{conv.title}</h4>
                <div className="text-slate-500">
                  <span>Number of user inputs: </span>
                  <span className="text-xl text-blue-500 font-semibold">
                    {numberUserInputs}
                  </span>

                  <p>Last updated: {updateTime}</p>
                </div>
                {transformedList &&
                  transformedList.map((item, secondIndex) => {
                    return (
                      <div key={uuidv4()}>
                        {item.message?.content?.parts &&
                          item.message.content.parts.map((text) => {
                            return (
                              <div key={item.id}>
                                {item.message.author.role == "user" && (
                                  <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                      <AccordionTrigger className="hover:no-underline hover:text-blue-400">
                                        {text}
                                      </AccordionTrigger>
                                      <AccordionContent className="max-h-48 overflow-scroll bg-slate-50 p-6">
                                        {/* Parte do código que tá dando bug vvvvvv What is This*/}
                                        {transformedList[secondIndex + 1].message.content.parts &&
                                          parse(
                                            //@ts-ignore
                                            marked(
                                              transformedList[secondIndex + 1]
                                                .message.content.parts[0]
                                            )
                                          )}
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
      <div className="flex justify-center items-center">
        <input
          type="file"
          // multiple={true}
          onChange={fileInput}
          title=""
          className="file:flex file:flex-col file:w-fit w-48 justify-center flex items-center place-items-center file:rounded-full file:py-2 file:px-4 file:bg-blue-200 file:hover:bg-blue-700 file:transition file:hover:text-white file:cursor-pointer"
        />
      </div>
    </div>
  );
}
