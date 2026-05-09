<template>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <AppRequestModal />

</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'ru',
  },
})

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getAbsoluteUrl('/')}#website`,
    name: siteName,
    description: siteDescription,
    url: getAbsoluteUrl('/'),
    inLanguage: 'ru-RU',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getAbsoluteUrl('/catalog')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${getAbsoluteUrl('/')}#organization`,
    name: siteName,
    url: getAbsoluteUrl('/'),
    logo: getAbsoluteUrl('/favicon.ico'),
    telephone: ['+7 962 835-55-21', '+7 383 255-55-21'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Новосибирск',
      streetAddress: 'Депутатская, 46',
      addressCountry: 'RU',
    },
  },
])
</script>
