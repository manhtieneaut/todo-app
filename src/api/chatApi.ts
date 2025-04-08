// app/chat/api.ts
import { supabase } from '@/lib/supabaseClient';

export const fetchCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const fetchConversations = async () => {
  const { data, error } = await supabase.from('conversations').select('*');
  if (error) throw error;
  return data;
};

export const fetchMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('sent_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  message: string,
  fileUrl: string | null
) => {
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: senderId,
    message,
    file_url: fileUrl,
  });
  if (error) throw error;
};

export const uploadFileToBucket = async (file: File) => {
  const sanitizeFileName = (fileName: string) => {
    return fileName
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const { data, error } = await supabase.storage.from('chat-files').upload(fileName, file);
  if (error) throw error;
  return data.path;
};

export const createConversation = async (name: string) => {
  const { data, error } = await supabase.from('conversations').insert([{ name }]).select();
  if (error) throw error;
  return data;
};

export const deleteConversation = async (conversationId: string) => {
  const { error } = await supabase.from('conversations').delete().eq('id', conversationId);
  if (error) throw error;
};

export const addUserToConversation = async (conversationId: string, userId: string) => {
  const { error } = await supabase.from('conversation_members').insert({
    conversation_id: conversationId,
    user_id: userId,
  });
  if (error) throw error;
};
