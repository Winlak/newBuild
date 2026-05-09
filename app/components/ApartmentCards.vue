<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { apartments as fallbackApartments, type Apartment, type ApartmentSearchParam } from '~/data/apartments'

interface Props {
  apartments?: Apartment[]
  initialLimit?: number
  loadStep?: number
}

type QuickFilterId = ApartmentSearchParam
type SortMode = 'priceAsc' | 'priceDesc' | 'dateDesc' | 'dateAsc'

interface SearchFiltersState {
  searchQuery: string
  selectedRooms: string[]
  selectedPrice: string
  verifiedOnly: boolean
  closeMetroOnly: boolean
  selectedFinish: string
  selectedCompletion: string
  selectedQuickFilters: QuickFilterId[]
  searchScope: 'district' | 'metro'
  sortMode: SortMode
}

const props = withDefaults(defineProps<Props>(), {
  apartments: undefined,
  initialLimit: 4,
  loadStep: 2,
})

const route = useRoute()

const quickFilterIds: QuickFilterId[] = ['renovation', 'furniture', 'installment', 'mortgage_no_dp', 'completed', 'studio']

const getRouteQueryText = (value: unknown) => Array.isArray(value)
  ? String(value[0] ?? '').trim()
  : String(value ?? '').trim()

const parseQuickFilters = (value: unknown): QuickFilterId[] => {
  const rawValue = getRouteQueryText(value)

  if (!rawValue) {
    return []
  }

  const allowedFilters = new Set(quickFilterIds)

  return rawValue
    .split(',')
    .map(item => item.trim())
    .filter((item): item is QuickFilterId => allowedFilters.has(item as QuickFilterId))
}

const initialQuickFilters = parseQuickFilters(route.query.filters)
const initialSearchQuery = getRouteQueryText(route.query.q || route.query.district)
const initialSearchScope = route.query.scope === 'metro' ? 'metro' : 'district'
const hasInitialRouteFilters = Boolean(initialSearchQuery || initialQuickFilters.length || route.query.scope)

const apartmentsData = ref<Apartment[] | null>(null)

if (!props.apartments?.length) {
  const { data } = await useFetch<Apartment[]>('/api/apartments', {
    key: 'public-apartments',
    default: () => fallbackApartments,
  })

  apartmentsData.value = data.value
  watch(data, value => {
    apartmentsData.value = value
  })
}

const apartments = computed(() => props.apartments?.length
  ? props.apartments
  : apartmentsData.value?.length
    ? apartmentsData.value
    : fallbackApartments)

const visibleCount = ref(props.initialLimit)
const searchQuery = ref(initialSearchQuery)
const selectedRooms = ref<string[]>(initialQuickFilters.includes('studio') ? ['Студия'] : [])
const selectedPrice = ref('all')
const verifiedOnly = ref(false)
const closeMetroOnly = ref(false)
const selectedFinish = ref(initialQuickFilters.includes('renovation') ? 'Чистовая' : 'all')
const selectedCompletion = ref(initialQuickFilters.includes('completed') ? 'ready' : 'all')
const selectedQuickFilters = ref<QuickFilterId[]>(initialQuickFilters.filter(filter => !['renovation', 'completed', 'studio'].includes(filter)))
const searchScope = ref<'district' | 'metro'>(initialSearchScope)
const isLocationPickerOpen = ref(false)
const sortMode = ref<SortMode>('dateDesc')
const showMap = ref(route.query.map === 'true')
const savedSearch = ref(false)
const savedSearchSignature = ref('')
const isRestoringStoredState = ref(false)
const favorites = ref<string[]>([])
const catalogSearch = ref<HTMLElement | null>(null)
const apartmentsList = ref<HTMLElement | null>(null)
const mapCloseButton = ref<HTMLButtonElement | null>(null)
const activeMapSlug = ref(apartments.value[0]?.slug ?? '')
const shouldLoadCardImages = ref(false)
let previousBodyOverflow = ''
let cardImagesObserver: IntersectionObserver | null = null

const favoritesStorageKey = 'newbuild-catalog-favorites'
const savedSearchStorageKey = 'newbuild-catalog-saved-search-filters'

const readStorageItem = (key: string) => {
  if (!import.meta.client) {
    return null
  }

  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeStorageItem = (key: string, value: string) => {
  if (!import.meta.client) {
    return
  }

  try {
    localStorage.setItem(key, value)
  } catch {
    // State still works for the current session if browser storage is blocked.
  }
}

const removeStorageItem = (key: string) => {
  if (!import.meta.client) {
    return
  }

  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore storage errors: UI state has already been updated.
  }
}

const priceOptions = [
  { value: 'all', label: 'Любая цена' },
  { value: 'under7', label: 'до 7 млн ₽' },
  { value: 'under10', label: 'до 10 млн ₽' },
  { value: 'mortgage', label: 'ипотека до 40 тыс.' },
]

const purchaseConditionOptions: Array<{
  id: 'renovation' | 'mortgage_no_dp' | 'furniture' | 'completed' | 'installment'
  label: string
}> = [
  { id: 'renovation', label: 'С ремонтом' },
  { id: 'mortgage_no_dp', label: 'Без первоначального взноса' },
  { id: 'furniture', label: 'С мебелью' },
  { id: 'completed', label: 'Готовая' },
  { id: 'installment', label: 'С рассрочкой' },
]

const searchParamBadgeOptions: Array<{ id: QuickFilterId, label: string }> = [
  { id: 'renovation', label: 'С ремонтом' },
  { id: 'furniture', label: 'С мебелью' },
  { id: 'installment', label: 'С рассрочкой' },
  { id: 'mortgage_no_dp', label: 'Ипотека без ПВ' },
  { id: 'completed', label: 'Дом сдан' },
  { id: 'studio', label: 'Студии' },
]

const searchParamIds = new Set(searchParamBadgeOptions.map(option => option.id))
const defaultVerificationReport = 'Объявление №115 проверено 24.02.2026 10:01'

const locationShortcutOptions = [
  'Дзержинский район',
  'Калининский район',
  'Октябрьский район',
  'Центральный район',
  'Краснообск',
  'Железнодорожный район',
  'Кировский район',
  'Первомайский район',
  'г. Обь',
  'Заельцовский район',
  'Ленинский район',
  'Советский район',
  'Кольцово',
]

