/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export for production builds when specifically requested
  ...(process.env.EXPORT_STATIC === 'true' ? {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'dist',
    images: {
      unoptimized: true
    }
  } : {}),
  
  // Enable standalone output for Docker/App Runner
  ...(process.env.NODE_ENV === 'production' && process.env.EXPORT_STATIC !== 'true' ? {
    output: 'standalone'
  } : {}),
  
  // Fix the workspace root warning
  outputFileTracingRoot: process.cwd(),
  
  // Standard Next.js configuration
  images: {
    unoptimized: process.env.EXPORT_STATIC === 'true'
  }
};

export default nextConfig;
