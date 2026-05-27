/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "kaysdentalclinic.com" },
      { protocol: "https", hostname: "img.youtube.com" }
    ]
  }
};
module.exports = nextConfig;
