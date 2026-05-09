<template>
  <ContactHero @open-request="scrollToRequest" />
  <ContactBlock />
  <BenefitsCards />
  <ContactMapBlock />
  <ConsultationBanner @consultation-click="scrollToRequest" />
</template>

<script setup lang="ts">
const scrollToRequest = () => {
  openRequestModal({ source: 'contacts-page' })
}

usePageSeo({
  title: 'Контакты для подбора квартиры',
  description: 'Контакты Новостройки НСК в Новосибирске: телефоны, адрес офиса, карта и форма заявки на подбор квартиры в новостройке.',
  path: '/contacts',
  image: '/content/ContactIMG.webp',
  keywords: [
    'контакты Новостройки НСК',
    'подбор квартиры Новосибирск телефон',
    'заявка на подбор новостройки',
  ],
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Контакты Новостройки НСК',
  description: 'Телефоны, адрес и заявка на подбор квартиры в новостройке Новосибирска.',
  url: getAbsoluteUrl('/contacts'),
  mainEntity: {
    '@type': 'RealEstateAgent',
    '@id': `${getAbsoluteUrl('/')}#real-estate-agent`,
    name: siteName,
    telephone: ['+7 962 835-55-21', '+7 383 255-55-21'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Новосибирск',
      streetAddress: 'Депутатская, 46',
      addressCountry: 'RU',
    },
  },
})

useBreadcrumbJsonLd([
  { name: 'Главная', path: '/' },
  { name: 'Контакты', path: '/contacts' },
])
</script>
