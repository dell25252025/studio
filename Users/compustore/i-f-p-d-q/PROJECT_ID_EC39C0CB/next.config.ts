/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    // This allows the Next.js dev server to accept requests from the
    // Firebase Studio web preview and the Android emulator.
<<<<<<< HEAD
    allowedDevOrigins: ["https://*.cloudworkstations.dev", "http://*.localhost"],
=======
    allowedDevOrigins: ["https://*.cloudworkstations.dev", "http://*.localhost", "http://localhost"],
>>>>>>> 0d1192a5251aac79b7e20cc5776074323faf8589
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https://',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig;
