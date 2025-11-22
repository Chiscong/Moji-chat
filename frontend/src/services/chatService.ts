import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";
interface FetchMessageProps{
    messages: Message[];
    cursor?:string ;
}
const pagelimit = 50;
export const chatService = {
    async fetchConversations(): Promise<ConversationResponse> {
        const response = await api.get("/conversations");
        return response.data;
    },
    async fetchMessages(id: string , cursor?: string ): Promise<FetchMessageProps> {
        const res = await api.get(`/conversations/${id}/messages?limit=${pagelimit}&cursor=${cursor}`);
        return {messages : res.data.messages, cursor: res.data.nextCursor};
    }
}