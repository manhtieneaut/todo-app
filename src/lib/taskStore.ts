import { create } from "zustand";
import { supabase } from "@/app/supabaseClient"; // Đảm bảo đường dẫn đúng

interface Todo {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
}

interface TodoStore {
    todos: Todo[];
    loading: boolean;
    error: string;
    fetchTodos: () => Promise<void>;
    setTodos: (todos: Todo[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
    todos: [],
    loading: true,
    error: "",

    fetchTodos: async () => {
        set({ loading: true });
        const { data, error } = await supabase.from("todos").select("*");
        if (error) {
            set({ error: "Không thể lấy danh sách todos: " + error.message });
        } else {
            set({ todos: data || [] });
        }
        set({ loading: false });
    },

    
    setTodos: (todos) => set({ todos }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
