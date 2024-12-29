import { NextRequest } from "next/server"
import { Conversation } from "./types"

export async function GET(request: Request) {
    return Response.json({'chills' : 'data'})
}

export async function POST(request: NextRequest) {
    const data:Conversation[] =  await request.json()
    // const files = data.getAll('files')
    

    // console.log(data.values())
    // console.log(data)

    // for (const file of data.getAll('files')) {
    //     console.log(file)
    // }

    // console.log(data.getAll('files'))
    try {
        // const jsonData:Conversation[] = JSON.parse(finalData)
        return Response.json(data)
    } catch  {
        console.log("Not valid JSON!")
    }

    return Response.json(data)
}