import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Dois modos de build:
// - padrão (npm run build): o painel (Payload) com as páginas do blog para a prévia;
// - STATIC_EXPORT=true (npm run build:static): só o site público, em HTML, para o Cloudflare Pages.
const staticExport = process.env.STATIC_EXPORT === 'true'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL
const panelOnly = !staticExport && Boolean(siteUrl) && siteUrl !== process.env.NEXT_PUBLIC_SERVER_URL

const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(staticExport ? { output: 'export' as const } : {}),
  images: {
    unoptimized: staticExport,
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  // No site estático os cabeçalhos ficam em public/_headers (Cloudflare Pages).
  ...(staticExport
    ? {}
    : {
        async headers() {
          return [
            // O painel inteiro fica fora dos buscadores quando o site público está em outro endereço;
            // caso contrário, só /admin, /api e /next.
            ...(panelOnly
              ? [{ source: '/:path*', headers: noindex }]
              : [
                  { source: '/admin/:path*', headers: noindex },
                  { source: '/admin', headers: noindex },
                  { source: '/api/:path*', headers: noindex },
                  { source: '/next/:path*', headers: noindex },
                ]),
            {
              source: '/:path*',
              headers: [
                { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
              ],
            },
          ]
        },
      }),
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
