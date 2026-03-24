/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      "/api/send": ["./node_modules/@sparticuz/chromium/bin/**"]
    }
  }
};

export default nextConfig;
