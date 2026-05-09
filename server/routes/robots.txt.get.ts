import { getServerSiteUrl } from '../utils/seo'

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Disallow: /admin',
    'Disallow: /api/',
    'Allow: /',
    '',
    `Sitemap: ${getServerSiteUrl()}/sitemap.xml`,
    '',
  ].join('\n')
})
