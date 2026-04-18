import type { User } from "./user";
import type { Conversation, Message } from "./chat";
import type { Socket } from "socket.io-client";
export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    setAccessToken: (accessToken: string) => void;
    clearState: () => void;


    signUp: (
        username: string,
        password: string,
        email: string,
        firstName: string,
        lastName: string
    ) => Promise<void>;
    signIn: (
        username: string,
        password: string
    ) => Promise<void>;
    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
}
export interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
}
export interface ChatState {
    conversations: Conversation[];
    messages: Record<string, {
        items: Message[];
        hasMore: boolean;
        nextCursor?: string | null;
    }>;
    activeConversationId: string | null;
    convoLoading: boolean;
    messageLoading: boolean;
    reset: () => void;
    setActiveConversation: (id: string | null) => void;
    fetchConversations: () => Promise<void>;
    fetchMessages: (ConversationId?: string) => Promise<void>;
    sendDirectMessage:(
        recipientId: string,
        content: string,
        imrUrl?: string
    ) => Promise<void>;
    sendGroupMessage:(
        conversationId: string,
        content: string,
        imrUrl: string
    ) => Promise<void>
    // add messages
    addMessage: (message: Message) => Promise<void>;
    //update convo
    updateConversation: (conversation: Conversation) => Promise<void>;
}
export interface SocketState{
    socket: Socket | null;
    onlineUsers: string [];
    connectSocket: () => void;
    disconnectSocket: () =>  void;
}