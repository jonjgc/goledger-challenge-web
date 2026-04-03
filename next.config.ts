/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://ec2-50-19-36-138.compute-1.amazonaws.com/api/:path*',
      },
    ]
  },
};

export default nextConfig;
