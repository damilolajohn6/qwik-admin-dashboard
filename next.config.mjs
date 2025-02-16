import { withGluestackUI } from "@gluestack/ui-next-adapter";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["nativewind", "react-native-css-interop"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com"], // Add Cloudinary domain here
  },
};

export default withGluestackUI(nextConfig);
