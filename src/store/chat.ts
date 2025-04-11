import { create } from 'zustand';
import { toast } from 'sonner';
import { sendMessage, uploadFileToBucket, createConversation, addUserToConversation } from '@/api/chatApi';

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

  sendNewMessage: (message: string, file: File | null) => Promise<void>;
  createNewConversation: (name: string) => Promise<void>;
  addUser: (userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: [],
  currentUserId: null,
  selectedConversation: null,
  setConversations: (convs) => set({ conversations: convs }),
  setMessages: (msgs) => set({ messages: msgs }),
  setCurrentUserId: (id) => set({ currentUserId: id }),
  setSelectedConversation: (conv) => set({ selectedConversation: conv }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  sendNewMessage: async (message, file) => {
    const { selectedConversation, currentUserId } = get();
    if ((!message.trim() && !file) || !selectedConversation || !currentUserId) return;

    try {
      let fileUrl = null;
      if (file) {
        fileUrl = await uploadFileToBucket(file);
      }

      await sendMessage(selectedConversation.id, currentUserId, message, fileUrl);
    } catch {
      toast.error('Failed to send message');
    }
  },

  createNewConversation: async (name) => {
    if (!name.trim()) {
      toast.error('Conversation name cannot be empty');
      return;
    }

    try {
      const data = await createConversation(name);
      const { conversations } = get();
      set({ conversations: [...conversations, ...data] });
      toast.success('Conversation created and you were added as a member');
    } catch {
      toast.error('Failed to create conversation');
    }
  },

  addUser: async (userId) => {
    const { selectedConversation } = get();
    if (!selectedConversation || !userId) return;

    try {
      await addUserToConversation(selectedConversation.id, userId);
      toast.success('User added');
    } catch {
      toast.error('Failed to add user');
    }
  },
}));
