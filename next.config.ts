import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.calcsuite.app" }],
        destination: "https://calcsuite.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
