import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "http://auth-service:8001/auth/:path*"
            : "http://localhost:8001/auth/:path*",
      },
      {
        source: "/api/posts/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "http://posts-service:8002/posts/:path*"
            : "http://localhost:8002/posts/:path*",
      },
    ];
  },
};

export default nextConfig;