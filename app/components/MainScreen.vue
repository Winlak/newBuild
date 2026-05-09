<template>
  <section class="hero-section d-flex align-items-center justify-content-center py-5">
    <div class="container">
      <div class="hero-card text-center mx-auto">
        <h1 class="hero-title fw-bold mb-3">
          Бесплатный сервис по подбору новостроек в Новосибирске
        </h1>

        <p class="lead mb-4 mx-auto hero-subtitle">
          Гарантия чистоты сделки и защиты ваших интересов! Найдем идеальную квартиру по вашим критериям.
        </p>

        <div class="hero-search-wrap mx-auto mb-3">
          <form
            ref="heroSearch"
            class="hero-search"
            role="search"
            @submit.prevent="handleSearch"
            @keydown.esc="closeSuggestions"
          >
            <div class="hero-search__input">
              <i class="bi bi-search" aria-hidden="true"></i>

              <input
                v-model="searchQuery"
                type="text"
                placeholder="Район, метро или название ЖК"
                aria-label="Поиск по району, метро или жилому комплексу"
                autocomplete="off"
                @focus="openSuggestions"
                @input="handleSearchInput"
                @keydown.down.prevent="highlightNextSuggestion"
                @keydown.up.prevent="highlightPreviousSuggestion"
                @keydown.enter="handleSearchKeydown"
              />

              <button
                v-if="searchQuery"
                type="button"
                class="hero-search__clear"
                aria-label="Очистить поиск"
                @click="clearSearch"
              >
                <i class="bi bi-x-lg" aria-hidden="true"></i>
              </button>
            </div>

            <button class="hero-search__submit" type="submit">
              <i class="bi bi-arrow-right-short" aria-hidden="true"></i>
              <span>Найти</span>
            </button>

            <div
              v-if="isSuggestionsOpen"
              class="hero-search__dropdown"
            >
              <button
                v-for="(suggestion, index) in filteredSuggestions"
                :key="`${suggestion.type}-${suggestion.value}`"
                type="button"
                :class="{ 'hero-search__suggestion--active': highlightedSuggestionIndex === index }"
                @pointerdown.prevent="selectSuggestion(suggestion)"
                @mouseenter="highlightedSuggestionIndex = index"
              >
                <span>{{ suggestion.typeLabel }}</span>
                <strong>{{ suggestion.label }}</strong>
                <small>{{ suggestion.meta }}</small>
              </button>

              <p v-if="filteredSuggestions.length === 0">
                Ничего не найдено
              </p>
            </div>
          </form>

          <div class="hero-search__summary">
            <span>{{ searchResultText }}</span>

            <button
              v-if="hasActiveSearch"
              type="button"
              @click="resetHeroSearch"
            >
              Сбросить
            </button>
          </div>
        </div>

        <div class="hero-filters mb-4" aria-label="Быстрые параметры подбора">
          <button
            v-for="filter in quickFilters"
            :key="filter.id"
            type="button"
            @click="toggleFilter(filter.id)"
            :class="{ 'hero-filters__item--active': selectedFilters.includes(filter.id) }"
          >
            <i
              :class="selectedFilters.includes(filter.id) ? 'bi bi-check2' : 'bi bi-plus'"
              aria-hidden="true"
            ></i>
            {{ filter.label }}
          </button>
        </div>

        <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 hero-contacts">
          <button
            type="button"
            class="btn btn-link text-decoration-none p-0 fw-semibold d-flex align-items-center gap-1"
            @click="goToMap"
          >
            <i class="bi bi-map"></i>
            Посмотреть на карте
          </button>

          <span class="d-none d-sm-block hero-divider">|</span>

          <a href="tel:89628355521" class="text-decoration-none fw-semibold hero-phone">
            📞 8 962 835-55-21
          </a>

          <span class="d-none d-sm-block hero-divider">|</span>

          <a href="tel:83832555521" class="text-decoration-none fw-semibold hero-phone">
            📞 8 383 255-55-21
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { apartments as fallbackApartments, type Apartment, type ApartmentSearchParam } from '~/data/apartments'

const { data: apartmentsData } = await useFetch<Apartment[]>('/api/apartments', {
  key: 'public-apartments',
  default: () => fallbackApartments,
})
const apartments = computed(() => apartmentsData.value?.length ? apartmentsData.value : fallbackApartments)

const searchQuery = ref('')
const selectedFilters = ref<ApartmentSearchParam[]>([])
const isSuggestionsOpen = ref(false)
const highlightedSuggestionIndex = ref(0)
const selectedSuggestionType = ref<SearchSuggestionType | null>(null)
const heroSearch = ref<HTMLElement | null>(null)

type SearchSuggestionType = 'district' | 'metro' | 'complex'

interface SearchSuggestion {
  type: SearchSuggestionType
  typeLabel: string
  value: string
  label: string
  meta: string
}

