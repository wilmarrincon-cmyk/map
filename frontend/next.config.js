/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone', // Necesario para Docker
  async rewrites() {
    // Solo usar rewrites en desarrollo, en producción usar NEXT_PUBLIC_API_URL
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*',
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
