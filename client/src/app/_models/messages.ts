export interface Message {
    id: number
    senderId: number
    senderName: string
    senderPhotoUrl: string
    recieverId: number
    receiverName: string
    receiverPhotoUrl: string
    content: string
    dateRead?: Date
    sentDate: Date
  }