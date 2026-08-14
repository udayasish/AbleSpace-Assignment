import type { NextConfig } from "next";

// const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:4000";
const BACKEND_URL =
  process.env.BACKEND_URL ?? "https://ablespace-assignment-6qcj.onrender.com";

const nextConfig: NextConfig = {
  // Proxies the API through this origin so auth cookies stay first-party.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/:path*` }];
  },
};

export default nextConfig;
