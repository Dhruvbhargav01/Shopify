/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',  
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nozjpcqsgmvpqncgwgvu.supabase.co',  
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig
