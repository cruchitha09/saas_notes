/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  },
}

module.exports = nextConfig
