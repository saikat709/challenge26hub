import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@auth/prisma-adapter", "@auth/core"],
};

export default nextConfig;
