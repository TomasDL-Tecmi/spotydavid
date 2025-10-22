/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // Por si vienen de YouTube directamente
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com", // Thumbnails de artistas o álbumes
      },
    ],
  },
};

export default nextConfig;
