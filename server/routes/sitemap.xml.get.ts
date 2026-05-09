import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import { readApartments } from '../utils/adminStore'
import { escapeXml, getServerSiteUrl } from '../utils/seo'

interface SitemapRoute {
  path: string
  changefreq: 'daily' | 'weekly' | 'monthly'
  priority: string
  lastmod: string
}

const getLastmod = async (...paths: string[]) => {
  for (const path of paths) {
    try {
      return (await stat(join(process.cwd(), path))).mtime.toISOString()
    } catch {
      // Try the next source file.
    }
  }

  return new Date().toISOString()
}

export default defineEventHandler(async (event) => {
  const siteUrl = getServerSiteUrl()
  const apartments = await readApartments()
  const [homeLastmod, catalogLastmod, aboutLastmod, contactsLastmod, reviewsLastmod] = await Promise.all([
    getLastmod('app/pages/index.vue'),
    getLastmod('.data/apartments.json', 'app/data/apartments.ts', 'app/pages/catalog/index.vue'),
    getLastmod('app/pages/about/index.vue'),
    getLastmod('app/pages/contacts/index.vue'),
    getLastmod('.data/reviews.json', 'app/pages/reviews/index.vue'),
  ])

  const staticRoutes: SitemapRoute[] = [
    { path: '/', changefreq: 'weekly', priority: '1.0', lastmod: homeLastmod },
    { path: '/catalog', changefreq: 'daily', priority: '0.9', lastmod: catalogLastmod },
    { path: '/about', changefreq: 'monthly', priority: '0.6', lastmod: aboutLastmod },
    { path: '/contacts', changefreq: 'monthly', priority: '0.7', lastmod: contactsLastmod },
    { path: '/reviews', changefreq: 'weekly', priority: '0.7', lastmod: reviewsLastmod },
  ]

  const apartmentRoutes: SitemapRoute[] = apartments.map(apartment => ({
    path: `/catalog/${apartment.slug}`,
    changefreq: 'daily',
    priority: apartment.verified ? '0.8' : '0.7',
    lastmod: catalogLastmod,
  }))

  const urls = [...staticRoutes, ...apartmentRoutes]
    .map(route => [
      '  <url>',
      `    <loc>${escapeXml(`${siteUrl}${route.path}`)}</loc>`,
      `    <lastmod>${route.lastmod}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>',
    ].join('\n'))
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].join('\n')
})
