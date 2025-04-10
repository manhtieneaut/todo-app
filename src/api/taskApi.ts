import { supabase } from '@/lib/supabaseClient';

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from("tasks")
    .select('id, title, description, status, due_date');

  if (error) throw error;
  return data;
};

export const addTask = async (task: any) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([task])
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) throw error;
};

// taskApi.ts
export const updateTaskStatus = async (taskId: string, newStatus: string) => {
  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', taskId);

  if (error) throw error;
};

export const shareTaskWithUser = async (taskId: string, userId: string) => {
  const { error } = await supabase.from('task_shares').insert({
    task_id: taskId,
    shared_with: userId, // ✅ Đúng tên cột
  });

  return { error };
};