const sortOptions: Array<{ value: SortMode, label: string }> = [
  { value: 'priceAsc', label: 'Цена меньше' },
  { value: 'priceDesc', label: 'Цена больше' },
  { value: 'dateDesc', label: 'Дата свежее' },
  { value: 'dateAsc', label: 'Дата позднее' },
]

const normalizeSortMode = (value: unknown): SortMode => sortOptions.some(option => option.value === value)
  ? value as SortMode
  : 'dateDesc'

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

const getMetroDistance = (apartment: Apartment) => apartment.metroDistanceMeters || apartment.metroWalkMinutes * 80

const getComplexMinPrice = (apartment: Apartment) => Math.min(...getUnits(apartment).map(unit => unit.priceFrom || apartment.price))

const getComplexMaxPrice = (apartment: Apartment) => Math.max(...getUnits(apartment).map(unit => unit.priceTo || unit.priceFrom || apartment.price))

const getComplexMinMortgage = (apartment: Apartment) => Math.min(...getUnits(apartment).map(unit => unit.mortgageFrom || apartment.mortgagePayment))

const getCompletionSortValue = (apartment: Apartment) => {
  const completion = apartment.completion.toLowerCase()

  if (completion.includes('сдан')) {
    return 0
  }

  const year = Number(completion.match(/\d{4}/)?.[0] ?? 9999)
  const quarterMap: Record<string, number> = {
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
  }
  const quarter = quarterMap[completion.match(/\b(i|ii|iii|iv)\b/)?.[1] ?? ''] ?? 4

  return year * 10 + quarter
}

const getComplexUnitCount = (apartment: Apartment) => getUnits(apartment).reduce((sum, unit) => sum + unit.count, 0)

const getVerificationReportText = (apartment: Apartment) => {
  if (!apartment.verified) {
    return ''
  }

  return apartment.verificationReport?.trim() || defaultVerificationReport
}

const getComplexPhotoCount = (apartment: Apartment) => {
  const images = apartment.images?.length
    ? apartment.images
    : apartment.image
      ? [apartment.image]
      : []

  return new Set(images.filter(Boolean)).size
}

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
].join(' ').toLowerCase()

const normalizeApartmentSearchParams = (value: unknown): QuickFilterId[] => Array.isArray(value)
  ? [...new Set(value
      .map(String)
      .filter((item): item is QuickFilterId => searchParamIds.has(item as QuickFilterId)))]
  : []

const inferApartmentSearchParams = (apartment: Apartment): QuickFilterId[] => {
  const searchText = getApartmentSearchText(apartment)
  const units = getUnits(apartment)

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
        return apartment.completion === 'Сдан'
      }

      return units.some(unit => unit.rooms === 'Студия')
    })
    .map(option => option.id)
}

const getApartmentSearchParams = (apartment: Apartment): QuickFilterId[] => Array.isArray(apartment.searchParams)
  ? normalizeApartmentSearchParams(apartment.searchParams)
  : inferApartmentSearchParams(apartment)

const getApartmentSearchParamBadges = (apartment: Apartment) => {
  const params = new Set(getApartmentSearchParams(apartment))
  return searchParamBadgeOptions.filter(option => params.has(option.id))
}

const matchesQuickFilter = (apartment: Apartment, filter: QuickFilterId) => {
  return getApartmentSearchParams(apartment).includes(filter)
}

const districtOptions = computed(() => [...new Set(apartments.value.map(apartment => apartment.district))]
  .map(district => ({
    value: district,
    label: district,
    count: apartments.value.filter(apartment => apartment.district === district).length,
  })))

const metroOptions = computed(() => [...new Set(apartments.value.map(apartment => apartment.metroStation))]
  .map(metro => ({
    value: metro,
    label: metro,
    count: apartments.value.filter(apartment => apartment.metroStation === metro).length,
  })))

const locationOptions = computed(() => (
  searchScope.value === 'district'
    ? districtOptions.value
    : metroOptions.value
))

const filteredLocationOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return locationOptions.value
  }

  return locationOptions.value.filter(option => option.label.toLowerCase().includes(query))
})

const filteredApartments = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return apartments.value.filter((apartment) => {
    const searchableValues = {
      district: [apartment.title, apartment.complex, apartment.district, apartment.address],
      metro: [apartment.metroStation],
    }

    const matchesQuery = !query || searchableValues[searchScope.value]
      .some(value => value.toLowerCase().includes(query))

    const units = getUnits(apartment)
    const matchesRooms = selectedRooms.value.length === 0 || units.some(unit => selectedRooms.value.includes(unit.rooms))
    const matchesVerified = !verifiedOnly.value || apartment.verified
    const matchesMetro = !closeMetroOnly.value || getMetroDistance(apartment) <= 900
    const matchesFinish = selectedFinish.value === 'all' || units.some(unit => unit.finish === selectedFinish.value)
    const matchesCompletion =
      selectedCompletion.value === 'all'
      || (selectedCompletion.value === 'ready' && apartment.completion === 'Сдан')
      || (selectedCompletion.value !== 'ready' && apartment.completion.includes(selectedCompletion.value))
    const matchesQuickFilters = selectedQuickFilters.value.every(filter => matchesQuickFilter(apartment, filter))

    const matchesPrice =
      selectedPrice.value === 'all'
      || (selectedPrice.value === 'under7' && getComplexMinPrice(apartment) <= 7000000)
      || (selectedPrice.value === 'under10' && getComplexMinPrice(apartment) <= 10000000)
      || (selectedPrice.value === 'mortgage' && getComplexMinMortgage(apartment) <= 40000)

    return matchesQuery
      && matchesRooms
      && matchesPrice
      && matchesVerified
      && matchesMetro
      && matchesFinish
      && matchesCompletion
      && matchesQuickFilters
  })
})

const sortedApartments = computed(() => {
  const items = [...filteredApartments.value]

  if (sortMode.value === 'priceAsc') {
    return items.sort((first, second) => getComplexMinPrice(first) - getComplexMinPrice(second))
  }

  if (sortMode.value === 'priceDesc') {
    return items.sort((first, second) => getComplexMaxPrice(second) - getComplexMaxPrice(first))
  }

  if (sortMode.value === 'dateAsc') {
    return items.sort((first, second) => getCompletionSortValue(first) - getCompletionSortValue(second))
  }

  return items.sort((first, second) => getCompletionSortValue(second) - getCompletionSortValue(first))
})

