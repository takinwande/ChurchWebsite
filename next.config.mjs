/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: [
      'sanity',
      '@sanity/vision',
      '@sanity/ui',
      '@sanity/icons',
      'styled-components',
      'react-is',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}

export default config
