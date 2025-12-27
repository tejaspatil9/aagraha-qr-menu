"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RESTAURANT } from "@/config/restaurant";
import TodaysSpecial from "@/components/TodaysSpecial";
import InlineReview from "@/components/InlineReview";
import TableOSFooter from "@/components/TableOSFooter";

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.playbackRate = 1.25; // 🔥 faster feel on mobile

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Mobile browsers may block silently
        });
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* TOP VIDEO SECTION */}
      <section className="relative">
        <div
          className="w-full h-[520px] overflow-hidden"
          style={{ clipPath: "ellipse(40% 100% at 50% 100%)" }}
        >
          <video
            ref={videoRef}
            src="/videos/aagraha-seafood.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/video-poster.jpeg"
            className="w-full h-full object-cover brightness-95"
          />
        </div>

        {/* LOGO OVERLAP */}
        <div className="absolute left-1/2 -bottom-14 -translate-x-1/2">
          <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-xl ring-2 ring-gray-200">
            <Image
              src="/images/aagraha-logo.png"
              alt={`${RESTAURANT.name} Logo`}
              width={130}
              height={130}
              priority
              className="rounded-full"
            />
          </div>
        </div>
      </section>

      {/* BRAND & CTA */}
      <section className="pt-24 px-5 text-center flex flex-col items-center">
        <h1
          className="text-[36px] tracking-wide"
          style={{ fontFamily: "var(--font-playfair)", color: "#3b2f2f" }}
        >
          {RESTAURANT.name}
        </h1>

        <p
          className="mt-1 text-[15px]"
          style={{ fontFamily: "var(--font-playfair)", color: "#6b5f5f" }}
        >
          Authentic Maharashtrian Cuisine
        </p>

        <p
          className="mt-3 max-w-md text-[14px] leading-relaxed"
          style={{ fontFamily: "var(--font-playfair)", color: "#857c7c" }}
        >
          Experience the rich flavors of Maharashtrian seafood and traditional
          delicacies, prepared fresh with authentic spices and recipes.
        </p>

        <div className="mt-7 flex flex-col gap-4 w-full max-w-xs">
          <Link
            href="/menu/en"
            className="w-full rounded-xl bg-[#7a1f1f] py-3 text-white text-base font-medium shadow-md"
          >
            View Menu
          </Link>

          <Link
            href="/menu/mr"
            className="w-full rounded-xl bg-[#7a1f1f] py-3 text-white text-base font-medium shadow-md"
          >
            मेनू पहा
          </Link>
        </div>
      </section>

      {/* TODAY'S SPECIAL */}
      <TodaysSpecial />

      {/* INFO SECTION */}
      <section className="mt-14 px-6 text-center">
        <p className="text-sm mb-2 text-gray-700">
          📍 {RESTAURANT.address}
        </p>

        <p className="text-sm mb-6 text-gray-500">
          ⏰ {RESTAURANT.timings}
        </p>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <a
            href={`tel:${RESTAURANT.phone}`}
            className="w-full rounded-xl border border-gray-300 py-3 text-gray-800 bg-white"
          >
            📞 Call Restaurant
          </a>

          <a
            href={`https://wa.me/${RESTAURANT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-xl bg-green-600 py-3 text-white shadow-md"
          >
            💬 WhatsApp Order
          </a>
        </div>
      </section>

      {/* INLINE QR REVIEW */}
      <InlineReview />

      {/* TABLE OS BRANDING */}
      <TableOSFooter />

      <div className="h-16" />
    </main>
  );
}