const visibleApartments = computed(() => sortedApartments.value.slice(0, visibleCount.value))
const hasMoreApartments = computed(() => visibleCount.value < sortedApartments.value.length)
const mapSpotlightStats = computed(() => {
  const nearestMetro = sortedApartments.value.length
    ? Math.min(...sortedApartments.value.map(getMetroDistance))
    : 0

  return [
    { value: String(sortedApartments.value.length), label: 'ЖК найдено' },
    { value: nearestMetro ? `${formatPrice(nearestMetro)} м` : '0 м', label: 'ближайшее метро' },
    { value: String(new Set(sortedApartments.value.map(apartment => apartment.district)).size), label: 'района в выдаче' },
  ]
})
const searchPlaceholder = computed(() => {
  if (searchScope.value === 'district') {
    return 'Выберите район'
  }

  return 'Выберите станцию метро'
})

const activeFiltersCount = computed(() => {
  let count = selectedRooms.value.length

  if (selectedPrice.value !== 'all') count += 1
  if (verifiedOnly.value) count += 1
  if (closeMetroOnly.value) count += 1
  if (selectedFinish.value !== 'all') count += 1
  if (selectedCompletion.value !== 'all') count += 1
  count += selectedQuickFilters.value.length
  if (searchQuery.value.trim()) count += 1

  return count
})

const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

const formatPrice = (value: number) => new Intl.NumberFormat('ru-RU').format(value)

const formatMetroDistance = (apartment: Apartment) => `${formatPrice(getMetroDistance(apartment))} м до метро`

const getDescriptionExcerpt = (description: string, limit = 165) => {
  const normalizedDescription = description.replace(/\s+/g, ' ').trim()

  if (normalizedDescription.length <= limit) {
    return normalizedDescription
  }

  const excerpt = normalizedDescription.slice(0, limit)
  const lastSpaceIndex = excerpt.lastIndexOf(' ')

  return `${excerpt.slice(0, lastSpaceIndex > 90 ? lastSpaceIndex : limit).trim()}...`
}

const getSearchFiltersState = (): SearchFiltersState => ({
  searchQuery: searchQuery.value,
  selectedRooms: [...selectedRooms.value].sort(),
  selectedPrice: selectedPrice.value,
  verifiedOnly: verifiedOnly.value,
  closeMetroOnly: closeMetroOnly.value,
  selectedFinish: selectedFinish.value,
  selectedCompletion: selectedCompletion.value,
  selectedQuickFilters: [...selectedQuickFilters.value].sort(),
  searchScope: searchScope.value,
  sortMode: sortMode.value,
})

const getSearchFiltersSignature = (state = getSearchFiltersState()) => JSON.stringify(state)

const currentSearchFiltersSignature = computed(() => getSearchFiltersSignature())

const isSearchFiltersState = (value: unknown): value is SearchFiltersState => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const state = value as Partial<SearchFiltersState>

  return typeof state.searchQuery === 'string'
    && Array.isArray(state.selectedRooms)
    && state.selectedRooms.every(room => typeof room === 'string')
    && typeof state.selectedPrice === 'string'
    && typeof state.verifiedOnly === 'boolean'
    && typeof state.closeMetroOnly === 'boolean'
    && typeof state.selectedFinish === 'string'
    && typeof state.selectedCompletion === 'string'
    && (!('selectedQuickFilters' in state)
      || (Array.isArray(state.selectedQuickFilters)
        && state.selectedQuickFilters.every(filter => quickFilterIds.includes(filter as QuickFilterId))))
    && (state.searchScope === 'district' || state.searchScope === 'metro')
    && typeof state.sortMode === 'string'
}

const applySearchFiltersState = (state: SearchFiltersState) => {
  searchQuery.value = state.searchQuery
  selectedRooms.value = [...state.selectedRooms]
  selectedPrice.value = state.selectedPrice
  verifiedOnly.value = state.verifiedOnly
  closeMetroOnly.value = state.closeMetroOnly
  selectedFinish.value = state.selectedFinish === 'Чистовая' ? 'Чистовая' : 'all'
  selectedCompletion.value = state.selectedCompletion === 'ready' ? 'ready' : 'all'
  selectedQuickFilters.value = Array.isArray(state.selectedQuickFilters)
    ? state.selectedQuickFilters.filter(filter => quickFilterIds.includes(filter))
    : []
  searchScope.value = state.searchScope
  sortMode.value = normalizeSortMode(state.sortMode)
  resetVisibleCount()
}

const resetVisibleCount = () => {
  visibleCount.value = props.initialLimit
}

const setPrice = (price: string) => {
  selectedPrice.value = price
  resetVisibleCount()
}

const setSortMode = (mode: SortMode) => {
  sortMode.value = mode
  resetVisibleCount()
}

const setSortModeFromEvent = (event: Event) => {
  setSortMode(normalizeSortMode((event.target as HTMLSelectElement).value))
}

const isPurchaseConditionActive = (id: typeof purchaseConditionOptions[number]['id']) => {
  if (id === 'renovation') {
    return selectedFinish.value === 'Чистовая'
  }

  if (id === 'completed') {
    return selectedCompletion.value === 'ready'
  }

  return selectedQuickFilters.value.includes(id)
}

const togglePurchaseCondition = (id: typeof purchaseConditionOptions[number]['id']) => {
  if (id === 'renovation') {
    selectedFinish.value = selectedFinish.value === 'Чистовая' ? 'all' : 'Чистовая'
    resetVisibleCount()
    return
  }

  if (id === 'completed') {
    selectedCompletion.value = selectedCompletion.value === 'ready' ? 'all' : 'ready'
    resetVisibleCount()
    return
  }

  selectedQuickFilters.value = selectedQuickFilters.value.includes(id)
    ? selectedQuickFilters.value.filter(filter => filter !== id)
    : [...selectedQuickFilters.value, id]
  resetVisibleCount()
}

const setLocationShortcut = (location: string) => {
  searchScope.value = 'district'
  searchQuery.value = location
  isLocationPickerOpen.value = false
  resetVisibleCount()
}

const closeLocationPickerOnOutsideClick = (event: PointerEvent) => {
  if (!catalogSearch.value?.contains(event.target as Node)) {
    isLocationPickerOpen.value = false
  }
}

