import { create } from 'zustand';


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
  }
  
  export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    deleteTask: (taskId) => set((state) => ({ tasks: state.tasks.filter(task => task.id !== taskId) })),
  }));

  