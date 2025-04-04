// lib/authStore.ts
import { create } from 'zustand';

interface AuthState {
    user: any; // Sử dụng 'any' hoặc định nghĩa kiểu phù hợp với cấu trúc của đối tượng user từ Supabase
    setUser: (user: any) => void;
    clearUser: () => void;
    getUser: () => any; // Thêm hàm getter để lấy thông tin người dùng
}

const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    getUser: () => get().user, // Trả về trạng thái người dùng hiện tại
}));

export default useAuthStore;
