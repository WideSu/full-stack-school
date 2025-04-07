/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true, // Enable source maps in production
};

export default nextConfig;
