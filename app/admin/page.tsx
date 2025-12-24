"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem("admin-auth") !== "true") {
      router.replace("/admin/login");
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#fdf5ee] p-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Admin Panel
      </h1>

      <div className="max-w-md mx-auto space-y-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl mb-4">Add Category</h2>
          <Link
            href="/admin/categories"
            className="block bg-orange-400 text-white py-3 rounded text-center"
          >
            Open Categories
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl mb-4">Add Dish</h2>
          <Link
            href="/admin/dishes"
            className="block bg-emerald-500 text-white py-3 rounded text-center"
          >
            Open Dishes
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl mb-4">Today’s Special</h2>
          <Link
            href="/admin/specials"
            className="block bg-red-500 text-white py-3 rounded text-center"
          >
            Open Specials
          </Link>
        </div>

      </div>
    </main>
  );
}
