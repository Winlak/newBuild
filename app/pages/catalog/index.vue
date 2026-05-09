<template>

  <ApartmentCards :apartments="apartments" />
</template>

<script setup lang="ts">
import { apartments as fallbackApartments, type Apartment } from '~/data/apartments'

const { data: apartmentsData } = await useFetch<Apartment[]>('/api/apartments', {
  key: 'public-apartments',
  default: () => fallbackApartments,
})

const formatPrice = (value: number) => new Intl.NumberFormat('ru-RU').format(value)
const getApartmentUnits = (apartment: Apartment) => apartment.unitMix?.length
  ? apartment.unitMix
  : [{ priceFrom: apartment.price, mortgageFrom: apartment.mortgagePayment, count: 1 }]
const getApartmentMinPrice = (apartment: Apartment) => Math.min(...getApartmentUnits(apartment).map(unit => unit.priceFrom || apartment.price))
const apartments = computed(() => apartmentsData.value?.length ? apartmentsData.value : fallbackApartments)
const minCatalogPrice = computed(() => {
  const prices = apartments.value.map(getApartmentMinPrice).filter(Boolean)

  return prices.length ? Math.min(...prices) : 0
})

usePageSeo({
  title: 'Новостройки Новосибирска с ценами',
  description: `Новостройки в Новосибирске от застройщика с ценами: ${apartments.value.length} ЖК, квартиры${minCatalogPrice.value ? ` от ${formatPrice(minCatalogPrice.value)} ₽` : ''}, районы, ипотека, ремонт, метро и проверенные объекты.`,
  path: '/catalog',
  keywords: [
    'каталог новостроек Новосибирск',
    'ЖК Новосибирск',
    'квартиры от застройщика Новосибирск',
    'новостройки с ипотекой Новосибирск',
    'новостройки в Новосибирске от застройщика с ценами',
    'районы новостроек Новосибирск',
    'недорогие квартиры новостройках Новосибирска',
  ],
})

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Новостройки Новосибирска с ценами',
    description: 'Подборка жилых комплексов Новосибирска от застройщика с фильтрами по цене квартир, району, метро, отделке, ипотеке и сроку сдачи.',
    url: getAbsoluteUrl('/catalog'),
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${getAbsoluteUrl('/')}#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: apartments.value.length,
      itemListElement: apartments.value.map((apartment, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: getAbsoluteUrl(`/catalog/${apartment.slug}`),
        name: apartment.complex,
      })),
    },
  },
])

useBreadcrumbJsonLd([
  { name: 'Главная', path: '/' },
  { name: 'Каталог новостроек', path: '/catalog' },
])
</script>
