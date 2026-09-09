import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Esto genera la carpeta 'out' actualizada
  images: {
    unoptimized: true, // Requerido para exportación estática
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
