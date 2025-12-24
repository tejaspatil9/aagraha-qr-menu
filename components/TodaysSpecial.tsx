"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type Special = {
  id: string;
  image: string;
  title?: string | null;
};

export default function TodaysSpecial() {
  const [specials, setSpecials] = useState<Special[]>([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("todays_specials")
        .select("id, image, title")
        .eq("restaurant_id", "aagraha")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!error && data) setSpecials(data);
    }

    load();
  }, []);

  if (specials.length === 0) return null;

  return (
    <section className="mt-16">
      <h2
        className="text-center text-[26px] mb-5"
        style={{ fontFamily: "var(--font-playfair)", color: "#F5E6C8" }}
      >
        Today’s Special
      </h2>

      <div className="overflow-x-auto">
        <div className="flex gap-4 px-5 pb-2">
          {specials.map((item) => (
            <div
              key={item.id}
              className="relative w-[260px] h-[360px] flex-shrink-0"
            >
              <Image
                src={item.image}
                alt={item.title || "Today's Special"}
                fill
                unoptimized
                className="rounded-2xl object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
