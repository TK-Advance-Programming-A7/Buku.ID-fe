/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images-na.ssl-images-amazon.com",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self' https: http:; img-src 'self' https: http:; script-src 'self' https: http:; style-src 'self' https: http:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
