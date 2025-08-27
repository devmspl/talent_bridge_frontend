import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "38.242.230.126",
        port: "5832",
        pathname: "/assets/images/**",
      },
      {
        protocol: "https",
        hostname: "backend.webridgetalent.com",
        port: "",
        pathname: "/assets/images/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
