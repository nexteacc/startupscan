import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: {
    // 排除 Clerk 相关组件，避免编译器优化导致的问题
    compilationMode: "annotation",
  },
};

export default nextConfig;
