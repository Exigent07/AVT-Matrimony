import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["*.exigent07.com"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
