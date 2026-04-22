import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";
interface FetchMessageProps {
    messages: Message[];
    cursor?: string;
}
const pagelimit = 50;
export const chatService = {
    async fetchConversations(): Promise<ConversationResponse> {
        const response = await api.get("/conversations");
        return response.data;
    },
    async fetchMessages(id: string, cursor?: string): Promise<FetchMessageProps> {
        const res = await api.get(`/conversations/${id}/messages?limit=${pagelimit}&cursor=${cursor}`);
        return { messages: res.data.messages, cursor: res.data.nextCursor };
    },
    async sendDirectMessage(recipipentId: string,
        content: string = " ",
        imageUrl?: string,
        conversationId?: string
    ) {
        const res = await api.post("/messages/direct", { recipipentId, content, imageUrl, conversationId })
        return res.data.message;
    },
    async sendGroupMessage(conversationId: string, content: string = "", imageUrl?: string) {
        const res = await api.post("/messages/group", {
            conversationId, content, imageUrl
        })
        return res.data.message;
    },
    async markAsSeen(conversationId: string){
        const res = await api.patch(`/conversation/${conversationId}/seen`);
        return res.data;
    } 
}