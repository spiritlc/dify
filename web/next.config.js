const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

const env = process.env.NODE_ENV
console.log('环境', env)
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: env === 'development' ? '' : '',
  // // // // publicRuntimeConfig: {
  // // // //   basePath: "/app",
  // // // // },
  assetPrefix: env === 'development' ? '' : '/airtool/',
  productionBrowserSourceMaps: false, // enable browser source map generation during the production build
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
  },
  // fix all before production. Now it slow the develop speed.
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
    dirs: ['app', 'bin', 'config', 'context', 'hooks', 'i18n', 'models', 'service', 'test', 'types', 'utils'],
  },
  typescript: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/airtool/apps',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/skytool/console/:path*',
        destination: 'https://bd-ys.haier.net/skytool/console/:path*',
      },
      {
        source: '/skytool/:path*',
        destination: 'https://bd-ys.haier.net/skytool/:path*',
      },
      {
        source: '/system-manager-rest/:path*',
        destination: 'https://data.haier.net/system-manager-rest/:path*',
      },
      {
        source: '/ommp/:path*',
        destination: 'https://ommp.haiersmarthomes.com:9999/ommp/:path*',
      },
    ]
  },
  output: 'standalone',
}

module.exports = withMDX(nextConfig)
