"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  function login() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin-auth", "true");
      router.push("/admin");
    } else {
      alert("Wrong password");
    }
  }

  return (
    <main className="min-h-screen bg-[#fdf5ee] flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-[360px]">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Admin Panel
        </h1>

        <input
          type="password"
          placeholder="Enter Admin Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-orange-400 text-white py-3 rounded"
        >
          Login
        </button>
      </div>
    </main>
  );
}
