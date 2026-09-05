/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.100.16', 'localhost'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/assets/images/career/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
