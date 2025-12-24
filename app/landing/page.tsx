import Image from "next/image";
import Link from "next/link";
import { RESTAURANT } from "@/config/restaurant";
import TodaysSpecial from "@/components/TodaysSpecial";
import InlineReview from "@/components/InlineReview";
import TableOSFooter from "@/components/TableOSFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* TOP VIDEO SECTION */}
      <section className="relative">
        <div
          className="w-full h-[520px] overflow-hidden"
          style={{ clipPath: "ellipse(40% 100% at 50% 100%)" }}
        >
          <video
            src="/videos/aagraha-seafood.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-90"
          />
        </div>

        {/* LOGO OVERLAP */}
        <div className="absolute left-1/2 -bottom-14 -translate-x-1/2">
          <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center shadow-xl ring-4 ring-white">
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
          style={{ fontFamily: "var(--font-playfair)", color: "#F5E6C8" }}
        >
          {RESTAURANT.name}
        </h1>

        <p
          className="mt-1 text-[15px]"
          style={{ fontFamily: "var(--font-playfair)", color: "#D1C7B7" }}
        >
          Authentic Maharashtrian Cuisine
        </p>

        <p
          className="mt-3 max-w-md text-[14px] leading-relaxed"
          style={{ fontFamily: "var(--font-playfair)", color: "#AFA99E" }}
        >
          Experience the rich flavors of Maharashtrian seafood and traditional
          delicacies, prepared fresh with authentic spices and recipes.
        </p>

        <div className="mt-7 flex flex-col gap-4 w-full max-w-xs">
          <Link
            href="/menu/en"
            className="w-full rounded-xl bg-[#7a1f1f] py-3 text-white text-base font-medium"
          >
            View Menu
          </Link>

          <Link
            href="/menu/mr"
            className="w-full rounded-xl bg-[#7a1f1f] py-3 text-white text-base font-medium"
          >
            मेनू पहा
          </Link>
        </div>
      </section>

      {/* TODAY'S SPECIAL */}
      <TodaysSpecial />

      {/* INFO SECTION */}
      <section className="mt-14 px-6 text-center">
        <p className="text-sm mb-2" style={{ color: "#D1C7B7" }}>
          📍 {RESTAURANT.address}
        </p>

        <p className="text-sm mb-6" style={{ color: "#AFA99E" }}>
          ⏰ {RESTAURANT.timings}
        </p>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <a
            href={`tel:${RESTAURANT.phone}`}
            className="w-full rounded-xl border border-[#444] py-3 text-white"
          >
            📞 Call Restaurant
          </a>

          <a
            href={`https://wa.me/${RESTAURANT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-xl bg-green-600 py-3 text-white"
          >
            💬 WhatsApp Order
          </a>
        </div>
      </section>

      {/* INLINE QR REVIEW (GOOGLE-SAFE) */}
      <InlineReview />

      {/* TABLE OS BRANDING */}
      <TableOSFooter />

      <div className="h-16" />
    </main>
  );
}
