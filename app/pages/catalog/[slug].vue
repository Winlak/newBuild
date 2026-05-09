<script setup lang="ts">
import { apartments as fallbackApartments, type Apartment, type ApartmentSearchParam } from '~/data/apartments'

const route = useRoute()
const slug = String(route.params.slug ?? '')
const { data: allApartments } = await useFetch<Apartment[]>('/api/apartments', {
  key: 'public-apartments',
  default: () => fallbackApartments,
})
const apartment = computed(() => (allApartments.value?.length ? allApartments.value : fallbackApartments)
  .find(item => item.slug === slug))

if (!apartment.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'ЖК не найден',
  })
}

const formatPrice = (value: number) => new Intl.NumberFormat('ru-RU').format(value)
const currentApartment = apartment.value!
const getApartmentUnits = (value: Apartment) => value.unitMix?.length
  ? value.unitMix
  : [{
      rooms: value.rooms,
      label: value.rooms === 'Студия' ? 'Студии' : `${value.rooms}-комнатные`,
      areaFrom: value.area,
      areaTo: value.area,
      priceFrom: value.price,
      priceTo: value.price,
      mortgageFrom: value.mortgagePayment,
      count: 1,
      finish: value.finish,
    }]
const complexImages = currentApartment.images?.length
  ? currentApartment.images
  : [currentApartment.image].filter(Boolean)
const units = getApartmentUnits(currentApartment)
const getApartmentMinPrice = (value: Apartment) => Math.min(...getApartmentUnits(value).map(unit => unit.priceFrom || value.price))
const getApartmentMinMortgage = (value: Apartment) => Math.min(...getApartmentUnits(value).map(unit => unit.mortgageFrom || value.mortgagePayment))
const minPrice = getApartmentMinPrice(currentApartment)
const maxPrice = Math.max(...units.map(unit => unit.priceTo || unit.priceFrom || currentApartment.price))
const minMortgage = getApartmentMinMortgage(currentApartment)
const totalUnits = units.reduce((sum, unit) => sum + unit.count, 0)
const minArea = Math.min(...units.flatMap(unit => [unit.areaFrom, unit.areaTo]).filter(Boolean))
const maxArea = Math.max(...units.flatMap(unit => [unit.areaFrom, unit.areaTo]).filter(Boolean))
const apartmentPath = `/catalog/${currentApartment.slug}`
const metroDistanceMeters = currentApartment.metroDistanceMeters || currentApartment.metroWalkMinutes * 80
const apartmentMapPoints = [{
  id: currentApartment.slug,
  title: currentApartment.complex,
  subtitle: currentApartment.address,
  coordinates: currentApartment.coordinates,
  priceLabel: `от ${formatPrice(minPrice)} ₽`,
  balloonHtml: `
    <div class="app-yandex-map-balloon">
      <strong>${currentApartment.complex}</strong>
      <span>${currentApartment.address}</span>
      <span>${currentApartment.metroStation} · ${formatPrice(metroDistanceMeters)} м до метро</span>
      <b>от ${formatPrice(minPrice)} ₽</b>
    </div>
  `,
}]
const searchParamBadgeOptions: Array<{ id: ApartmentSearchParam, label: string }> = [
  { id: 'renovation', label: 'С ремонтом' },
  { id: 'furniture', label: 'С мебелью' },
  { id: 'installment', label: 'С рассрочкой' },
  { id: 'mortgage_no_dp', label: 'Ипотека без ПВ' },
  { id: 'completed', label: 'Дом сдан' },
  { id: 'studio', label: 'Студии' },
]
const searchParamIds = new Set(searchParamBadgeOptions.map(option => option.id))
const defaultVerificationReport = 'Объявление №115 проверено 24.02.2026 10:01'

const formatAreaRange = (from: number, to: number) => from === to
  ? `${String(from).replace('.', ',')} м²`
  : `${String(from).replace('.', ',')}-${String(to).replace('.', ',')} м²`

const apartmentTitle = `${currentApartment.complex}: квартиры в ЖК от ${formatPrice(minPrice)} ₽`
const apartmentDescription = `${currentApartment.complex}, ${currentApartment.district}: ${formatAreaRange(minArea, maxArea)}, ${totalUnits} вариантов квартир, ${currentApartment.metroStation} в ${formatPrice(metroDistanceMeters)} м. Подбор новостройки в Новосибирске.`

