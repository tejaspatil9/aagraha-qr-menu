import { supabase } from "./supabaseClient";

/**
 * Deletes image from Supabase Storage using public URL
 */
export async function deleteImageByUrl(
  imageUrl: string,
  bucket: "menu" | "specials"
) {
  try {
    if (!imageUrl) return;

    const url = new URL(imageUrl);
    const path = url.pathname.split(`/${bucket}/`)[1];
    if (!path) return;

    await supabase.storage.from(bucket).remove([path]);
  } catch (err) {
    console.warn("Image delete failed", err);
  }
}