"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { uploadImage } from "@/lib/uploadImage";
import { deleteImageByUrl } from "@/lib/deleteImage";

export default function AdminDishes() {
  const router = useRouter();

  /* 🔐 FORCE LOGIN EVERY VISIT */
  useEffect(() => {
    if (sessionStorage.getItem("admin-auth") !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  const [categories, setCategories] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name_en: "",
    name_mr: "",
    price: "",
    category_id: "",
    is_veg: false,
    is_recommended: false,
  });

  async function loadData() {
    const { data: catData } = await supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", "aagraha")
      .order("sort_order");

    const { data: dishData } = await supabase
      .from("dishes")
      .select("*")
      .eq("restaurant_id", "aagraha")
      .order("created_at", { ascending: false });

    if (catData) setCategories(catData);
    if (dishData) setDishes(dishData);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addDish() {
    if (!form.name_en || !form.name_mr || !form.price || !form.category_id) {
      alert("Fill all required fields");
      return;
    }

    try {
      setUploading(true);

      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "menu");
      }

      const { error } = await supabase.from("dishes").insert({
        restaurant_id: "aagraha",
        name_en: form.name_en,
        name_mr: form.name_mr,
        price: Number(form.price),
        category_id: form.category_id,
        is_veg: form.is_veg,
        is_recommended: form.is_recommended,
        image: imageUrl,
      });

      if (error) {
        alert(error.message);
        return;
      }

      setForm({
        name_en: "",
        name_mr: "",
        price: "",
        category_id: "",
        is_veg: false,
        is_recommended: false,
      });

      setImageFile(null);
      loadData();
    } finally {
      setUploading(false);
    }
  }

  async function deleteDish(d: any) {
    const ok = window.confirm("Delete this dish?");
    if (!ok) return;

    await supabase.from("dishes").delete().eq("id", d.id);

    if (d.image) {
      await deleteImageByUrl(d.image, "menu");
    }

    loadData();
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-6">Manage Dishes</h1>

      {/* ADD DISH */}
      <div className="bg-[#111] p-4 rounded-xl mb-8 max-w-md space-y-3">
        <input
          placeholder="Dish Name (English)"
          value={form.name_en}
          onChange={(e) => setForm({ ...form, name_en: e.target.value })}
          className="w-full p-2 bg-black border border-gray-700 rounded"
        />

        <input
          placeholder="Dish Name (Marathi)"
          value={form.name_mr}
          onChange={(e) => setForm({ ...form, name_mr: e.target.value })}
          className="w-full p-2 bg-black border border-gray-700 rounded"
        />

        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-2 bg-black border border-gray-700 rounded"
        />

        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="w-full p-2 bg-black border border-gray-700 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_en}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_veg}
            onChange={() => setForm({ ...form, is_veg: !form.is_veg })}
          />
          Veg
        </label>

        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_recommended}
            onChange={() =>
              setForm({ ...form, is_recommended: !form.is_recommended })
            }
          />
          Recommended
        </label>

        <button
          onClick={addDish}
          disabled={uploading}
          className="w-full bg-[#7a1f1f] py-2 rounded"
        >
          {uploading ? "Uploading..." : "Add Dish"}
        </button>
      </div>

      {/* DISH LIST */}
      <div className="space-y-3 max-w-md">
        {dishes.map((d) => (
          <div key={d.id} className="bg-[#111] p-3 rounded-lg">
            <div className="flex justify-between">
              <span>{d.name_en}</span>
              <span>₹{d.price}</span>
            </div>

            <div className="flex gap-4 text-xs mt-2">
              <span className={d.is_veg ? "text-green-400" : "text-red-400"}>
                {d.is_veg ? "Veg" : "Non-Veg"}
              </span>

              {d.is_recommended && (
                <span className="text-yellow-400">⭐ Recommended</span>
              )}

              <button
                onClick={() => deleteDish(d)}
                className="text-red-400 ml-auto"
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
