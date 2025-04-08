// app/chat/store.ts
import { create } from 'zustand';

interface Conversation {
  id: string;
  name: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string | null;
  file_url: string | null;
  sent_at: string;
}

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  currentUserId: string | null;
  selectedConversation: Conversation | null;
  setConversations: (convs: Conversation[]) => void;
  setMessages: (msgs: Message[]) => void;
  setCurrentUserId: (id: string) => void;
  setSelectedConversation: (conv: Conversation | null) => void;
  addMessage: (msg: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  messages: [],
  currentUserId: null,
  selectedConversation: null,
  setConversations: (convs) => set({ conversations: convs }),
  setMessages: (msgs) => set({ messages: msgs }),
  setCurrentUserId: (id) => set({ currentUserId: id }),
  setSelectedConversation: (conv) => set({ selectedConversation: conv }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));
