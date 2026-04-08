import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:3005/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
