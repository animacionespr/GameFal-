/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/GameFal-',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: '/GameFal-',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
}

module.exports = nextConfig
