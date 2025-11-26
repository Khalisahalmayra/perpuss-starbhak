/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "perpustakaan.jakarta.go.id",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "a.cdn-myedisi.com",
      },
      {
        protocol: "https",
        hostname: "penerbitlitnus.co.id",
      },
      {
        protocol: "https",
        hostname: "cdn.gramedia.com",
      },
      {
        protocol: "https",
        hostname: "www.samudrabiru.co.id",
      },
    ],
  },
};

export default nextConfig;