const restoreStoredCatalogState = () => {
  try {
    const storedFavorites = JSON.parse(readStorageItem(favoritesStorageKey) ?? '[]')

    if (Array.isArray(storedFavorites)) {
      const apartmentSlugs = new Set(apartments.value.map(apartment => apartment.slug))
      favorites.value = storedFavorites
        .filter((slug): slug is string => typeof slug === 'string' && apartmentSlugs.has(slug))
    }

    const storedSavedSearch = readStorageItem(savedSearchStorageKey)

    if (storedSavedSearch && !hasInitialRouteFilters) {
      const savedFilters = JSON.parse(storedSavedSearch)

      if (isSearchFiltersState(savedFilters)) {
        isRestoringStoredState.value = true
        applySearchFiltersState(savedFilters)
        savedSearchSignature.value = getSearchFiltersSignature(savedFilters)
        savedSearch.value = true
        isRestoringStoredState.value = false
      }
    }
  } catch {
    favorites.value = []
    savedSearch.value = false
    savedSearchSignature.value = ''
    isRestoringStoredState.value = false
  }
}

const observeCardImages = async () => {
  if (!import.meta.client || shouldLoadCardImages.value) {
    return
  }

  await nextTick()

  if (!apartmentsList.value || !('IntersectionObserver' in window)) {
    shouldLoadCardImages.value = true
    return
  }

  cardImagesObserver = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) {
      return
    }

    shouldLoadCardImages.value = true
    cardImagesObserver?.disconnect()
    cardImagesObserver = null
  }, {
    rootMargin: '80px',
  })

  cardImagesObserver.observe(apartmentsList.value)
}

onMounted(() => {
  restoreStoredCatalogState()
  void observeCardImages()
  document.addEventListener('pointerdown', closeLocationPickerOnOutsideClick)
  document.addEventListener('keydown', closeMapOnEscape)

  if (showMap.value) {
    activeMapSlug.value = sortedApartments.value[0]?.slug ?? ''
  }
})

onBeforeUnmount(() => {
  cardImagesObserver?.disconnect()
  cardImagesObserver = null
  document.removeEventListener('pointerdown', closeLocationPickerOnOutsideClick)
  document.removeEventListener('keydown', closeMapOnEscape)

  if (import.meta.client) {
    document.body.style.overflow = previousBodyOverflow
  }
})

watch(favorites, (value) => {
  writeStorageItem(favoritesStorageKey, JSON.stringify(value))
})

watch(currentSearchFiltersSignature, (value) => {
  if (isRestoringStoredState.value) {
    return
  }

  savedSearch.value = Boolean(savedSearchSignature.value && value === savedSearchSignature.value)
})

watch(sortedApartments, (items) => {
  if (items.length === 0) {
    activeMapSlug.value = ''
    return
  }

  if (!items.some(apartment => apartment.slug === activeMapSlug.value)) {
    activeMapSlug.value = items[0].slug
  }
})

const toggleSavedSearch = () => {
  if (savedSearch.value) {
    savedSearch.value = false
    savedSearchSignature.value = ''
    removeStorageItem(savedSearchStorageKey)
    return
  }

  const filtersState = getSearchFiltersState()

  savedSearchSignature.value = getSearchFiltersSignature(filtersState)
  savedSearch.value = true
  writeStorageItem(savedSearchStorageKey, JSON.stringify(filtersState))
}

const setSearchScope = (scope: 'district' | 'metro') => {
  if (searchScope.value === scope) {
    isLocationPickerOpen.value = !isLocationPickerOpen.value
    resetVisibleCount()
    return
  }

  searchQuery.value = ''
  searchScope.value = scope
  isLocationPickerOpen.value = true
  resetVisibleCount()
}

const selectLocationOption = (value: string) => {
  searchQuery.value = value
  isLocationPickerOpen.value = false
  resetVisibleCount()
}

const clearLocationFilter = () => {
  searchQuery.value = ''
  isLocationPickerOpen.value = true
  resetVisibleCount()
}

const toggleVerifiedOnly = () => {
  verifiedOnly.value = !verifiedOnly.value
  resetVisibleCount()
}

const toggleCloseMetroOnly = () => {
  closeMetroOnly.value = !closeMetroOnly.value
  resetVisibleCount()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedRooms.value = []
  selectedPrice.value = 'all'
  verifiedOnly.value = false
  closeMetroOnly.value = false
  selectedFinish.value = 'all'
  selectedCompletion.value = 'all'
  selectedQuickFilters.value = []
  searchScope.value = 'district'
  sortMode.value = 'dateDesc'
  isLocationPickerOpen.value = false
  resetVisibleCount()
}

const openMapFromSpotlight = async () => {
  if (!showMap.value) {
    showMap.value = true
    activeMapSlug.value = sortedApartments.value[0]?.slug ?? ''
  }

  await nextTick()
  mapCloseButton.value?.focus()
}

const closeMap = () => {
  showMap.value = false
}

const closeMapOnEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showMap.value) {
    closeMap()
  }
}

watch(showMap, async (value) => {
  if (!import.meta.client) {
    return
  }

  if (value) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    mapCloseButton.value?.focus()
    return
  }

  document.body.style.overflow = previousBodyOverflow
}, { immediate: true })

const toggleFavorite = (slug: string) => {
  favorites.value = favorites.value.includes(slug)
    ? favorites.value.filter(item => item !== slug)
    : [...favorites.value, slug]
}

const showMore = () => {
  visibleCount.value = Math.min(visibleCount.value + props.loadStep, sortedApartments.value.length)
}

const goToApartment = (slug: string) => {
  navigateTo(`/catalog/${slug}`)
}
</script>

