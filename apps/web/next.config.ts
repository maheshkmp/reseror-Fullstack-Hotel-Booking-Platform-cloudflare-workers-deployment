import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["core"],
  // Cross-subdomain cookies are now handled by better-auth configuration
  // No rewrites needed - the auth client calls the API directly
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};
// Forced restart to pick up .env changes
export default nextConfig;
