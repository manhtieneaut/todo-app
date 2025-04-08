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
