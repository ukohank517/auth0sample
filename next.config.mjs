/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [ // プロフィール画像のURLを許可する
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
