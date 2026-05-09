<script setup lang="ts">
import type { Apartment, ApartmentUnit } from '~/data/apartments'

const props = defineProps<{
  apartments: Apartment[]
}>()

const formatPrice = (value: number) => new Intl.NumberFormat('ru-RU').format(value)

const getUnits = (apartment: Apartment): ApartmentUnit[] => apartment.unitMix?.length
  ? apartment.unitMix
  : [{
      rooms: apartment.rooms,
      label: apartment.rooms === 'Студия' ? 'Студии' : `${apartment.rooms}-комнатные`,
      areaFrom: apartment.area,
      areaTo: apartment.area,
      priceFrom: apartment.price,
      priceTo: apartment.price,
      mortgageFrom: apartment.mortgagePayment,
      count: 1,
      finish: apartment.finish,
    }]

const getMinPrice = (apartment: Apartment) => Math.min(...getUnits(apartment).map(unit => unit.priceFrom || apartment.price))

const getMetroDistance = (apartment: Apartment) => apartment.metroDistanceMeters || apartment.metroWalkMinutes * 80

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const mapPoints = computed(() => props.apartments.map(apartment => ({
  id: apartment.slug,
  title: apartment.complex,
  subtitle: `${apartment.metroStation} · ${formatPrice(getMetroDistance(apartment))} м до метро`,
  coordinates: apartment.coordinates,
  priceLabel: `от ${formatPrice(Math.round(getMinPrice(apartment) / 100000) / 10)} млн`,
  balloonHtml: `
  <div class="app-yandex-map-balloon">
    <strong>${escapeHtml(apartment.complex)}</strong>
    <span>${escapeHtml(apartment.address)}</span>
    <span>${escapeHtml(apartment.metroStation)} · ${formatPrice(getMetroDistance(apartment))} м до метро</span>
    <b>от ${formatPrice(getMinPrice(apartment))} ₽</b>
    <a href="/catalog/${escapeHtml(apartment.slug)}">Открыть ЖК</a>
  </div>
`,
})))
</script>

<template>
  <section class="catalog-real-map">
    <div class="catalog-real-map__head">
      <div>
        <span>Карта ЖК</span>
        <h2>Все комплексы на карте</h2>
      </div>

      <p>{{ props.apartments.length }} ЖК в текущей выдаче</p>
    </div>

    <YandexMap
      class="catalog-real-map__canvas"
      :points="mapPoints"
      :zoom="12"
    />
  </section>
</template>

<style scoped>
.catalog-real-map {
  overflow: hidden;
  margin: 0 0 34px;
  border: 1px solid #dfe8f4;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 20px 56px rgba(14, 30, 62, 0.1);
}

.catalog-real-map__head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: end;
  padding: 22px 24px;
  border-bottom: 1px solid #edf1f6;
}

.catalog-real-map__head span {
  display: inline-flex;
  margin-bottom: 8px;
  color: #0d6efd;
  font-size: 13px;
  font-weight: 900;
  line-height: 1;
}

.catalog-real-map__head h2 {
  margin: 0;
  color: #07123d;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.catalog-real-map__head p {
  margin: 0;
  color: #647082;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.35;
  text-align: right;
}

.catalog-real-map :deep(.catalog-real-map__canvas) {
  min-height: 620px;
  background: #eef3f8;
}

@media (max-width: 767.98px) {
  .catalog-real-map__head {
    display: grid;
    gap: 10px;
    padding: 18px;
  }

  .catalog-real-map__head h2 {
    font-size: 23px;
  }

  .catalog-real-map__head p {
    text-align: left;
  }

  .catalog-real-map :deep(.catalog-real-map__canvas) {
    min-height: 500px;
  }
}
</style>
