// src/lib/api/profile.api.ts
import { supabase } from "@/lib/supabaseClient";

export const getUserInfo = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Chưa đăng nhập");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return data;
};

export const updateUserInfo = async (id: string, values: any) => {
  const { error } = await supabase
    .from("users")
    .update(values)
    .eq("id", id);

  if (error) throw error;
};

export const uploadAvatar = async (file: File) => {
  const sanitizeFileName = (fileName: string) => {
    return fileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;

  const { data, error } = await supabase.storage
    .from("profile")
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("profile")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};
