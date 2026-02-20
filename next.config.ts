import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid "inferred workspace root" warning when multiple lockfiles exist
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