<template>
  <section class="apartments-section">
    <div class="container">
      <div class="catalog-head">
        

        <h1 class="catalog-head__title">
          Жилые комплексы в Новосибирске
        </h1>
      </div>

      <MapSpotlight
        variant="catalog"
        :contained="false"
        eyebrow="ЖК на карте"
        title="Посмотреть комплексы на карте"
        description="Откройте карту, чтобы сравнить расположение ЖК, расстояние до метро и удобство района до просмотра карточек."
        primary-label="Развернуть карту"
        :stats="mapSpotlightStats"
        @open-map="openMapFromSpotlight"
      />

      <Teleport to="body">
        <Transition name="catalog-map-modal">
          <section
            v-if="showMap"
            class="catalog-map-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Карта жилых комплексов"
          >
            <div
              class="catalog-map-modal__backdrop"
              aria-hidden="true"
              @click="closeMap"
            ></div>

            <div class="catalog-map-modal__panel">
              <button
                ref="mapCloseButton"
                type="button"
                class="catalog-map-modal__close"
                aria-label="Закрыть карту"
                @click="closeMap"
              >
                <i class="bi bi-x-lg" aria-hidden="true"></i>
              </button>

              <LazyCatalogComplexMap :apartments="sortedApartments" />
            </div>
          </section>
        </Transition>
      </Teleport>

      <div class="catalog-toolbar">
        <div class="catalog-toolbar__inner">
          <div
            ref="catalogSearch"
            class="catalog-search"
            @keydown.esc="isLocationPickerOpen = false"
          >
            <i class="bi bi-search" aria-hidden="true"></i>

            <input
              v-model="searchQuery"
              type="search"
              :placeholder="searchPlaceholder"
              aria-label="Поиск по каталогу"
              @focus="isLocationPickerOpen = true"
              @input="resetVisibleCount(); isLocationPickerOpen = true"
            >

            <button
              v-if="searchQuery"
              type="button"
              class="catalog-search__clear"
              aria-label="Очистить выбранный район или метро"
              @click="clearLocationFilter"
            >
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>

            <div class="catalog-search__modes">
              <button
                type="button"
                :class="{ 'catalog-search__mode--active': searchScope === 'district' }"
                @click="setSearchScope('district')"
              >
                Район
              </button>

              <button
                type="button"
                :class="{ 'catalog-search__mode--active': searchScope === 'metro' }"
                @click="setSearchScope('metro')"
              >
                Метро
              </button>
            </div>

            <div
              v-if="isLocationPickerOpen"
              class="catalog-search__dropdown"
            >
              <button
                v-for="option in filteredLocationOptions"
                :key="option.value"
                type="button"
                :class="{ 'catalog-search__option--active': searchQuery === option.value }"
                @pointerdown.prevent="selectLocationOption(option.value)"
                @mousedown.prevent="selectLocationOption(option.value)"
                @click.prevent="selectLocationOption(option.value)"
              >
                <span>{{ option.label }}</span>
                <strong>{{ option.count }}</strong>
              </button>

              <p v-if="filteredLocationOptions.length === 0">
                Ничего не найдено
              </p>
            </div>
          </div>

          <div class="catalog-sort" aria-label="Сортировка каталога">
            <strong>Найдено {{ sortedApartments.length }} ЖК</strong>

            <label class="catalog-sort__select">
              <span>Сортировка</span>

              <select
                :value="sortMode"
                aria-label="Сортировка по цене и дате"
                @change="setSortModeFromEvent"
              >
                <option
                  v-for="option in sortOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>
          </div>

          <button
            type="button"
            class="catalog-save"
            :class="{ 'catalog-save--active': savedSearch }"
            @click="toggleSavedSearch"
          >
            <i
              class="bi"
              :class="savedSearch ? 'bi-heart-fill' : 'bi-heart'"
              aria-hidden="true"
            ></i>
            <span>{{ savedSearch ? 'Поиск сохранен' : 'Сохранить поиск' }}</span>
          </button>

          <div class="catalog-toolbar__filters">
            <span class="catalog-chip catalog-chip--active" aria-current="true">
              Купить
            </span>

            <span class="catalog-chip catalog-chip--active" aria-current="true">
              Жилой комплекс
            </span>

            <div class="catalog-chip-group" aria-label="Условия покупки">
              <button
                v-for="option in purchaseConditionOptions"
                :key="option.id"
                type="button"
                class="catalog-chip"
                :class="{ 'catalog-chip--active': isPurchaseConditionActive(option.id) }"
                @click="togglePurchaseCondition(option.id)"
              >
                {{ option.label }}
              </button>
            </div>

            <div class="catalog-chip-group" aria-label="Цена">
              <button
                v-for="option in priceOptions"
                :key="option.value"
                type="button"
                class="catalog-chip"
                :class="{ 'catalog-chip--active': selectedPrice === option.value }"
                @click="setPrice(option.value)"
              >
                {{ option.label }}
              </button>
            </div>

            <button
              type="button"
              class="catalog-chip catalog-chip--with-dot"
              :class="{ 'catalog-chip--active': verifiedOnly }"
              @click="toggleVerifiedOnly"
            >
              Проверенные
            </button>

            <button
              type="button"
              class="catalog-chip"
              :class="{ 'catalog-chip--active': closeMetroOnly }"
              @click="toggleCloseMetroOnly"
            >
              До метро ≤ 900 м
            </button>

            <div class="catalog-chip-group catalog-chip-group--locations" aria-label="Районы и локации">
              <button
                v-for="location in locationShortcutOptions"
                :key="location"
                type="button"
                class="catalog-chip"
                :class="{ 'catalog-chip--active': searchScope === 'district' && searchQuery === location }"
                @click="setLocationShortcut(location)"
              >
                {{ location.replace(' район', '') }}
              </button>
            </div>

            <button
              v-if="hasActiveFilters"
              type="button"
              class="catalog-chip catalog-chip--reset"
              @click="resetFilters"
            >
              Сбросить
            </button>
          </div>
        </div>

      </div>

      <div
        ref="apartmentsList"
        class="apartments-list"
      >
        <article
          v-for="(apartment, index) in visibleApartments"
          :key="apartment.slug"
          class="apartment-card"
          tabindex="0"
          role="link"
          @click="goToApartment(apartment.slug)"
          @keydown.enter="goToApartment(apartment.slug)"
          @keydown.space.prevent="goToApartment(apartment.slug)"
        >
          <div class="apartment-card__media">
            <img
              v-if="shouldLoadCardImages"
              :src="apartment.image"
              :alt="apartment.title"
              loading="lazy"
              fetchpriority="low"
              decoding="async"
            >

            <div
              v-else
              class="apartment-card__image-placeholder"
              aria-hidden="true"
            ></div>

            <div class="apartment-card__photo-count">
              <i class="bi bi-images" aria-hidden="true"></i>
              <span>{{ getComplexPhotoCount(apartment) }} фото</span>
            </div>

            <button
              type="button"
              class="apartment-card__favorite"
              :class="{ 'apartment-card__favorite--active': favorites.includes(apartment.slug) }"
              :aria-label="favorites.includes(apartment.slug) ? 'Удалить из избранного' : 'Добавить в избранное'"
              @click.stop="toggleFavorite(apartment.slug)"
            >
              <i
                class="bi"
                :class="favorites.includes(apartment.slug) ? 'bi-heart-fill' : 'bi-heart'"
                aria-hidden="true"
              ></i>
            </button>
          </div>

          <div class="apartment-card__body">
            <div class="apartment-card__main">
              <div
                v-if="apartment.verified || getApartmentSearchParamBadges(apartment).length"
                class="apartment-card__tags"
              >
                <span
                  v-if="apartment.verified"
                  class="apartment-card__tag apartment-card__tag--verified"
                >
                  <i class="bi bi-patch-check-fill" aria-hidden="true"></i>
                  Проверено
                </span>

                <span
                  v-for="param in getApartmentSearchParamBadges(apartment)"
                  :key="param.id"
                  class="apartment-card__tag"
                >
                  {{ param.label }}
                </span>
              </div>

              <h3 class="apartment-card__title">
                {{ apartment.title }}
              </h3>

              <p class="apartment-card__complex">
                {{ getComplexUnitCount(apartment) }} вариантов квартир
              </p>

              <p class="apartment-card__address">
                <i class="bi bi-geo-alt" aria-hidden="true"></i>
                <span>{{ apartment.address }}</span>
              </p>

              <p class="apartment-card__metro">
                <i class="bi bi-train-front" aria-hidden="true"></i>
                <span>{{ apartment.metroStation }} · {{ formatMetroDistance(apartment) }}</span>
              </p>

              <p
                v-if="apartment.description"
                class="apartment-card__description"
              >
                {{ getDescriptionExcerpt(apartment.description) }}
                <NuxtLink
                  :to="`/catalog/${apartment.slug}`"
                  class="apartment-card__description-link"
                  @click.stop
                >
                  читать дальше
                </NuxtLink>
              </p>

              <p
                v-if="getVerificationReportText(apartment)"
                class="apartment-card__verification-report"
              >
                <i class="bi bi-shield-check" aria-hidden="true"></i>
                <span>{{ getVerificationReportText(apartment) }}</span>
              </p>
            </div>

            <div class="apartment-card__aside">
              <div>
                <p class="apartment-card__price">
                  от {{ formatPrice(getComplexMinPrice(apartment)) }} ₽
                </p>
              </div>

              <div class="apartment-card__mortgage">
                <i class="bi bi-bank" aria-hidden="true"></i>
                <span>
                  <small>Ипотека от</small>
                  <strong>{{ formatPrice(getComplexMinMortgage(apartment)) }} ₽/мес.</strong>
                </span>
              </div>

              <a
                :href="apartment.phoneHref"
                class="apartment-card__phone"
                @click.stop
              >
                <i class="bi bi-telephone" aria-hidden="true"></i>
                <span>{{ apartment.phone }}</span>
              </a>

              <span class="apartment-card__link">
                Смотреть ЖК
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </span>
            </div>
          </div>
        </article>
      </div>

      <div
        v-if="filteredApartments.length === 0"
        class="apartments-empty"
      >
        <h2>Подходящих ЖК не найдено</h2>
        <p>Измените параметры поиска или сбросьте фильтры.</p>
      </div>

      <div
        v-if="hasMoreApartments"
        class="apartments-more"
      >
        <button
          type="button"
          class="apartments-more__btn"
          @click="showMore"
        >
          Показать больше
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.apartments-section {
  padding: 0 0 96px;
  background:
    linear-gradient(180deg, #f7faff 0%, #fff 320px),
    #fff;
}

.catalog-map-modal {
  position: fixed;
  z-index: 1400;
  inset: 0;
  display: flex;
}

.catalog-map-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(7, 18, 61, 0.72);
  backdrop-filter: blur(8px);
}

