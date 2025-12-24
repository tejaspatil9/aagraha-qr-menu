"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminCategories() {
  const router = useRouter();
  const [nameEn, setNameEn] = useState("");
  const [nameMr, setNameMr] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin-auth") !== "true") {
      router.replace("/admin/login");
    }
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", "aagraha")
      .order("sort_order");

    setCategories(data || []);
  }

  async function addCategory() {
    if (!nameEn || !nameMr) {
      alert("English and Marathi names required");
      return;
    }

    await supabase.from("categories").insert({
      restaurant_id: "aagraha",
      name_en: nameEn,
      name_mr: nameMr,
      sort_order: categories.length + 1,
    });

    setNameEn("");
    setNameMr("");
    load();
  }

  async function deleteCategory(id: string) {
    const confirm = window.confirm("Delete this category?");
    if (!confirm) return;

    await supabase.from("categories").delete().eq("id", id);
    load();
  }

  async function reorder(fromId: string, toId: string) {
    if (fromId === toId) return;

    const updated = [...categories];
    const fromIndex = updated.findIndex((c) => c.id === fromId);
    const toIndex = updated.findIndex((c) => c.id === toId);

    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    setCategories(updated);

    for (let i = 0; i < updated.length; i++) {
      await supabase
        .from("categories")
        .update({ sort_order: i + 1 })
        .eq("id", updated[i].id);
    }
  }

  return (
    <main className="min-h-screen bg-[#fdf5ee] p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Add Category</h2>

        <input
          placeholder="Category Name (English)"
          className="w-full border p-3 rounded"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />

        <input
          placeholder="Category Name (Marathi)"
          className="w-full border p-3 rounded"
          value={nameMr}
          onChange={(e) => setNameMr(e.target.value)}
        />

        <button
          onClick={addCategory}
          className="w-full bg-orange-400 text-white py-3 rounded"
        >
          Add Category
        </button>

        <h3 className="font-semibold mt-4">Reorder Categories</h3>

        {categories.map((c) => (
          <div
            key={c.id}
            draggable
            onDragStart={() => setDragId(c.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => reorder(dragId!, c.id)}
            className="flex justify-between items-center p-3 border rounded cursor-move"
          >
            <span>{c.name_en}</span>
            <button
              onClick={() => deleteCategory(c.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
