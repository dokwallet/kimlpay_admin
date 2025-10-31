const nextConfig = {
  env:{
    NEXT_SHARP_PATH: process.env.NEXT_SHARP_PATH,
    BUGFENDER_APP_KEY: process.env.BUGFENDER_APP_KEY,
    KIML_ENV: process.env.KIML_ENV,
  },
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
  webpack: config => {
    config.module.rules.push({
      test: /\.html$/,
      loader: 'html-loader',
    });

    return config;
  },
};
export default nextConfig;