.catalog-map-modal__panel {
  position: relative;
  z-index: 1;
  overflow: hidden;
  width: 100%;
  height: 100dvh;
  border: 0;
  border-radius: 0;
  background: #fff;
  box-shadow: none;
}

.catalog-map-modal__close {
  position: absolute;
  z-index: 6;
  top: 18px;
  right: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(207, 218, 240, 0.9);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  color: #07123d;
  box-shadow: 0 10px 28px rgba(14, 30, 62, 0.16);
}

.catalog-map-modal__close:hover,
.catalog-map-modal__close:focus {
  color: #0d5bd7;
  outline: 0;
  box-shadow: 0 12px 30px rgba(13, 110, 253, 0.2);
}

.catalog-map-modal :deep(.catalog-real-map) {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.catalog-map-modal :deep(.catalog-real-map__head) {
  flex: 0 0 auto;
  padding-right: 78px;
}

.catalog-map-modal :deep(.catalog-real-map__canvas) {
  flex: 1 1 auto;
  min-height: 0;
}

.catalog-map-modal-enter-active,
.catalog-map-modal-leave-active {
  transition: opacity 0.18s ease;
}

.catalog-map-modal-enter-from,
.catalog-map-modal-leave-to {
  opacity: 0;
}

.catalog-toolbar {
  position: relative;
  z-index: 10;
  margin: 0 0 34px;
  padding: 18px;
  border: 1px solid rgba(207, 218, 240, 0.95);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 46px rgba(14, 30, 62, 0.08);
}

.catalog-toolbar__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: flex-start;
}

.catalog-toolbar__filters,
.catalog-chip-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.catalog-chip-group {
  flex: 0 1 auto;
  flex-wrap: wrap;
}

.catalog-toolbar__filters {
  flex: 1 1 100%;
  min-width: 0;
  max-width: 100%;
  overflow: visible;
  padding: 0;
  scrollbar-width: none;
  white-space: normal;
  flex-wrap: wrap;
}

.catalog-toolbar__filters::-webkit-scrollbar {
  display: none;
}

.catalog-chip-group--locations {
  flex: 1 1 100%;
}