const getApartmentSearchText = (value: Apartment) => [
  value.title,
  value.complex,
  value.address,
  value.district,
  value.metroStation,
  value.builder,
  value.completion,
  value.finish,
  value.description,
  ...value.tags,
  ...value.features,
].join(' ').toLowerCase()

const normalizeApartmentSearchParams = (value: unknown): ApartmentSearchParam[] => Array.isArray(value)
  ? [...new Set(value
      .map(String)
      .filter((item): item is ApartmentSearchParam => searchParamIds.has(item as ApartmentSearchParam)))]
  : []

const inferApartmentSearchParams = (value: Apartment): ApartmentSearchParam[] => {
  const searchText = getApartmentSearchText(value)

  return searchParamBadgeOptions
    .filter((option) => {
      if (option.id === 'renovation') {
        return units.some(unit => unit.finish === 'Чистовая') || searchText.includes('ремонт') || searchText.includes('отделк')
      }

      if (option.id === 'furniture') {
        return searchText.includes('мебел') || searchText.includes('меблиров')
      }

      if (option.id === 'installment') {
        return searchText.includes('рассроч')
      }

      if (option.id === 'mortgage_no_dp') {
        return searchText.includes('без пв') || searchText.includes('без первого взнос')
      }

      if (option.id === 'completed') {
        return value.completion === 'Сдан'
      }

      return units.some(unit => unit.rooms === 'Студия')
    })
    .map(option => option.id)
}

const getApartmentSearchParams = (value: Apartment): ApartmentSearchParam[] => Array.isArray(value.searchParams)
  ? normalizeApartmentSearchParams(value.searchParams)
  : inferApartmentSearchParams(value)

const similarApartments = (allApartments.value ?? [])
  .filter(item => item.slug !== currentApartment.slug)
  .sort((first, second) => {
    const getScore = (value: Apartment) =>
      Number(value.district === currentApartment.district) * 3
      + Number(value.metroStation === currentApartment.metroStation) * 2
      - Math.abs(getApartmentMinPrice(value) - minPrice) / 10000000

    return getScore(second) - getScore(first)
  })
  .slice(0, 3)

const apartmentSearchParamBadges = searchParamBadgeOptions.filter(option => new Set(getApartmentSearchParams(currentApartment)).has(option.id))
const verificationReportText = currentApartment.verified
  ? currentApartment.verificationReport?.trim() || defaultVerificationReport
  : ''

usePageSeo({
  title: apartmentTitle,
  description: apartmentDescription,
  path: apartmentPath,
  image: currentApartment.image,
  keywords: [
    `${currentApartment.complex} Новосибирск`,
    `${currentApartment.complex} квартиры`,
    `квартиры в ${currentApartment.district}`,
    `новостройки ${currentApartment.metroStation}`,
  ],
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'Residence',
  '@id': `${getAbsoluteUrl(apartmentPath)}#residence`,
  name: currentApartment.complex,
  description: apartmentDescription,
  image: complexImages.map(image => getAbsoluteUrl(image)),
  url: getAbsoluteUrl(apartmentPath),
  mainEntityOfPage: getAbsoluteUrl(apartmentPath),
  category: 'Жилой комплекс',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Новосибирск',
    streetAddress: currentApartment.address.replace(/^Новосибирск,\s*/i, ''),
    addressCountry: 'RU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: currentApartment.coordinates.lat,
    longitude: currentApartment.coordinates.lng,
  },
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: minPrice,
    highPrice: maxPrice,
    offerCount: totalUnits,
    priceCurrency: 'RUB',
    availability: 'https://schema.org/InStock',
    url: getAbsoluteUrl(apartmentPath),
    seller: {
      '@type': 'RealEstateAgent',
      '@id': `${getAbsoluteUrl('/')}#real-estate-agent`,
      name: siteName,
      telephone: currentApartment.phone,
    },
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'ЖК', value: currentApartment.complex },
    { '@type': 'PropertyValue', name: 'Район', value: currentApartment.district },
    { '@type': 'PropertyValue', name: 'Метро', value: currentApartment.metroStation },
    { '@type': 'PropertyValue', name: 'До метро', value: `${metroDistanceMeters} м` },
    { '@type': 'PropertyValue', name: 'Площадь квартир', value: `${minArea}-${maxArea} м²` },
    { '@type': 'PropertyValue', name: 'Этажность', value: `${currentApartment.totalFloors} этажей` },
    { '@type': 'PropertyValue', name: 'Квартир в подборке', value: String(totalUnits) },
    { '@type': 'PropertyValue', name: 'Срок сдачи', value: currentApartment.completion },
    { '@type': 'PropertyValue', name: 'Проверена', value: currentApartment.verified ? 'Да' : 'На проверке' },
  ],
})

