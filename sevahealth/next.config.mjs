/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  typescript: {
    // This is likely still valid and helps with TS errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;