/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'fwztgjqmqfqfvnqbuvxf.supabase.co',
    ],
  },
}

export default nextConfig
