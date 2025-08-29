import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   turbopack: {
    root: "../../", // Points to the workspace root from apps/web to project root
  },
  distDir: 'dist', // Add this line
};

export default nextConfig;
