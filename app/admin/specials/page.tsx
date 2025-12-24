"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { uploadImage } from "@/lib/uploadImage";
import { deleteImageByUrl } from "@/lib/deleteImage";

export default function AdminSpecials() {
  const router = useRouter();

  const [specials, setSpecials] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  /* 🔐 AUTH CHECK */
  useEffect(() => {
    if (sessionStorage.getItem("admin-auth") !== "true") {
      router.replace("/admin/login");
      return;
    }
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("todays_specials")
      .select("*")
      .eq("restaurant_id", "aagraha")
      .order("created_at", { ascending: false });

    setSpecials(data || []);
  }

  async function addSpecial() {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    try {
      setUploading(true);

      const imageUrl = await uploadImage(imageFile, "specials");

      const { error } = await supabase.from("todays_specials").insert({
        restaurant_id: "aagraha",
        image: imageUrl,
        title: title || null,
        description: description || null,
        active: true,
      });

      if (error) {
        alert(error.message);
        return;
      }

      setImageFile(null);
      setTitle("");
      setDescription("");
      load();
    } finally {
      setUploading(false);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    await supabase.from("todays_specials").update({ active }).eq("id", id);
    load();
  }

  async function deleteSpecial(s: any) {
    const ok = window.confirm("Delete this special?");
    if (!ok) return;

    await supabase.from("todays_specials").delete().eq("id", s.id);

    if (s.image) {
      await deleteImageByUrl(s.image, "specials");
    }

    load();
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-6">Today’s Special</h1>

      {/* ADD SPECIAL */}
      <div className="bg-[#111] p-4 rounded-xl mb-6 max-w-md space-y-3">
        <input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-black border border-gray-700 rounded"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-black border border-gray-700 rounded text-sm"
        />

        <input
          type="file"
          accept="image/*"
          className="text-sm"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={addSpecial}
          disabled={uploading}
          className="w-full bg-[#7a1f1f] py-2 rounded"
        >
          {uploading ? "Uploading..." : "Add Special"}
        </button>
      </div>

      {/* SPECIAL LIST */}
      <div className="space-y-3 max-w-md">
        {specials.map((s) => (
          <div
            key={s.id}
            className="bg-[#111] p-3 rounded-lg space-y-1"
          >
            <div className="font-medium">
              {s.title || "Special Image"}
            </div>

            {s.description && (
              <div className="text-xs text-gray-400">
                {s.description}
              </div>
            )}

            <div className="flex justify-between text-sm mt-2">
              <button
                onClick={() => toggleActive(s.id, !s.active)}
                className={s.active ? "text-green-400" : "text-yellow-400"}
              >
                {s.active ? "Active" : "Hidden"}
              </button>

              <button
                onClick={() => deleteSpecial(s)}
                className="text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
