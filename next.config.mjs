/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com", // sometimes Unsplash uses this CDN too
      },
        {
        protocol: "https",
        hostname: "res.cloudinary.com", // <-- Cloudinary access
      },
    ],
  },
};

export default nextConfig;
