// src/store/task.store.ts
import { create } from 'zustand';
import { deleteTask, updateTaskStatus } from '@/api/taskApi';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
}

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatusInStore: (taskId: string, newStatus: string) => Promise<void>;
  removeTaskFromServer: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task],
  })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),

  updateTaskStatusInStore: async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
      }));
    } catch (err: any) {
      toast.error(`Lỗi cập nhật trạng thái: ${err.message}`);
      throw err;
    }
  },

  removeTaskFromServer: async (taskId) => {
    try {
      await deleteTask(taskId);
      get().deleteTask(taskId);
      toast.success('Đã xóa công việc');
    } catch (err: any) {
      toast.error(`Lỗi xóa công việc: ${err.message}`);
      throw err;
    }
  },
}));
