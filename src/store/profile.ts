import { create } from 'zustand';
import { updateUserInfo, uploadAvatar } from '@/api/profileApi';
import { toast } from 'sonner';

interface ProfileState {
  userInfo: any;
  loading: boolean;
  editMode: boolean;
  avatarFile: File | null;
  setUserInfo: (user: any) => void;
  setLoading: (state: boolean) => void;
  toggleEditMode: () => void;
  setAvatarFile: (file: File | null) => void;
  handleSave: (values: any) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  userInfo: null,
  loading: true,
  editMode: false,
  avatarFile: null,
  setUserInfo: (user) => set({ userInfo: user }),
  setLoading: (state) => set({ loading: state }),
  toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
  setAvatarFile: (file) => set({ avatarFile: file }),

  handleSave: async (values) => {
    const { userInfo, avatarFile, setUserInfo, setAvatarFile, toggleEditMode } = get();

    if (!userInfo) return;

    let avatarUrl = userInfo.avatar_url;

    try {
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
        if (!avatarUrl) throw new Error('Không thể upload avatar.');
      }

      await updateUserInfo(userInfo.id, { ...values, avatar_url: avatarUrl });

      setUserInfo({ ...userInfo, ...values, avatar_url: avatarUrl });
      setAvatarFile(null);
      toggleEditMode();
      toast.success('Cập nhật thông tin thành công!');
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi cập nhật thông tin.');
    }
  },
}));
