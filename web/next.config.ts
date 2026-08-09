import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_URL
          ? `${process.env.API_URL}/:path*`
          : "https://gemstone-seekers-72pb.onrender.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
