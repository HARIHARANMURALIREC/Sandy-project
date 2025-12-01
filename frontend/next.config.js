/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'images.unsplash.com'],
  },
  i18n: {
    locales: ['en', 'hi', 'ta'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
