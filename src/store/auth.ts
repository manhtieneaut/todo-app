import { create } from "zustand";

interface User {
  id: string;
  email: string;
}

interface AuthStore {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  conversations: any[]; // You can type this more strictly if needed
  setConversations: (conversations: any[]) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
}));
