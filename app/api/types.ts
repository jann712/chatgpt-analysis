export type Message = {
    message: {
        content: {
            parts: [string]
        }
    }
}

type Mapping = {
    message: Message
}

export type Conversation = {
    title: string
    create_time: string
    update_time: string
    mapping: {
        [key:string]: Message
    }
    
    
}