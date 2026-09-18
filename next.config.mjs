/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type errors fail the build. They were suppressed while the site was being
  // rebuilt; the codebase is clean now, so a bad deploy should stop here
  // rather than show up as a broken dashboard.
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
