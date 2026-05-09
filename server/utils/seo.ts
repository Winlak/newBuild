export const getServerSiteUrl = () => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://novostroyki-nsk.ru')

  return siteUrl.replace(/\/$/, '')
}

export const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')
