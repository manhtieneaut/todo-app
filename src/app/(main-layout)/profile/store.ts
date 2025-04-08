// src/lib/store/profile.store.ts
import { create } from "zustand";

interface ProfileState {
  userInfo: any;
  loading: boolean;
  editMode: boolean;
  avatarFile: File | null;
  setUserInfo: (user: any) => void;
  setLoading: (state: boolean) => void;
  toggleEditMode: () => void;
  setAvatarFile: (file: File | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  userInfo: null,
  loading: true,
  editMode: false,
  avatarFile: null,
  setUserInfo: (user) => set({ userInfo: user }),
  setLoading: (state) => set({ loading: state }),
  toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
  setAvatarFile: (file) => set({ avatarFile: file }),
}));
