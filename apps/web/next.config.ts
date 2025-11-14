import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: 'dist',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.assettype.com',
        pathname: '/newslaundry/2022-01/**'
      },
      {
        protocol: 'https',
        hostname: 'medianoise.in',
        pathname: '/wp-content/uploads/**'
      },
      {
        protocol: 'https',
        hostname: 'www.catchkaro.in',
        pathname: '/wp-content/uploads/**'
      },
    ],
  },
};

export default nextConfig;
