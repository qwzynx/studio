import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Portfolio images only change alongside a deploy — cache the optimized
    // variants for 31 days instead of the 4-hour default.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
