/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  },
};

export default nextConfig;