useBreadcrumbJsonLd([
  { name: 'Главная', path: '/' },
  { name: 'Каталог новостроек', path: '/catalog' },
  { name: currentApartment.complex, path: apartmentPath },
])
</script>

<template>
  <section
    v-if="apartment"
    class="apartment-page"
  >
    <div class="container">
      <NuxtLink
        to="/catalog"
        class="apartment-page__back"
      >
        <i class="bi bi-arrow-left" aria-hidden="true"></i>
        <span>Вернуться в каталог</span>
      </NuxtLink>

      <div class="apartment-page__grid">
        <div class="apartment-page__gallery">
          <img
            :src="complexImages[0] || apartment.image"
            :alt="apartment.complex"
            class="apartment-page__gallery-main"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          >

          <div
            v-if="complexImages.length > 1"
            class="apartment-page__gallery-thumbs"
          >
            <img
              v-for="image in complexImages.slice(1, 5)"
              :key="image"
              :src="image"
              :alt="apartment.complex"
              loading="lazy"
              decoding="async"
            >
          </div>
        </div>

        <aside
          class="apartment-page__summary"
          :class="{ 'apartment-page__summary--has-verification-report': verificationReportText }"
        >
          <div
            v-if="apartment.verified || apartmentSearchParamBadges.length"
            class="apartment-page__proof"
          >
            <div
              v-if="apartment.verified || apartmentSearchParamBadges.length"
              class="apartment-page__tags"
            >
              <span
                v-if="apartment.verified"
                class="apartment-page__tag--verified"
              >
                <i class="bi bi-patch-check-fill" aria-hidden="true"></i>
                Проверено
              </span>

              <span
                v-for="param in apartmentSearchParamBadges"
                :key="param.id"
              >
                {{ param.label }}
              </span>
            </div>
          </div>

          <h1>{{ apartment.complex }}</h1>

          <p class="apartment-page__complex">
            {{ totalUnits }} вариантов квартир
          </p>

          <p class="apartment-page__address">
            <i class="bi bi-geo-alt" aria-hidden="true"></i>
            <span>{{ apartment.address }}</span>
          </p>

          <p class="apartment-page__metro">
            <i class="bi bi-train-front" aria-hidden="true"></i>
            <span>{{ apartment.metroStation }} · {{ formatPrice(metroDistanceMeters) }} м до метро</span>
          </p>

          <p
            v-if="verificationReportText"
            class="apartment-page__verification-report apartment-page__verification-report--summary"
          >
            <i class="bi bi-shield-check" aria-hidden="true"></i>
            <span>{{ verificationReportText }}</span>
          </p>

          <div class="apartment-page__price-block">
            <p class="apartment-page__price">
              от {{ formatPrice(minPrice) }} ₽
            </p>
          </div>

          <div class="apartment-page__mortgage">
            <i class="bi bi-bank" aria-hidden="true"></i>
            <span>
              <small>Ипотека от</small>
              <strong>{{ formatPrice(minMortgage) }} ₽/мес.</strong>
            </span>
          </div>

          <a
            :href="apartment.phoneHref"
            class="apartment-page__cta"
          >
            <i class="bi bi-telephone" aria-hidden="true"></i>
            {{ apartment.phone }}
          </a>
        </aside>
      </div>

      <div class="apartment-page__content">
        <section class="apartment-page__details">
          <h2>О комплексе</h2>

          <div
            v-if="apartmentSearchParamBadges.length"
            class="apartment-page__search-params"
          >
            <span
              v-for="param in apartmentSearchParamBadges"
              :key="param.id"
            >
              <i class="bi bi-check2" aria-hidden="true"></i>
              {{ param.label }}
            </span>
          </div>

          <dl>
            <div>
              <dt>Этажность</dt>
              <dd>{{ apartment.totalFloors }} этажей</dd>
            </div>

            <div>
              <dt>Отделка</dt>
              <dd>{{ apartment.finish }}</dd>
            </div>

            <div>
              <dt>Метро</dt>
              <dd>{{ apartment.metroStation }}</dd>
            </div>

            <div>
              <dt>До метро</dt>
              <dd>{{ formatPrice(metroDistanceMeters) }} м</dd>
            </div>

            <div>
              <dt>Район</dt>
              <dd>{{ apartment.district }}</dd>
            </div>
          </dl>
        </section>

        <section class="apartment-page__description">
          <h2>Описание</h2>

          <p>{{ apartment.description }}</p>

          <div class="apartment-page__features">
            <span
              v-for="feature in apartment.features"
              :key="feature"
            >
              <i class="bi bi-check2" aria-hidden="true"></i>
              {{ feature }}
            </span>
          </div>
        </section>
      </div>

      <section class="apartment-page__map-section">
        <div class="apartment-page__section-head">
          <h2>Расположение</h2>
          <p>{{ apartment.address }} · {{ apartment.metroStation }} в {{ formatPrice(metroDistanceMeters) }} м</p>
        </div>

        <div class="apartment-page__map">
          <ClientOnly>
            <LazyYandexMap
              class="apartment-page__map-canvas"
              :points="apartmentMapPoints"
              :center="apartment.coordinates"
              :zoom="16"
              :fit-bounds="false"
            />

            <template #fallback>
              <div class="apartment-page__map-canvas apartment-page__map-placeholder">
                Карта загрузится при открытии страницы
              </div>
            </template>
          </ClientOnly>
        </div>
      </section>

      <section
        v-if="similarApartments.length"
        class="apartment-page__similar"
      >
        <div class="apartment-page__section-head">
          <h2>Похожие ЖК</h2>
          <p>Подборка комплексов рядом по району, локации и бюджету.</p>
        </div>

        <div class="apartment-page__similar-grid">
          <NuxtLink
            v-for="item in similarApartments"
            :key="item.slug"
            :to="`/catalog/${item.slug}`"
            class="apartment-page__similar-card"
          >
            <div class="apartment-page__similar-photo">
              <img
                :src="item.images?.[0] || item.image"
                :alt="item.complex"
                loading="lazy"
              >
            </div>

            <div class="apartment-page__similar-card-body">
              <h3>{{ item.complex }}</h3>

              <dl>
                <div>
                  <dt>Цена от</dt>
                  <dd>{{ formatPrice(getApartmentMinPrice(item)) }} ₽</dd>
                </div>

                <div>
                  <dt>Ипотека от</dt>
                  <dd>{{ formatPrice(getApartmentMinMortgage(item)) }} ₽/мес.</dd>
                </div>
              </dl>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.apartment-page {
  padding: 42px 0 96px;
  background:
    linear-gradient(180deg, #f7faff 0%, #fff 360px),
    #fff;
}

.apartment-page__back {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  color: #526071;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  transition: color 0.2s ease;
}

.apartment-page__back:hover {
  color: #0d6efd;
}

.apartment-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 390px);
  gap: 26px;
  align-items: start;
}

