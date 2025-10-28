import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 🚀 This tells Vercel to ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xzgoebnirdpnxgulrxdt.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