.catalog-chip {
  position: relative;
  flex: 0 0 auto;
  min-height: 36px;
  padding: 9px 15px;
  border: 1px solid #cfdaf0;
  border-radius: 8px;
  background: #fff;
  color: #182033;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.15;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.catalog-chip:hover,
.catalog-chip--active {
  border-color: rgba(13, 110, 253, 0.35);
  background: #edf4ff;
  color: #0d5bd7;
  box-shadow: 0 8px 20px rgba(13, 110, 253, 0.08);
}

.catalog-chip--reset {
  color: #647082;
}

.catalog-chip--with-dot::after {
  content: "";
  position: absolute;
  top: -4px;
  right: -4px;
  width: 9px;
  height: 9px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #d82244;
}

.catalog-search {
  flex: 1 1 390px;
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
  min-width: 420px;
  max-width: none;
  min-height: 50px;
  padding: 0 14px;
  border: 1px solid #cfdaf0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 10px 26px rgba(14, 30, 62, 0.05);
}

.catalog-search i {
  color: #0d6efd;
  font-size: 18px;
}

.catalog-search input {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 0;
  outline: 0;
  background: transparent;
  color: #182033;
  font-size: 15px;
  font-weight: 700;
}

.catalog-search input::placeholder {
  color: #7b8492;
}

.catalog-search__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  background: #f0f6ff;
  color: #647082;
  font-size: 12px;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.catalog-search__clear:hover {
  background: #e2efff;
  color: #0d6efd;
}

.catalog-search__modes {
  display: flex;
  align-items: center;
  gap: 0;
  color: #0d6efd;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
}

.catalog-search__modes button {
  padding: 0 10px;
  border: 0;
  border-left: 1px solid #cfdaf0;
  background: transparent;
  color: #0d6efd;
  font: inherit;
  line-height: 1;
}

.catalog-search__modes button:first-child {
  border-left: 0;
}

.catalog-search__modes button:hover,
.catalog-search__mode--active {
  color: #07123d;
}

.catalog-search__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  z-index: 30;
  display: grid;
  gap: 4px;
  max-height: 280px;
  overflow: auto;
  padding: 8px;
  border: 1px solid #dbe6f4;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 18px 44px rgba(14, 30, 62, 0.14);
}