.apartment-page__gallery {
  display: grid;
  gap: 10px;
  min-height: 560px;
}

.apartment-page__gallery-main,
.apartment-page__gallery-thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #eef3f8;
}

.apartment-page__gallery-main {
  min-height: 438px;
  border-radius: 22px;
  box-shadow: 0 20px 58px rgba(14, 30, 62, 0.1);
}

.apartment-page__gallery-thumbs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.apartment-page__gallery-thumbs img {
  min-height: 112px;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(14, 30, 62, 0.08);
}

.apartment-page__summary,
.apartment-page__details,
.apartment-page__description {
  border: 1px solid #e7edf5;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 16px 42px rgba(14, 30, 62, 0.07);
}

.apartment-page__summary {
  position: sticky;
  top: 108px;
  padding: 26px;
}

.apartment-page__proof {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}

.apartment-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
}

.apartment-page__tags span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 11px;
  border-radius: 999px;
  background: #f0f6ff;
  color: #0d5bd7;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
}

.apartment-page__tags .apartment-page__tag--verified {
  background: #eaf8ef;
  color: #1f8a4c;
}

.apartment-page__verification-report {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  color: #42b93f;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.35;
}

.apartment-page__verification-report i {
  flex: 0 0 auto;
  color: #21306b;
  font-size: 15px;
}

