/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static site (ADR-0005): `next build` writes `out/`, no server needed.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Isolate local browser verification from an already running development app.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: {
    // The persisted Turbopack dev cache can grow to many GB and stall every
    // compile on writing it; each `pnpm dev` restart recompiles instead.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;