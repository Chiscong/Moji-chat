import { useChatStore } from "@/stores/useChatStore"
import ChatWelcomeScreen from "./ChatWelcomeScreen";

const ChatWindowBody = () => {
    const { activeConversationId, conversations, messages: allMessages } = useChatStore();
    const messages = allMessages[activeConversationId!]?.items || [];
    const selectedConvo = conversations.find((conv) => conv._id === activeConversationId) ?? null;
    if (!selectedConvo) {
        return <ChatWelcomeScreen />
    }
    if (!messages) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                Chưa có tin nhắn nào trong cuộc trò chuyện này.
            </div>
        )
    }
    return (
        <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden" >
            <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar">
                {messages.map((message) => (
                    <>
                    {message.content}
                    </>
                ))}
            </div>
        </div>
    )
}

export default ChatWindowBody