.apartment-page__summary h1 {
  margin: 0 0 10px;
  color: #07123d;
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.apartment-page__complex {
  margin: 0 0 10px;
  color: #182033;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
}

.apartment-page__address {
  display: flex;
  gap: 9px;
  margin: 0 0 10px;
  color: #647082;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

.apartment-page__metro {
  display: flex;
  gap: 9px;
  margin: 0 0 24px;
  color: #647082;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

.apartment-page__summary--has-verification-report .apartment-page__metro {
  margin-bottom: 10px;
}

.apartment-page__address i,
.apartment-page__metro i {
  color: #0d6efd;
}

.apartment-page__verification-report--summary {
  margin-bottom: 24px;
}

.apartment-page__price-block {
  padding-top: 24px;
  border-top: 1px solid #edf1f6;
}

.apartment-page__price {
  margin: 0 0 8px;
  color: #07123d;
  font-size: 34px;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.035em;
}

.apartment-page__mortgage {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 22px 0;
  padding: 16px;
  border: 1px solid rgba(13, 110, 253, 0.16);
  border-radius: 14px;
  background: #edf5ff;
  color: #07123d;
  box-shadow: 0 12px 28px rgba(13, 110, 253, 0.09);
}

.apartment-page__mortgage i {
  flex: 0 0 auto;
  margin-top: 3px;
  color: #0d6efd;
  font-size: 18px;
}

.apartment-page__mortgage span {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.apartment-page__mortgage small {
  color: #647082;
  font-size: 13px;
  font-weight: 900;
  line-height: 1;
}

.apartment-page__mortgage strong {
  color: #07123d;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.15;
}

.apartment-page__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 58px;
  border: 1px solid #0d6efd;
  border-radius: 14px;
  background: #0d6efd;
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  line-height: 1;
  text-decoration: none;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.24);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.apartment-page__cta:hover {
  transform: translateY(-2px);
  background: #0b5ed7;
  color: #fff;
  box-shadow: 0 18px 38px rgba(13, 110, 253, 0.32);
}

.apartment-page__content {
  display: grid;
  grid-template-columns: minmax(300px, 420px) minmax(0, 1fr);
  gap: 26px;
  margin-top: 26px;
}

.apartment-page__details,
.apartment-page__description {
  padding: 28px;
}

.apartment-page__details h2,
.apartment-page__description h2 {
  margin: 0 0 22px;
  color: #07123d;
  font-size: 24px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.apartment-page__details dl {
  display: grid;
  gap: 0;
  margin: 0;
}

.apartment-page__search-params {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: -4px 0 16px;
}

.apartment-page__search-params span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 9px 12px;
  border: 1px solid #dbe9ff;
  border-radius: 12px;
  background: #f4f8ff;
  color: #0d5bd7;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.15;
}

.apartment-page__search-params i {
  flex: 0 0 auto;
  color: #1f8a4c;
  font-size: 14px;
}

.apartment-page__details dl div {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 0;
  border-bottom: 1px solid #edf1f6;
}

.apartment-page__details dl div:last-child {
  border-bottom: 0;
}

.apartment-page__details dt {
  color: #7b8492;
  font-size: 14px;
  font-weight: 700;
}

.apartment-page__details dd {
  margin: 0;
  color: #182033;
  font-size: 14px;
  font-weight: 900;
  text-align: right;
}

.apartment-page__description p {
  max-width: 820px;
  margin: 0 0 24px;
  color: #526071;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.65;
}

.apartment-page__features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.apartment-page__features span {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  padding: 11px 12px;
  border: 1px solid #e6edf5;
  border-radius: 12px;
  color: #465364;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.2;
}

.apartment-page__features i {
  color: #0d6efd;
}

.apartment-page__map-section,
.apartment-page__similar {
  margin-top: 26px;
}

.apartment-page__section-head {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: end;
  margin-bottom: 18px;
}

.apartment-page__section-head h2 {
  margin: 0;
  color: #07123d;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.apartment-page__section-head p {
  max-width: 560px;
  margin: 0;
  color: #647082;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;
  text-align: right;
}

.apartment-page__similar-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.apartment-page__similar-card {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0;
  min-height: 100%;
  overflow: hidden;
  padding: 0;
  border: 1px solid #e7edf5;
  border-radius: 18px;
  background:
    linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  color: inherit;
  text-decoration: none;
  box-shadow: 0 14px 34px rgba(14, 30, 62, 0.06);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.apartment-page__similar-card:hover {
  transform: translateY(-3px);
  border-color: rgba(13, 110, 253, 0.34);
  color: inherit;
  box-shadow: 0 18px 42px rgba(14, 30, 62, 0.11);
}

.apartment-page__similar-photo {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: #eef3f8;
}

.apartment-page__similar-photo::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 46%;
  background: linear-gradient(180deg, rgba(7, 18, 61, 0) 0%, rgba(7, 18, 61, 0.28) 100%);
  pointer-events: none;
}

.apartment-page__similar-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.apartment-page__similar-card:hover .apartment-page__similar-photo img {
  transform: scale(1.035);
}

.apartment-page__similar-card-body {
  display: grid;
  gap: 18px;
  padding: 20px;
}

.apartment-page__similar-card h3 {
  margin: 0;
  color: #07123d;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.apartment-page__similar-card dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

.apartment-page__similar-card dl div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 10px;
  border-top: 1px solid #edf1f6;
}

.apartment-page__similar-card dt {
  color: #7b8492;
  font-size: 13px;
  font-weight: 700;
}

.apartment-page__similar-card dd {
  margin: 0;
  color: #182033;
  font-size: 13px;
  font-weight: 900;
  text-align: right;
}

.apartment-page__map {
  position: relative;
  overflow: hidden;
  min-height: 430px;
  border: 1px solid #dfe8f3;
  border-radius: 22px;
  background: #eef3f8;
  box-shadow: 0 18px 48px rgba(14, 30, 62, 0.08);
}

.apartment-page__map-canvas {
  min-height: 430px;
}

.apartment-page__map-placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  background:
    linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(255, 255, 255, 0.78)),
    url('/content/MapIMG.webp') center / cover no-repeat;
  color: #07123d;
  font-size: 16px;
  font-weight: 900;
}

@media (max-width: 991.98px) {
  .apartment-page__grid,
  .apartment-page__content {
    grid-template-columns: 1fr;
  }

  .apartment-page__summary {
    position: static;
  }

  .apartment-page__gallery {
    min-height: 0;
  }

  .apartment-page__gallery-main {
    min-height: 420px;
  }

  .apartment-page__section-head {
    display: grid;
    gap: 8px;
  }

  .apartment-page__section-head p {
    max-width: none;
    text-align: left;
  }

  .apartment-page__similar-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575.98px) {
  .apartment-page {
    padding: 30px 0 70px;
  }

  .apartment-page__gallery-main {
    min-height: 280px;
  }

  .apartment-page__gallery-thumbs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .apartment-page__gallery-thumbs img {
    min-height: 96px;
  }

  .apartment-page__summary,
  .apartment-page__details,
  .apartment-page__description {
    padding: 20px;
    border-radius: 16px;
  }

  .apartment-page__features {
    grid-template-columns: 1fr;
  }

  .apartment-page__section-head h2 {
    font-size: 23px;
  }

  .apartment-page__similar-card {
    border-radius: 16px;
  }

  .apartment-page__similar-card-body {
    padding: 18px;
  }

  .apartment-page__similar-card dl div {
    display: grid;
    gap: 5px;
  }

  .apartment-page__similar-card dd {
    text-align: left;
  }

  .apartment-page__map,
  .apartment-page__map-canvas {
    min-height: 360px;
  }
}
</style>
