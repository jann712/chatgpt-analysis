export type Message = {
    message: {
        content: {
            parts: [string]
        }
        author: {
            role: string
        }
    }
    create_time: number
    
    id: string
}

type Mapping = {
    message: Message
}

export type Conversation = {
    title: string
    create_time: number
    update_time: number
    mapping: {
        [key:string]: Message
    }
    
    
}

export type messageObject = {
    title: string
    numberMessages: number
}
