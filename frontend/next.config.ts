import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blogs/:blog/:handle",
        destination: "/read/:handle",
        permanent: true,
      },
      {
        source: "/pages/service",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/pages/visit",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/pages/shop",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/pages/blog",
        destination: "/read",
        permanent: true,
      },
      {
        source: "/blogs/:blog",
        destination: "/read",
        permanent: true,
      },
      {
        source: "/collections/newest-products",
        destination: "/shop/new",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};

export default nextConfig;
