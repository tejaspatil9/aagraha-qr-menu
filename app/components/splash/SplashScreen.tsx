"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="relative flex h-screen items-center justify-center splash-bg overflow-hidden">
      <div className="relative z-10 text-center px-4">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <Image
            src="/images/aagraha-logo.png"
            alt="Aagraha Logo"
            width={160}
            height={160}
            priority
            className="mx-auto mb-6"
          />
        </motion.div>

        {/* Brand name */}
        <motion.h1
          className="text-[36px] splash-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
        >
          Aagraha
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-2 text-sm splash-subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          Aagraha invites you
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="mt-3 text-xs splash-tagline uppercase tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          Authentic Maharashtrian Cuisine
        </motion.p>

        {/* Branch */}
        <motion.p
          className="mt-2 text-[11px] text-[#FFE9B8] tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          Pune
        </motion.p>

        {/* Loading dots */}
        <motion.div
          className="mt-6 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.4 }}
        >
          <span className="dot" />
          <span className="dot delay-1" />
          <span className="dot delay-2" />
        </motion.div>
      </div>
    </div>
  );
}
