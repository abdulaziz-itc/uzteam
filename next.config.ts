import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Self-contained production build (.next/standalone) — required for
  // cPanel/Passenger deploys where node_modules on the server may differ.
  output: 'standalone',
};

export default withNextIntl(nextConfig);
