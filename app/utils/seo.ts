interface PageSeoOptions {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  keywords?: string[]
  noindex?: boolean
}

export const siteName = 'Новостройки НСК'
export const siteDescription = 'Бесплатный подбор квартир в новостройках Новосибирска с проверкой ЖК, ипотекой и сопровождением сделки.'
export const defaultSeoImage = '/content/MainIMG.webp'
export const defaultSeoKeywords = [
  'новостройки новосибирск',
  'квартиры в новостройке новосибирск',
  'купить новостройку в новосибирске',
  'новостройки новосибирска от застройщика',
  'купить квартиру в новосибирске в новостройке',
  'новосибирск новостройка цена',
  'новосибирск квартиры новостройках застройщика',
  'купить новостройку в новосибирске от застройщика',
  'новосибирск купить квартиру в новостройке от застройщика',
  'районы новостроек новосибирск',
  'новостройки под новосибирском',
  'новостройки новосибирска под ключ',
  'новостройки в новосибирском районе',
  'новостройки в новосибирске от застройщика с ценами',
  'новостройка берег новосибирск',
  'ипотека в новосибирске новостройки',
  'недорогие новостройки новосибирск',
  'квартиры в новосибирске новостройки под',
  'новостройки с ремонтом новосибирск',
  'квартиры новостройках новосибирска под ключ',
  'недорогие квартиры новостройках новосибирска',
  'новостройки новосибирска под ключ застройщика',
  'купить новостройку в новосибирске недорого',
]

const runWithNuxtContext = <T>(callback: () => T) => {
  const nuxtApp = tryUseNuxtApp()

  return nuxtApp ? nuxtApp.runWithContext(callback) : callback()
}

export const getSiteUrl = () => {
  const config = runWithNuxtContext(() => useRuntimeConfig())
  const siteUrl = String(config.public?.siteUrl || 'https://novostroyki-nsk.ru')

  return siteUrl.replace(/\/$/, '')
}

export const getAbsoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${getSiteUrl()}${normalizedPath}`
}

export const getCanonicalPath = (path = '/') => {
  const [withoutHash] = path.split('#')
  const [withoutQuery] = withoutHash.split('?')

  return withoutQuery || '/'
}

export const getSeoTitle = (title: string) => {
  if (title.includes(siteName)) {
    return title
  }

  return `${title} | ${siteName}`
}

export const usePageSeo = (options: PageSeoOptions) => {
  runWithNuxtContext(() => {
    const route = useRoute()
    const canonicalPath = getCanonicalPath(options.path ?? route.path)
    const title = getSeoTitle(options.title)
    const image = getAbsoluteUrl(options.image ?? defaultSeoImage)
    const canonical = getAbsoluteUrl(canonicalPath)
    const robots = options.noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    const keywords = [...new Set([
      ...(options.keywords ?? []),
      ...(!options.noindex ? defaultSeoKeywords : []),
    ])]

    useSeoMeta({
      title,
      description: options.description,
      keywords: keywords.length ? keywords.join(', ') : undefined,
      ogTitle: title,
      ogDescription: options.description,
      ogSiteName: siteName,
      ogType: options.type ?? 'website',
      ogUrl: canonical,
      ogImage: image,
      ogLocale: 'ru_RU',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: options.description,
      twitterImage: image,
      robots,
    })

    useHead({
      link: [
        {
          rel: 'canonical',
          href: canonical,
        },
      ],
    })
  })
}

export const useJsonLd = (schema: Record<string, unknown> | Record<string, unknown>[]) => {
  runWithNuxtContext(() => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema),
        },
      ],
    })
  })
}

export const useBreadcrumbJsonLd = (items: Array<{ name: string, path: string }>) => {
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  })
}
