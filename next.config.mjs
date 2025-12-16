const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    loader: 'custom',
    loaderFile: './src/components/NextImageLoader.js',
  },
  reactStrictMode: false,

};
export default nextConfig;
