import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sunbathingcalculator.com" }],
        destination: "https://sunbathingcalculator.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