.catalog-search__dropdown button {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  width: 100%;
  padding: 11px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #182033;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.2;
  text-align: left;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.catalog-search__dropdown button:hover,
.catalog-search__option--active {
  background: #edf4ff;
  color: #0d5bd7;
}

.catalog-search__dropdown span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.catalog-search__dropdown strong {
  color: #697997;
  font-size: 13px;
  font-weight: 900;
}

.catalog-search__dropdown p {
  margin: 0;
  padding: 12px;
  color: #647082;
  font-size: 14px;
  font-weight: 700;
}

.catalog-sort {
  flex: 2 1 560px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 50px;
}

.catalog-sort strong {
  flex: 0 0 auto;
  margin-right: 2px;
  color: #182033;
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

.catalog-sort__select {
  flex: 0 1 270px;
  display: grid;
  grid-template-columns: auto minmax(170px, 1fr);
  gap: 8px;
  align-items: center;
  min-width: 250px;
}

.catalog-sort__select span {
  color: #647082;
  font-size: 13px;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

.catalog-sort__select select {
  width: 100%;
  min-height: 40px;
  padding: 9px 34px 9px 12px;
  border: 1px solid #cfdaf0;
  border-radius: 8px;
  background:
    linear-gradient(45deg, transparent 50%, #0d6efd 50%) right 16px center / 6px 6px no-repeat,
    linear-gradient(135deg, #0d6efd 50%, transparent 50%) right 11px center / 6px 6px no-repeat,
    #fff;
  color: #182033;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  appearance: none;
  outline: 0;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.catalog-sort__select select:hover,
.catalog-sort__select select:focus {
  border-color: rgba(13, 110, 253, 0.45);
  box-shadow: 0 8px 20px rgba(13, 110, 253, 0.08);
}

.catalog-save {
  flex: 0 0 auto;
  order: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  margin-top: 4px;
  padding: 10px 14px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #0d6efd;
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.catalog-save:hover,
.catalog-save--active {
  background: #edf4ff;
  color: #0b5ed7;
}

.catalog-toolbar__filters {
  order: 4;
}

.catalog-head {
  padding: 36px 0 34px;
}

.catalog-head__breadcrumbs {
  margin: 0 0 28px;
  color: #697997;
  font-size: 15px;
  font-weight: 600;
}

.catalog-head__title {
  margin: 0 0 18px;
  color: #07123d;
  font-size: clamp(30px, 3vw, 42px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.apartments-list {
  display: grid;
  gap: 18px;
}

.apartment-card {
  display: grid;
  grid-template-columns: minmax(280px, 34%) minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid #e7edf5;
  border-radius: 18px;
  background: #fff;
  color: inherit;
  cursor: pointer;
  box-shadow: 0 16px 42px rgba(14, 30, 62, 0.07);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.apartment-card:hover,
.apartment-card:focus-visible {
  transform: translateY(-3px);
  border-color: rgba(13, 110, 253, 0.28);
  outline: 0;
  box-shadow: 0 24px 58px rgba(14, 30, 62, 0.12);
}

.apartment-card__media {
  position: relative;
  min-height: 280px;
  overflow: hidden;
  background: #eef3f8;
}

.apartment-card__media img {
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.apartment-card__image-placeholder {
  width: 100%;
  height: 100%;
  min-height: 280px;
  background:
    linear-gradient(135deg, rgba(13, 110, 253, 0.14), rgba(255, 255, 255, 0.78)),
    #eef3f8;
}

.apartment-card:hover .apartment-card__media img {
  transform: scale(1.025);
}

.apartment-card__photo-count,
.apartment-card__favorite {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.apartment-card__photo-count {
  left: 16px;
  bottom: 16px;
  gap: 7px;
  padding: 8px 11px;
  border-radius: 999px;
  background: rgba(7, 18, 61, 0.78);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
}

.apartment-card__favorite {
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #0d6efd;
  font-size: 20px;
  box-shadow: 0 12px 30px rgba(14, 30, 62, 0.14);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.apartment-card__favorite:hover {
  transform: scale(1.05);
}

.apartment-card__favorite--active {
  background: #0d6efd;
  color: #fff;
}

.apartment-card__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(230px, 28%);
  gap: 26px;
  padding: 24px 26px;
}

.apartment-card__main {
  min-width: 0;
}

.apartment-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.apartment-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  background: #f0f6ff;
  color: #0d5bd7;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
}

.apartment-card__tag--verified {
  background: #eaf8ef;
  color: #1f8a4c;
}

.apartment-card__title {
  margin: 0 0 8px;
  color: #07123d;
  font-size: 24px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.apartment-card__complex {
  margin: 0 0 10px;
  color: #182033;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.35;
}

.apartment-card__address,
.apartment-card__metro {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  color: #647082;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

.apartment-card__address {
  margin-bottom: 8px;
}

.apartment-card__metro {
  margin-bottom: 18px;
}

.apartment-card__address i,
.apartment-card__metro i {
  flex: 0 0 auto;
  color: #0d6efd;
}

.apartment-card__description {
  max-width: 620px;
  margin: -2px 0 16px;
  color: #4f5d72;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.52;
}

.apartment-card__description-link {
  display: inline-flex;
  align-items: center;
  margin-left: 5px;
  color: #0d6efd;
  font-weight: 900;
  text-decoration: none;
  white-space: nowrap;
}

.apartment-card__description-link:hover,
.apartment-card__description-link:focus-visible {
  color: #0b5ed7;
  text-decoration: underline;
  outline: 0;
}

.apartment-card__verification-report {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  padding: 0;
  color: #42b93f;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.35;
}

.apartment-card__verification-report i {
  flex: 0 0 auto;
  color: #21306b;
  font-size: 15px;
}

.apartment-card__aside {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  padding-left: 24px;
  border-left: 1px solid #edf1f6;
}

.apartment-card__price {
  margin: 0 0 6px;
  color: #07123d;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.apartment-card__mortgage {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 13px 14px;
  border: 1px solid rgba(13, 110, 253, 0.16);
  border-radius: 14px;
  background: #edf5ff;
  color: #07123d;
  box-shadow: 0 10px 22px rgba(13, 110, 253, 0.08);
}

.apartment-card__mortgage i {
  flex: 0 0 auto;
  margin-top: 2px;
  color: #0d6efd;
  font-size: 16px;
}

.apartment-card__mortgage span {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.apartment-card__mortgage small {
  color: #647082;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
}

.apartment-card__mortgage strong {
  color: #07123d;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.15;
}

.apartment-card__phone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #0d6efd;
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
  text-decoration: none;
  box-shadow: 0 12px 26px rgba(13, 110, 253, 0.22);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.apartment-card__phone:hover {
  transform: translateY(-2px);
  background: #0b5ed7;
  color: #fff;
}

.apartment-card__link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #0d6efd;
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
}

.apartments-empty {
  padding: 42px;
  border: 1px solid #e7edf5;
  border-radius: 18px;
  background: #fff;
  text-align: center;
  box-shadow: 0 16px 42px rgba(14, 30, 62, 0.07);
}

.apartments-empty h2 {
  margin: 0 0 8px;
  color: #07123d;
  font-size: 24px;
  font-weight: 900;
}

.apartments-empty p {
  margin: 0;
  color: #647082;
  font-size: 15px;
  font-weight: 600;
}

.apartments-more {
  display: flex;
  justify-content: center;
  margin-top: 34px;
}

.apartments-more__btn {
  min-height: 56px;
  padding: 16px 30px;
  border: 1px solid #0d6efd;
  border-radius: 14px;
  background: #0d6efd;
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  line-height: 1;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.24);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.apartments-more__btn:hover {
  transform: translateY(-2px);
  background: #0b5ed7;
  box-shadow: 0 18px 38px rgba(13, 110, 253, 0.32);
}

@media (max-width: 1399.98px) {
  .catalog-toolbar__inner {
    gap: 10px;
  }

  .catalog-save {
    justify-self: flex-start;
  }
}

@media (max-width: 1199.98px) {
  .apartment-card {
    grid-template-columns: 300px minmax(0, 1fr);
  }

  .apartment-card__body {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .apartment-card__aside {
    padding-top: 20px;
    padding-left: 0;
    border-top: 1px solid #edf1f6;
    border-left: 0;
  }
}

@media (max-width: 991.98px) {
  .catalog-search {
    flex-basis: 100%;
    grid-template-columns: auto minmax(0, 1fr) auto;
    min-width: 0;
  }

  .catalog-sort {
    flex-basis: 100%;
    min-height: auto;
  }

  .catalog-search__modes {
    grid-column: 1 / -1;
    justify-content: flex-start;
    padding-left: 28px;
  }

}

@media (max-width: 767.98px) {
  .apartments-section {
    padding-bottom: 70px;
  }

  .catalog-map-modal {
    padding: 0;
  }

  .catalog-map-modal__panel {
    width: 100%;
    height: 100dvh;
    border: 0;
    border-radius: 0;
  }

  .catalog-map-modal__close {
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
  }

  .catalog-map-modal :deep(.catalog-real-map__head) {
    padding: 16px 62px 16px 16px;
  }

  .catalog-toolbar {
    padding: 14px;
    border-radius: 16px;
  }

  .catalog-head {
    padding: 28px 0;
  }

  .apartment-card {
    grid-template-columns: 1fr;
    border-radius: 16px;
  }

  .apartment-card__media,
  .apartment-card__media img {
    min-height: 230px;
  }

  .apartment-card__body {
    padding: 20px;
  }

  .apartment-card__title {
    font-size: 21px;
  }

  .apartment-card__price {
    font-size: 24px;
  }
}

@media (max-width: 575.98px) {
  .catalog-head__title {
    font-size: 27px;
  }

  .catalog-search {
    min-height: auto;
    padding: 11px 12px;
  }

  .catalog-search__modes {
    padding-left: 26px;
  }

  .catalog-sort {
    gap: 7px;
  }

  .catalog-sort strong {
    flex-basis: 100%;
  }

  .catalog-sort__select {
    flex-basis: 100%;
    grid-template-columns: 1fr;
    min-width: 0;
  }

  .catalog-sort__select select {
    min-height: 38px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .catalog-chip {
    min-height: 34px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .apartment-card__tag,
  .apartment-card__verification-report {
    font-size: 12px;
  }

  .apartment-card__media,
  .apartment-card__media img {
    min-height: 210px;
  }
}
</style>
