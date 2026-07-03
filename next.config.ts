import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cf-img.autorevo.com",
      },
      {
        protocol: "https",
        hostname: "x-assets.autorevo-powersites.com",
      },
    ],
  },
};

export default nextConfig;
