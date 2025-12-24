import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wlhlyubzheogdlazqbte.supabase.co",
      },
    ],
  },
};

export default nextConfig;
