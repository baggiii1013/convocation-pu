import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: 'dist',
  allowedDevOrigins: ['10.0.0.171'],
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
