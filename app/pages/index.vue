<template>
    <MainScreen />
    <MapSpotlight
      title="Посмотреть новостройки на карте"
      description="Карта помогает быстро понять, какие ЖК ближе к метро, центру, набережной и нужному району."
      primary-label="Открыть карту ЖК"
      @open-map="goToCatalogMap"
    />
    <WhyChooseUs />

    <AppFooter />
</template>

<script setup lang="ts">
const goToCatalogMap = () => {
  navigateTo({ path: '/catalog', query: { map: 'true' } })
}

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/content/MainIMG.webp',
      fetchpriority: 'high',
    },
  ],
})

usePageSeo({
  title: 'Новостройки Новосибирска от застройщика',
  description: 'Новостройки Новосибирска от застройщика с ценами: помогаем купить квартиру в новостройке, подобрать район, ипотеку, ремонт и ЖК под ключ без комиссии.',
  path: '/',
  keywords: [
    'новостройки Новосибирска',
    'купить квартиру в новостройке Новосибирск',
    'подбор квартиры Новосибирск',
    'жилые комплексы Новосибирска',
    'квартиры в новостройке Новосибирск от застройщика',
    'купить новостройку в Новосибирске недорого',
  ],
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': `${getAbsoluteUrl('/')}#real-estate-agent`,
  name: siteName,
  url: getAbsoluteUrl('/'),
  image: getAbsoluteUrl('/content/MainIMG.webp'),
  description: 'Новостройки Новосибирска от застройщика с ценами, подбор квартир, ипотека, районы, ремонт и сопровождение покупки под ключ.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Новосибирск',
    streetAddress: 'Депутатская, 46',
    addressCountry: 'RU',
  },
  telephone: ['+7 962 835-55-21', '+7 383 255-55-21'],
  areaServed: 'Новосибирск',
  priceRange: '0 ₽ для покупателя',
})
</script>