const quickFilters: Array<{ id: ApartmentSearchParam, label: string }> = [
  { id: 'renovation', label: 'С ремонтом' },
  { id: 'furniture', label: 'С мебелью' },
  { id: 'installment', label: 'С рассрочкой' },
  { id: 'mortgage_no_dp', label: 'Ипотека Без ПВ' },
  { id: 'completed', label: 'Дом сдан' },
  { id: 'studio', label: 'Студии' }
]

const searchParamIds = new Set(quickFilters.map(option => option.id))

const normalizeSearchText = (value: string) => value.trim().toLocaleLowerCase('ru-RU').replaceAll('ё', 'е')

const formatPrice = (value: number) => new Intl.NumberFormat('ru-RU').format(value)

const formatCount = (count: number) => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} ЖК`
  }

  return `${count} ЖК`
}

const getUnits = (apartment: Apartment) => apartment.unitMix?.length
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

const getComplexMinPrice = (apartment: Apartment) => Math.min(...getUnits(apartment).map(unit => unit.priceFrom || apartment.price))

const getApartmentSearchText = (apartment: Apartment) => [
  apartment.title,
  apartment.complex,
  apartment.address,
  apartment.district,
  apartment.metroStation,
  apartment.builder,
  apartment.completion,
  apartment.finish,
  apartment.description,
  ...apartment.tags,
  ...apartment.features,
].join(' ').toLocaleLowerCase('ru-RU')

const normalizeApartmentSearchParams = (value: unknown): ApartmentSearchParam[] => Array.isArray(value)
  ? [...new Set(value
      .map(String)
      .filter((item): item is ApartmentSearchParam => searchParamIds.has(item as ApartmentSearchParam)))]
  : []

const inferApartmentSearchParams = (apartment: Apartment): ApartmentSearchParam[] => {
  const searchText = getApartmentSearchText(apartment)
  const units = getUnits(apartment)

  return quickFilters
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
        return apartment.completion === 'Сдан'
      }

      return units.some(unit => unit.rooms === 'Студия')
    })
    .map(option => option.id)
}

const getApartmentSearchParams = (apartment: Apartment): ApartmentSearchParam[] => Array.isArray(apartment.searchParams)
  ? normalizeApartmentSearchParams(apartment.searchParams)
  : inferApartmentSearchParams(apartment)

const knownMetroStations = computed(() => new Set(apartments.value.map(apartment => normalizeSearchText(apartment.metroStation))))

const getSearchScope = (query: string) => {
  const normalizedQuery = normalizeSearchText(query)

  if (!normalizedQuery) {
    return undefined
  }

  if (selectedSuggestionType.value === 'metro') {
    return 'metro'
  }

  if (selectedSuggestionType.value === 'district' || selectedSuggestionType.value === 'complex') {
    return 'district'
  }

  return [...knownMetroStations.value].some(station => station.includes(normalizedQuery) || normalizedQuery.includes(station))
    ? 'metro'
    : 'district'
}

const districtSuggestions = computed<SearchSuggestion[]>(() => [...new Set(apartments.value.map(apartment => apartment.district))]
  .map(district => ({
    type: 'district',
    typeLabel: 'Район',
    value: district,
    label: district,
    meta: formatCount(apartments.value.filter(apartment => apartment.district === district).length),
  })))

const metroSuggestions = computed<SearchSuggestion[]>(() => [...new Set(apartments.value.map(apartment => apartment.metroStation))]
  .map(metro => ({
    type: 'metro',
    typeLabel: 'Метро',
    value: metro,
    label: metro,
    meta: formatCount(apartments.value.filter(apartment => apartment.metroStation === metro).length),
  })))

const complexSuggestions = computed<SearchSuggestion[]>(() => apartments.value.map(apartment => ({
  type: 'complex',
  typeLabel: 'ЖК',
  value: apartment.complex,
  label: apartment.complex,
  meta: `${apartment.district} · от ${formatPrice(getComplexMinPrice(apartment))} ₽`,
})))

const allSuggestions = computed<SearchSuggestion[]>(() => [
  ...districtSuggestions.value,
  ...metroSuggestions.value,
  ...complexSuggestions.value,
])

const filteredSuggestions = computed(() => {
  const query = normalizeSearchText(searchQuery.value)
  const suggestions = query
    ? allSuggestions.value.filter(suggestion => normalizeSearchText(`${suggestion.label} ${suggestion.meta}`).includes(query))
    : [
        ...districtSuggestions.value.slice(0, 4),
        ...metroSuggestions.value.slice(0, 2),
        ...complexSuggestions.value.slice(0, 2),
      ]

  return suggestions.slice(0, 8)
})

const matchesQuickFilter = (apartment: Apartment, filter: ApartmentSearchParam) => {
  const units = getUnits(apartment)

  if (filter === 'renovation') {
    return units.some(unit => unit.finish === 'Чистовая')
  }

  if (filter === 'completed') {
    return apartment.completion === 'Сдан'
  }

  if (filter === 'studio') {
    return units.some(unit => unit.rooms === 'Студия')
  }

  return getApartmentSearchParams(apartment).includes(filter)
}

const filteredApartmentCount = computed(() => {
  const query = normalizeSearchText(searchQuery.value)
  const searchScope = getSearchScope(searchQuery.value)

  return apartments.value.filter((apartment) => {
    const searchableValues = searchScope === 'metro'
      ? [apartment.metroStation]
      : [apartment.title, apartment.complex, apartment.district, apartment.address]

    const matchesQuery = !query || searchableValues.some(value => normalizeSearchText(value).includes(query))
    const matchesFilters = selectedFilters.value.every(filter => matchesQuickFilter(apartment, filter))

    return matchesQuery && matchesFilters
  }).length
})

const hasActiveSearch = computed(() => Boolean(searchQuery.value.trim() || selectedFilters.value.length))

const searchResultText = computed(() => hasActiveSearch.value
  ? `Подходит ${formatCount(filteredApartmentCount.value)}`
  : `Доступно ${formatCount(apartments.value.length)}`
)

watch(filteredSuggestions, (suggestions) => {
  if (highlightedSuggestionIndex.value >= suggestions.length) {
    highlightedSuggestionIndex.value = Math.max(0, suggestions.length - 1)
  }
})

const toggleFilter = (id: ApartmentSearchParam) => {
  if (selectedFilters.value.includes(id)) {
    selectedFilters.value = selectedFilters.value.filter(filterId => filterId !== id)
    return
  }

  selectedFilters.value.push(id)
}

const openSuggestions = () => {
  isSuggestionsOpen.value = true
  highlightedSuggestionIndex.value = 0
}

const closeSuggestions = () => {
  isSuggestionsOpen.value = false
}

const handleSearchInput = () => {
  selectedSuggestionType.value = null
  openSuggestions()
}

const selectSuggestion = (suggestion: SearchSuggestion) => {
  searchQuery.value = suggestion.value
  selectedSuggestionType.value = suggestion.type
  closeSuggestions()
}

const highlightNextSuggestion = () => {
  if (!isSuggestionsOpen.value) {
    openSuggestions()
    return
  }

  if (!filteredSuggestions.value.length) {
    return
  }

  highlightedSuggestionIndex.value = (highlightedSuggestionIndex.value + 1) % filteredSuggestions.value.length
}

const highlightPreviousSuggestion = () => {
  if (!isSuggestionsOpen.value) {
    openSuggestions()
    return
  }

  if (!filteredSuggestions.value.length) {
    return
  }

  highlightedSuggestionIndex.value = highlightedSuggestionIndex.value === 0
    ? filteredSuggestions.value.length - 1
    : highlightedSuggestionIndex.value - 1
}

const handleSearchKeydown = (event: KeyboardEvent) => {
  if (!isSuggestionsOpen.value || !filteredSuggestions.value.length) {
    return
  }

  const suggestion = filteredSuggestions.value[highlightedSuggestionIndex.value]

  if (!suggestion) {
    return
  }

  event.preventDefault()
  selectSuggestion(suggestion)
}

const clearSearch = () => {
  searchQuery.value = ''
  selectedSuggestionType.value = null
  openSuggestions()
}

const resetHeroSearch = () => {
  searchQuery.value = ''
  selectedFilters.value = []
  selectedSuggestionType.value = null
  closeSuggestions()
}

const getCatalogQuery = (extra: Record<string, string> = {}) => {
  const trimmedSearchQuery = searchQuery.value.trim()
  const searchScope = getSearchScope(trimmedSearchQuery)

  return {
    ...(trimmedSearchQuery && { q: trimmedSearchQuery }),
    ...(trimmedSearchQuery && searchScope && { scope: searchScope }),
    ...(selectedFilters.value.length && { filters: selectedFilters.value.join(',') }),
    ...extra,
  }
}

const handleSearch = () => {
  closeSuggestions()
  navigateTo({ path: '/catalog', query: getCatalogQuery() })
}

const goToMap = () => {
  navigateTo({ path: '/catalog', query: getCatalogQuery({ map: 'true' }) })
}

const closeSuggestionsOnOutsideClick = (event: PointerEvent) => {
  if (!heroSearch.value?.contains(event.target as Node)) {
    closeSuggestions()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', closeSuggestionsOnOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeSuggestionsOnOutsideClick)
})
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 640px;
  background-image: url('/content/MainIMG.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.22);
}

.hero-section > .container {
  position: relative;
  z-index: 1;
}

.hero-card {
  max-width: 1080px;
  padding: 48px 72px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.hero-title {
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
  color: #182033;
  font-size: clamp(38px, 4vw, 56px);
  line-height: 1.12;
  letter-spacing: 0;
  text-wrap: balance;
}

.hero-subtitle {
  max-width: 720px;
  color: #526071;
}

.hero-contacts {
  color: #526071;
}

.hero-phone {
  color: #526071;
  transition: color 0.2s ease-in-out;
}

.hero-phone:hover {
  color: #0d6efd;
}

.hero-divider {
  color: #9aa4b2;
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

.hero-search-wrap {
  max-width: 760px;
}

.hero-search {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: stretch;
  padding: 8px;
  border: 1px solid #d5e1f1;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 44px rgba(14, 30, 62, 0.12);
}

.hero-search__input {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  min-height: 52px;
  padding: 0 12px;
  border: 1px solid #e4ebf5;
  border-radius: 12px;
  background: #f8fbff;
}

.hero-search__input > i {
  color: #0d6efd;
  font-size: 18px;
}

.hero-search__input input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #182033;
  font-size: 16px;
  font-weight: 800;
}

.hero-search__input input::placeholder {
  color: #7a8798;
  font-weight: 700;
}

.hero-search__clear,
.hero-search__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.hero-search__clear {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #edf4ff;
  color: #65758b;
}

.hero-search__clear:hover {
  background: #dfeeff;
  color: #0d6efd;
}

.hero-search__submit {
  gap: 4px;
  min-width: 118px;
  padding: 0 18px;
  border-radius: 12px;
  background: #0d6efd;
  color: #fff;
  font-size: 15px;
  font-weight: 900;
}

.hero-search__submit i {
  font-size: 23px;
  line-height: 1;
}

.hero-search__submit:hover {
  background: #0b5ed7;
  transform: translateY(-1px);
}

.hero-search__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 8px;
  left: 8px;
  z-index: 20;
  display: grid;
  gap: 5px;
  max-height: 328px;
  overflow: auto;
  padding: 8px;
  border: 1px solid #dce7f5;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 24px 56px rgba(14, 30, 62, 0.18);
  text-align: left;
}

.hero-search__dropdown button {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 11px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #182033;
  text-align: left;
}

.hero-search__dropdown button:hover,
.hero-search__suggestion--active {
  background: #edf4ff;
}

.hero-search__dropdown span {
  display: inline-flex;
  justify-content: center;
  padding: 5px 8px;
  border-radius: 999px;
  background: #eef5ff;
  color: #0d5bd7;
  font-size: 12px;
  font-weight: 900;
}

.hero-search__dropdown strong {
  min-width: 0;
  overflow: hidden;
  color: #182033;
  font-size: 14px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hero-search__dropdown small {
  color: #66758a;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.hero-search__dropdown p {
  margin: 0;
  padding: 12px;
  color: #66758a;
  font-size: 14px;
  font-weight: 800;
  text-align: center;
}

.hero-search__summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 30px;
  margin-top: 10px;
  color: #526071;
  font-size: 14px;
  font-weight: 800;
}

.hero-search__summary button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #0d6efd;
  font: inherit;
}

.hero-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.hero-filters button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 8px 14px;
  border: 1px solid #d8e3f1;
  border-radius: 999px;
  background: #fff;
  color: #25324a;
  font-size: 14px;
  font-weight: 800;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.hero-filters button:hover {
  border-color: #b9d5ff;
  color: #0d5bd7;
  transform: translateY(-1px);
}

.hero-filters i {
  color: #0d6efd;
  font-size: 14px;
}

.hero-filters__item--active {
  border-color: #0d6efd !important;
  background: #0d6efd !important;
  color: #fff !important;
  box-shadow: 0 10px 24px rgba(13, 110, 253, 0.22);
}

.hero-filters__item--active i {
  color: #fff;
}

@media (max-width: 767.98px) {
  .hero-section {
    min-height: 620px;
    padding-top: 32px;
    padding-bottom: 32px;
  }

  .hero-card {
    padding: 30px 22px;
    border-radius: 24px;
  }

  .hero-title {
    font-size: 26px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .hero-search {
    grid-template-columns: 1fr;
  }

  .hero-search__submit {
    min-height: 48px;
  }

  .hero-search__dropdown button {
    grid-template-columns: 64px minmax(0, 1fr);
  }

  .hero-search__dropdown small {
    grid-column: 2;
    white-space: normal;
  }

  .hero-search__summary {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
    text-align: left;
  }
}

@media (max-width: 575.98px) {
  .hero-title {
    font-size: 26px;
  }

  .hero-card {
    padding: 26px 14px;
  }

  .hero-search__input input {
    font-size: 14px;
  }

  .hero-filters {
    justify-content: flex-start;
  }

  .hero-filters button {
    min-height: 36px;
    padding: 7px 11px;
    font-size: 13px;
  }
}
</style>
