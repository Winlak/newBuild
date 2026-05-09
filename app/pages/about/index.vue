<script setup lang="ts">
usePageSeo({
  title: 'О компании и подборе новостроек',
  description: 'Новостройки НСК помогает выбрать квартиру в новостройке в Новосибирске без комиссии: проверяем ЖК, документы, застройщиков и сопровождаем сделку.',
  path: '/about',
  image: '/content/AboutBG.webp',
  keywords: [
    'подбор новостроек Новосибирск',
    'проверка ЖК Новосибирск',
    'сопровождение покупки квартиры',
  ],
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'О компании Новостройки НСК',
  description: 'Команда по подбору квартир в новостройках Новосибирска без комиссии для покупателя.',
  url: getAbsoluteUrl('/about'),
  isPartOf: {
    '@type': 'WebSite',
    '@id': `${getAbsoluteUrl('/')}#website`,
  },
})

useBreadcrumbJsonLd([
  { name: 'Главная', path: '/' },
  { name: 'О компании', path: '/about' },
])
</script>

<template>
  <AboutHero />
  <AboutIntroStats />
  <BenefitsGrid />
  <WorkSteps />
  <ReviewsCtaSection />
</template>
