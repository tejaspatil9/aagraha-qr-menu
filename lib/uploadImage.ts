import { supabase } from "./supabaseClient";

export async function uploadImage(file: File, folder: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from("menu")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("menu")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
