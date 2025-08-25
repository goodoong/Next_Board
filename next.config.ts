// @ts-expect-error - next-pwa has no type definitions
import withPWA from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // i18n 등 추가 옵션
};

export default withPWA({
  dest: "public",
  runtimeCaching: [],
})(nextConfig);
