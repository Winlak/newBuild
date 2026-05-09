<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { Apartment, ApartmentSearchParam, ApartmentUnit } from '~/data/apartments'
import type { ReviewItem } from '~/data/reviews'

interface ReviewRecord extends ReviewItem {
  contact?: string
  status: 'approved' | 'pending'
  createdAt: string
}

interface ContactRequestRecord {
  id: string
  name: string
  phone: string
  email?: string
  message?: string
  time?: string
  source?: string
  createdAt: string
}

interface SubscriptionRecord {
  id: string
  email: string
  source?: string
  createdAt: string
}

const isAuthorized = ref(false)
const isLoading = ref(true)
const errorMessage = ref('')
const activeTab = ref<'apartments' | 'requests' | 'reviews'>('apartments')
const apartments = ref<Apartment[]>([])
const reviews = ref<ReviewRecord[]>([])
const contactRequests = ref<ContactRequestRecord[]>([])
const subscriptions = ref<SubscriptionRecord[]>([])
const editingSlug = ref<string | null>(null)
const tagsInput = ref('')
const featuresInput = ref('')
const imageFileInput = ref<HTMLInputElement | null>(null)
const isImageDragActive = ref(false)
const isUploadingImages = ref(false)

const searchParamOptions: Array<{ id: ApartmentSearchParam, label: string }> = [
  { id: 'renovation', label: 'С ремонтом' },
  { id: 'furniture', label: 'С мебелью' },
  { id: 'installment', label: 'С рассрочкой' },
  { id: 'mortgage_no_dp', label: 'Ипотека без ПВ' },
  { id: 'completed', label: 'Дом сдан' },
  { id: 'studio', label: 'Студии' },
]

const searchParamIds = new Set(searchParamOptions.map(option => option.id))
const defaultVerificationReport = 'Объявление №115 проверено 24.02.2026 10:01'

const loginForm = reactive({
  login: '',
  password: '',
})

const apartmentForm = reactive<Apartment>({
  slug: '',
  title: '',
  complex: '',
  address: '',
  district: '',
  image: '/content/MainIMG.webp',
  images: ['/content/MainIMG.webp'],
  price: 0,
  pricePerMeter: 0,
  mortgagePayment: 0,
  rooms: '1',
  area: 0,
  kitchenArea: 0,
  floor: 1,
  totalFloors: 1,
  finish: '',
  completion: '',
  builder: '',
  metroStation: '',
  metroWalkMinutes: 0,
  metroDistanceMeters: 0,
  verified: false,
  verificationReport: '',
  phone: '',
  phoneHref: '',
  coordinates: {
    lat: 55.0302,
    lng: 82.9204,
  },
  searchParams: [],
  tags: [],
  features: [],
  unitMix: [],
  description: '',
})

const pendingReviews = computed(() => reviews.value.filter(review => review.status === 'pending'))
const approvedReviews = computed(() => reviews.value.filter(review => review.status === 'approved'))
const requestsCount = computed(() => contactRequests.value.length + subscriptions.value.length)
const apartmentImages = computed(() => {
  const images = apartmentForm.images?.length
    ? apartmentForm.images
    : apartmentForm.image
      ? [apartmentForm.image]
      : []

  return [...new Set(images.filter(Boolean))]
})

const createEmptyUnit = (): ApartmentUnit => ({
  rooms: '1',
  label: '1-комнатные',
  areaFrom: 0,
  areaTo: 0,
  priceFrom: 0,
  priceTo: 0,
  mortgageFrom: 0,
  count: 1,
  finish: '',
})

const getMinPositive = (values: number[]) => values.length ? Math.min(...values) : 0

const normalizeSearchParams = (value: unknown): ApartmentSearchParam[] => Array.isArray(value)
  ? [...new Set(value
      .map(String)
      .filter((item): item is ApartmentSearchParam => searchParamIds.has(item as ApartmentSearchParam)))]
  : []

const getApartmentSearchText = (apartment: Apartment) => [
  apartment.title,
  apartment.complex,
  apartment.completion,
  apartment.finish,
  apartment.description,
  ...apartment.tags,
  ...apartment.features,
].join(' ').toLowerCase()

const inferSearchParams = (apartment: Apartment): ApartmentSearchParam[] => {
  const searchText = getApartmentSearchText(apartment)
  const units = apartment.unitMix?.length
    ? apartment.unitMix
    : [{
        rooms: apartment.rooms,
        finish: apartment.finish,
      }]

  return searchParamOptions
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
  ? normalizeSearchParams(apartment.searchParams)
  : inferSearchParams(apartment)

const resetApartmentForm = () => {
  editingSlug.value = null
  Object.assign(apartmentForm, {
    slug: '',
    title: '',
    complex: '',
    address: '',
    district: '',
    image: '/content/MainIMG.webp',
    images: ['/content/MainIMG.webp'],
    price: 0,
    pricePerMeter: 0,
    mortgagePayment: 0,
    rooms: '1',
    area: 0,
    kitchenArea: 0,
    floor: 1,
    totalFloors: 1,
    finish: '',
    completion: '',
    builder: '',
    metroStation: '',
    metroWalkMinutes: 0,
    metroDistanceMeters: 0,
    verified: false,
    verificationReport: '',
    phone: '',
    phoneHref: '',
    coordinates: {
      lat: 55.0302,
      lng: 82.9204,
    },
    searchParams: [],
    tags: [],
    features: [],
    unitMix: [],
    description: '',
  })
  tagsInput.value = ''
  featuresInput.value = ''
}

const loadAdminData = async () => {
  const [apartmentsData, reviewsData, contactRequestsData, subscriptionsData] = await Promise.all([
    $fetch<Apartment[]>('/api/admin/apartments'),
    $fetch<ReviewRecord[]>('/api/admin/reviews'),
    $fetch<ContactRequestRecord[]>('/api/admin/contact-requests'),
    $fetch<SubscriptionRecord[]>('/api/admin/subscriptions'),
  ])

  apartments.value = apartmentsData
  reviews.value = reviewsData
  contactRequests.value = contactRequestsData
  subscriptions.value = subscriptionsData
}

const formatAdminDate = (value: string) => {
  if (!value) {
    return 'Дата не указана'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const getPhoneHref = (phone: string) => `tel:${phone.replace(/\D/g, '')}`

const checkSession = async () => {
  try {
    await $fetch('/api/admin/me')
    isAuthorized.value = true
    await loadAdminData()
  } catch {
    isAuthorized.value = false
  } finally {
    isLoading.value = false
  }
}

const login = async () => {
  errorMessage.value = ''

  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: loginForm,
    })
    isAuthorized.value = true
    await loadAdminData()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось войти'
  }
}

const logout = async () => {
  await $fetch('/api/admin/logout', { method: 'POST' })
  isAuthorized.value = false
  resetApartmentForm()
}

const editApartment = (apartment: Apartment) => {
  editingSlug.value = apartment.slug
  const images = apartment.images?.length
    ? apartment.images
    : [apartment.image].filter(Boolean)

  Object.assign(apartmentForm, {
    ...apartment,
    images,
    image: apartment.image || images[0] || '/content/MainIMG.webp',
    coordinates: { ...apartment.coordinates },
    searchParams: getApartmentSearchParams(apartment),
    tags: [...apartment.tags],
    features: [...apartment.features],
    unitMix: apartment.unitMix?.map(unit => ({ ...unit })) ?? [],
  })
  tagsInput.value = apartment.tags.join(', ')
  featuresInput.value = apartment.features.join(', ')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const addApartmentUnit = () => {
  apartmentForm.unitMix = [...(apartmentForm.unitMix ?? []), createEmptyUnit()]
}

const removeApartmentUnit = (index: number) => {
  apartmentForm.unitMix = (apartmentForm.unitMix ?? []).filter((_, unitIndex) => unitIndex !== index)
}

const setPrimaryImage = (image: string) => {
  const images = [image, ...apartmentImages.value.filter(item => item !== image)]
  apartmentForm.images = images
  apartmentForm.image = image
}

const removeImage = (image: string) => {
  const images = apartmentImages.value.filter(item => item !== image)
  apartmentForm.images = images
  apartmentForm.image = images[0] || '/content/MainIMG.webp'
}

const syncPrimaryImage = () => {
  const image = apartmentForm.image.trim()

  if (!image) {
    apartmentForm.image = apartmentImages.value[0] || '/content/MainIMG.webp'
    return
  }

  apartmentForm.images = [image, ...apartmentImages.value.filter(item => item !== image)]
}

const uploadImages = async (fileList: FileList | File[] | null) => {
  const files = Array.from(fileList ?? []).filter(file => file.type.startsWith('image/'))

  if (!files.length) {
    errorMessage.value = 'Перетащите или выберите изображения'
    return
  }

  errorMessage.value = ''
  isUploadingImages.value = true

  try {
    const body = new FormData()
    files.forEach(file => body.append('files', file))

    const response = await $fetch<{ images: string[] }>('/api/admin/uploads', {
      method: 'POST',
      body,
    })
    const images = [...apartmentImages.value, ...response.images]
      .filter(Boolean)
      .filter((image, index, list) => list.indexOf(image) === index)

    apartmentForm.images = images
    apartmentForm.image = apartmentForm.image && images.includes(apartmentForm.image)
      ? apartmentForm.image
      : images[0] || '/content/MainIMG.webp'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось загрузить изображения'
  } finally {
    isUploadingImages.value = false
    isImageDragActive.value = false

    if (imageFileInput.value) {
      imageFileInput.value.value = ''
    }
  }
}

const handleImageDrop = async (event: DragEvent) => {
  isImageDragActive.value = false
  await uploadImages(event.dataTransfer?.files ?? null)
}

const handleImageInput = async (event: Event) => {
  await uploadImages((event.target as HTMLInputElement).files)
}

const saveApartment = async () => {
  errorMessage.value = ''
  const unitMix = (apartmentForm.unitMix ?? [])
    .map(unit => ({
      rooms: String(unit.rooms ?? '').trim(),
      label: String(unit.label ?? '').trim(),
      areaFrom: Number(unit.areaFrom ?? 0),
      areaTo: Number(unit.areaTo ?? 0),
      priceFrom: Number(unit.priceFrom ?? 0),
      priceTo: Number(unit.priceTo ?? 0),
      mortgageFrom: Number(unit.mortgageFrom ?? 0),
      count: Number(unit.count ?? 0),
      finish: String(unit.finish ?? '').trim(),
    }))
    .filter(unit => unit.rooms && unit.label)
  const prices = unitMix.flatMap(unit => [unit.priceFrom, unit.priceTo]).filter(value => value > 0)
  const areas = unitMix.flatMap(unit => [unit.areaFrom, unit.areaTo]).filter(value => value > 0)
  const mortgages = unitMix.map(unit => unit.mortgageFrom).filter(value => value > 0)
  const primaryUnit = unitMix[0]
  const images = apartmentImages.value.length ? apartmentImages.value : [apartmentForm.image || '/content/MainIMG.webp']
  const complexName = apartmentForm.complex || apartmentForm.title

  const payload: Apartment = {
    ...apartmentForm,
    title: apartmentForm.title || complexName,
    complex: complexName,
    image: images[0],
    images,
    price: Number(apartmentForm.price) || getMinPositive(prices),
    pricePerMeter: Number(apartmentForm.pricePerMeter),
    mortgagePayment: Number(apartmentForm.mortgagePayment) || getMinPositive(mortgages),
    rooms: primaryUnit?.rooms || apartmentForm.rooms,
    area: Number(apartmentForm.area) || getMinPositive(areas),
    kitchenArea: Number(apartmentForm.kitchenArea),
    floor: Number(apartmentForm.floor),
    totalFloors: Number(apartmentForm.totalFloors),
    metroWalkMinutes: Number(apartmentForm.metroWalkMinutes),
    metroDistanceMeters: Number(apartmentForm.metroDistanceMeters),
    coordinates: {
      lat: Number(apartmentForm.coordinates.lat),
      lng: Number(apartmentForm.coordinates.lng),
    },
    searchParams: normalizeSearchParams(apartmentForm.searchParams),
    tags: tagsInput.value.split(',').map(item => item.trim()).filter(Boolean),
    features: featuresInput.value.split(',').map(item => item.trim()).filter(Boolean),
    unitMix,
  }

  try {
    if (editingSlug.value) {
      await $fetch(`/api/admin/apartments/${editingSlug.value}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      await $fetch('/api/admin/apartments', {
        method: 'POST',
        body: payload,
      })
    }

    resetApartmentForm()
    await loadAdminData()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось сохранить ЖК'
  }
}

const toggleVerified = async (apartment: Apartment) => {
  await $fetch(`/api/admin/apartments/${apartment.slug}`, {
    method: 'PUT',
    body: {
      ...apartment,
      verified: !apartment.verified,
    },
  })
  await loadAdminData()
}

const deleteApartment = async (apartment: Apartment) => {
  if (!confirm(`Удалить ${apartment.complex || apartment.title}?`)) {
    return
  }

  await $fetch(`/api/admin/apartments/${apartment.slug}`, { method: 'DELETE' })
  await loadAdminData()

  if (editingSlug.value === apartment.slug) {
    resetApartmentForm()
  }
}

const approveReview = async (review: ReviewRecord) => {
  await $fetch(`/api/admin/reviews/${review.id}`, {
    method: 'PATCH',
    body: { status: 'approved' },
  })
  await loadAdminData()
}

const deleteReview = async (review: ReviewRecord) => {
  if (!confirm(`Удалить отзыв ${review.name}?`)) {
    return
  }

  await $fetch(`/api/admin/reviews/${review.id}`, { method: 'DELETE' })
  await loadAdminData()
}

const deleteContactRequest = async (request: ContactRequestRecord) => {
  if (!confirm(`Удалить заявку ${request.name}?`)) {
    return
  }

  await $fetch(`/api/admin/contact-requests/${request.id}`, { method: 'DELETE' })
  await loadAdminData()
}

const deleteSubscription = async (subscription: SubscriptionRecord) => {
  if (!confirm(`Удалить подписку ${subscription.email}?`)) {
    return
  }

  await $fetch(`/api/admin/subscriptions/${subscription.id}`, { method: 'DELETE' })
  await loadAdminData()
}

onMounted(checkSession)

useHead({
  title: 'Админка | Новостройки НСК',
})

useSeoMeta({
  robots: 'noindex, nofollow',
})
</script>

<template>
  <main class="admin-page">
    <section
      v-if="isLoading"
      class="admin-login"
    >
      <p>Проверяем доступ...</p>
    </section>

    <section
      v-else-if="!isAuthorized"
      class="admin-login"
    >
      <form @submit.prevent="login">
        <h1>Вход в админку</h1>
        <p>Логин и пароль берутся из `.env`: `ADMIN_LOGIN` и `ADMIN_PASSWORD`.</p>

        <label>
          <span>Логин</span>
          <input
            v-model.trim="loginForm.login"
            type="text"
            required
          >
        </label>

        <label>
          <span>Пароль</span>
          <input
            v-model="loginForm.password"
            type="password"
            required
          >
        </label>

        <button type="submit">
          Войти
        </button>

        <p
          v-if="errorMessage"
          class="admin-error"
        >
          {{ errorMessage }}
        </p>
      </form>
    </section>

    <section
      v-else
      class="admin-shell"
    >
      <header class="admin-head">
        <div>
          <p>Панель управления</p>
          <h1>Админка</h1>
        </div>

        <button
          type="button"
          @click="logout"
        >
          Выйти
        </button>
      </header>

      <nav class="admin-tabs">
        <button
          type="button"
          :class="{ 'admin-tabs__button--active': activeTab === 'apartments' }"
          @click="activeTab = 'apartments'"
        >
          ЖК
        </button>

        <button
          type="button"
          :class="{ 'admin-tabs__button--active': activeTab === 'requests' }"
          @click="activeTab = 'requests'"
        >
          Заявки
          <span v-if="requestsCount">{{ requestsCount }}</span>
        </button>

        <button
          type="button"
          :class="{ 'admin-tabs__button--active': activeTab === 'reviews' }"
          @click="activeTab = 'reviews'"
        >
          Отзывы
          <span v-if="pendingReviews.length">{{ pendingReviews.length }}</span>
        </button>
      </nav>

      <p
        v-if="errorMessage"
        class="admin-error"
      >
        {{ errorMessage }}
      </p>

      <div
        v-if="activeTab === 'apartments'"
        class="admin-grid"
      >
        <form
          class="admin-card admin-form"
          @submit.prevent="saveApartment"
        >
          <div class="admin-card__head">
            <h2>{{ editingSlug ? 'Редактировать ЖК' : 'Добавить ЖК' }}</h2>

            <button
              type="button"
              @click="resetApartmentForm"
            >
              Очистить
            </button>
          </div>

          <label class="admin-form__wide">
            <span>Slug</span>
            <input v-model.trim="apartmentForm.slug" type="text" placeholder="Заполнится автоматически">
          </label>

          <label class="admin-form__wide">
            <span>Название ЖК</span>
            <input v-model.trim="apartmentForm.complex" type="text" required>
          </label>

          <label class="admin-form__wide">
            <span>Адрес</span>
            <input v-model.trim="apartmentForm.address" type="text" required>
          </label>

          <label>
            <span>Район</span>
            <input v-model.trim="apartmentForm.district" type="text">
          </label>

          <label>
            <span>Метро</span>
            <input v-model.trim="apartmentForm.metroStation" type="text">
          </label>

          <label>
            <span>До метро, м</span>
            <input v-model.number="apartmentForm.metroDistanceMeters" type="number" min="0">
          </label>

          <label>
            <span>До метро, мин</span>
            <input v-model.number="apartmentForm.metroWalkMinutes" type="number" min="0">
          </label>

          <label>
            <span>Цена от, ₽</span>
            <input v-model.number="apartmentForm.price" type="number" min="0">
          </label>

          <label>
            <span>Цена за м²</span>
            <input v-model.number="apartmentForm.pricePerMeter" type="number" min="0">
          </label>

          <label>
            <span>Ипотека/мес.</span>
            <input v-model.number="apartmentForm.mortgagePayment" type="number" min="0">
          </label>

          <label>
            <span>Площадь от, м²</span>
            <input v-model.number="apartmentForm.area" type="number" min="0" step="0.1">
          </label>

          <label>
            <span>Этажность</span>
            <input v-model.number="apartmentForm.totalFloors" type="number" min="1">
          </label>

          <label>
            <span>Отделка</span>
            <input v-model.trim="apartmentForm.finish" type="text">
          </label>

          <label>
            <span>Срок сдачи</span>
            <input v-model.trim="apartmentForm.completion" type="text">
          </label>

          <label>
            <span>Застройщик</span>
            <input v-model.trim="apartmentForm.builder" type="text">
          </label>

          <label>
            <span>Телефон</span>
            <input v-model.trim="apartmentForm.phone" type="text">
          </label>

          <label>
            <span>Широта</span>
            <input v-model.number="apartmentForm.coordinates.lat" type="number" step="0.0001">
          </label>

          <label>
            <span>Долгота</span>
            <input v-model.number="apartmentForm.coordinates.lng" type="number" step="0.0001">
          </label>

          <div class="admin-form__wide admin-media">
            <div class="admin-section-head">
              <div>
                <h3>Галерея ЖК</h3>
                <p>Перетащите несколько изображений или выберите файлы. Первое изображение используется в карточках.</p>
              </div>
              <span>{{ apartmentImages.length }} фото</span>
            </div>

            <div
              class="admin-dropzone"
              :class="{ 'admin-dropzone--active': isImageDragActive }"
              @dragenter.prevent="isImageDragActive = true"
              @dragover.prevent="isImageDragActive = true"
              @dragleave.prevent="isImageDragActive = false"
              @drop.prevent="handleImageDrop"
            >
              <input
                ref="imageFileInput"
                type="file"
                accept="image/*"
                multiple
                @change="handleImageInput"
              >
              <i class="bi bi-cloud-arrow-up" aria-hidden="true"></i>
              <strong>{{ isUploadingImages ? 'Загружаем...' : 'Перетащите изображения сюда' }}</strong>
              <span>JPG, PNG, WebP, GIF или AVIF</span>
              <button
                type="button"
                @click="imageFileInput?.click()"
              >
                Выбрать файлы
              </button>
            </div>

            <label class="admin-form__wide">
              <span>Главное изображение URL</span>
              <input
                v-model.trim="apartmentForm.image"
                type="text"
                @change="syncPrimaryImage"
              >
            </label>

            <div
              v-if="apartmentImages.length"
              class="admin-gallery"
            >
              <article
                v-for="image in apartmentImages"
                :key="image"
                class="admin-gallery__item"
                :class="{ 'admin-gallery__item--primary': image === apartmentForm.image }"
              >
                <img :src="image" :alt="apartmentForm.complex || 'Фото ЖК'">
                <div>
                  <button type="button" @click="setPrimaryImage(image)">
                    Главное
                  </button>
                  <button type="button" class="admin-danger" @click="removeImage(image)">
                    Удалить
                  </button>
                </div>
              </article>
            </div>
          </div>

          <div class="admin-form__wide admin-units">
            <div class="admin-section-head">
              <div>
                <h3>Квартиры в ЖК</h3>
                <p>Добавьте типы планировок: студии, 1-комнатные, 2-комнатные и другие варианты.</p>
              </div>

              <button
                type="button"
                @click="addApartmentUnit"
              >
                Добавить тип
              </button>
            </div>

            <article
              v-for="(unit, index) in apartmentForm.unitMix"
              :key="index"
              class="admin-unit"
            >
              <label>
                <span>Тип</span>
                <input v-model.trim="unit.rooms" type="text" placeholder="Студия / 1 / 2">
              </label>

              <label>
                <span>Название</span>
                <input v-model.trim="unit.label" type="text" placeholder="1-комнатные">
              </label>

              <label>
                <span>Площадь от</span>
                <input v-model.number="unit.areaFrom" type="number" min="0" step="0.1">
              </label>

              <label>
                <span>Площадь до</span>
                <input v-model.number="unit.areaTo" type="number" min="0" step="0.1">
              </label>

              <label>
                <span>Цена от</span>
                <input v-model.number="unit.priceFrom" type="number" min="0">
              </label>

              <label>
                <span>Цена до</span>
                <input v-model.number="unit.priceTo" type="number" min="0">
              </label>

              <label>
                <span>Ипотека от</span>
                <input v-model.number="unit.mortgageFrom" type="number" min="0">
              </label>

              <label>
                <span>Количество</span>
                <input v-model.number="unit.count" type="number" min="0">
              </label>

              <label>
                <span>Отделка</span>
                <input v-model.trim="unit.finish" type="text">
              </label>

              <button
                type="button"
                class="admin-unit__remove admin-danger"
                @click="removeApartmentUnit(index)"
              >
                Удалить тип
              </button>
            </article>

            <p
              v-if="!apartmentForm.unitMix.length"
              class="admin-empty"
            >
              Типы квартир пока не добавлены.
            </p>
          </div>

          <label class="admin-form__wide">
            <span>Теги через запятую</span>
            <input v-model.trim="tagsInput" type="text">
          </label>

          <label class="admin-form__wide">
            <span>Особенности через запятую</span>
            <input v-model.trim="featuresInput" type="text">
          </label>

          <fieldset class="admin-form__wide admin-search-params">
            <legend>Параметры поиска</legend>

            <label
              v-for="option in searchParamOptions"
              :key="option.id"
              class="admin-check"
            >
              <input
                v-model="apartmentForm.searchParams"
                type="checkbox"
                :value="option.id"
              >
              <span>{{ option.label }}</span>
            </label>
          </fieldset>

          <label class="admin-form__wide">
            <span>Описание</span>
            <textarea v-model.trim="apartmentForm.description" rows="4"></textarea>
          </label>

          <label class="admin-check">
            <input v-model="apartmentForm.verified" type="checkbox">
            <span>Проверенный ЖК</span>
          </label>

          <label class="admin-form__wide">
            <span>Отчет о проверке</span>
            <input
              v-model.trim="apartmentForm.verificationReport"
              type="text"
              :placeholder="defaultVerificationReport"
            >
          </label>

          <button
            type="submit"
            class="admin-submit"
          >
            {{ editingSlug ? 'Сохранить изменения' : 'Добавить ЖК' }}
          </button>
        </form>

        <div class="admin-card admin-list">
          <div class="admin-card__head">
            <h2>ЖК</h2>
            <span>{{ apartments.length }} объектов</span>
          </div>

          <article
            v-for="apartment in apartments"
            :key="apartment.slug"
            class="admin-row"
          >
            <img
              :src="apartment.image"
              :alt="apartment.title"
            >

            <div>
              <strong>{{ apartment.complex || apartment.title }}</strong>
              <span>{{ apartment.district }} · {{ apartment.unitMix?.length || 0 }} типов квартир</span>
              <small>{{ apartment.verified ? 'Проверен' : 'Не проверен' }}</small>
            </div>

            <div class="admin-row__actions">
              <button type="button" @click="toggleVerified(apartment)">
                {{ apartment.verified ? 'Снять проверку' : 'Проверить' }}
              </button>
              <button type="button" @click="editApartment(apartment)">
                Изменить
              </button>
              <button type="button" class="admin-danger" @click="deleteApartment(apartment)">
                Удалить
              </button>
            </div>
          </article>
        </div>
      </div>

      <div
        v-else-if="activeTab === 'requests'"
        class="admin-card admin-list"
      >
        <div class="admin-card__head">
          <h2>Заявки</h2>
          <span>{{ contactRequests.length }} заявок · {{ subscriptions.length }} подписок</span>
        </div>

        <div
          v-if="!contactRequests.length && !subscriptions.length"
          class="admin-empty"
        >
          Заявок пока нет.
        </div>

        <article
          v-for="request in contactRequests"
          :key="request.id"
          class="admin-review admin-request"
        >
          <div>
            <strong>{{ request.name }}</strong>
            <span>{{ request.phone }}</span>
            <p v-if="request.message">{{ request.message }}</p>
            <small>
              {{ formatAdminDate(request.createdAt) }}
              <template v-if="request.email"> · {{ request.email }}</template>
              <template v-if="request.time"> · {{ request.time }}</template>
              <template v-if="request.source"> · {{ request.source }}</template>
            </small>
          </div>

          <div class="admin-row__actions">
            <a
              :href="getPhoneHref(request.phone)"
              class="admin-action-link"
            >
              Позвонить
            </a>

            <button
              type="button"
              class="admin-danger"
              @click="deleteContactRequest(request)"
            >
              Удалить
            </button>
          </div>
        </article>

        <div
          v-if="subscriptions.length"
          class="admin-card__subhead"
        >
          <h3>Подписки</h3>
        </div>

        <article
          v-for="subscription in subscriptions"
          :key="subscription.id"
          class="admin-review admin-request"
        >
          <div>
            <strong>{{ subscription.email }}</strong>
            <small>
              {{ formatAdminDate(subscription.createdAt) }}
              <template v-if="subscription.source"> · {{ subscription.source }}</template>
            </small>
          </div>

          <div class="admin-row__actions">
            <a
              :href="`mailto:${subscription.email}`"
              class="admin-action-link"
            >
              Написать
            </a>

            <button
              type="button"
              class="admin-danger"
              @click="deleteSubscription(subscription)"
            >
              Удалить
            </button>
          </div>
        </article>
      </div>

      <div
        v-else
        class="admin-card admin-list"
      >
        <div class="admin-card__head">
          <h2>Отзывы</h2>
          <span>{{ pendingReviews.length }} на модерации · {{ approvedReviews.length }} опубликовано</span>
        </div>

        <article
          v-for="review in reviews"
          :key="review.id"
          class="admin-review"
        >
          <div>
            <strong>{{ review.name }}</strong>
            <span>{{ review.subtitle }}</span>
            <p>{{ review.text }}</p>
            <small>
              {{ review.status === 'approved' ? 'Опубликован' : 'На модерации' }}
              <template v-if="review.contact"> · {{ review.contact }}</template>
            </small>
          </div>

          <div class="admin-row__actions">
            <button
              v-if="review.status !== 'approved'"
              type="button"
              @click="approveReview(review)"
            >
              Одобрить
            </button>

            <button
              type="button"
              class="admin-danger"
              @click="deleteReview(review)"
            >
              Удалить
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 48px 0 96px;
  background: linear-gradient(180deg, #f7faff 0%, #fff 360px), #fff;
}

.admin-login,
.admin-shell {
  width: min(calc(100% - 32px), 1180px);
  margin: 0 auto;
}

.admin-login {
  display: grid;
  min-height: 60vh;
  place-items: center;
}

.admin-login form,
.admin-card {
  border: 1px solid #e3ebf6;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 18px 48px rgba(14, 30, 62, 0.08);
}

.admin-login form {
  display: grid;
  gap: 16px;
  width: min(100%, 440px);
  padding: 28px;
}

.admin-login h1,
.admin-head h1,
.admin-card h2 {
  margin: 0;
  color: #07123d;
  font-weight: 900;
  line-height: 1.15;
}

.admin-login p,
.admin-head p {
  margin: 0;
  color: #647082;
  font-weight: 700;
  line-height: 1.45;
}

.admin-login label,
.admin-form label {
  display: grid;
  gap: 7px;
}

.admin-login span,
.admin-form span {
  color: #182033;
  font-size: 13px;
  font-weight: 900;
}

.admin-login input,
.admin-form input,
.admin-form textarea {
  min-width: 0;
  border: 1px solid #dbe6f4;
  border-radius: 10px;
  color: #182033;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  outline: 0;
}

.admin-login input,
.admin-form input {
  min-height: 42px;
  padding: 0 12px;
}

.admin-form textarea {
  padding: 12px;
}

.admin-login button,
.admin-submit,
.admin-head button,
.admin-tabs button,
.admin-card__head button,
.admin-row__actions button,
.admin-row__actions a,
.admin-section-head button,
.admin-dropzone button,
.admin-gallery button,
.admin-unit__remove {
  border: 0;
  border-radius: 10px;
  font-weight: 900;
  line-height: 1;
}

.admin-login button,
.admin-submit {
  min-height: 46px;
  background: #0d6efd;
  color: #fff;
}

.admin-error {
  margin: 0;
  color: #d82244;
  font-weight: 800;
}

.admin-head {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 18px;
}

.admin-head h1 {
  font-size: 44px;
}

.admin-head button,
.admin-card__head button {
  min-height: 40px;
  padding: 0 14px;
  background: #eef4ff;
  color: #0d6efd;
}

.admin-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

.admin-tabs button {
  min-height: 44px;
  padding: 0 16px;
  background: #eef4ff;
  color: #0d6efd;
}

.admin-tabs__button--active {
  background: #0d6efd !important;
  color: #fff !important;
}

.admin-tabs span {
  margin-left: 6px;
}

.admin-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 0.8fr);
  gap: 18px;
  align-items: start;
}

.admin-card {
  padding: 20px;
}

.admin-card__head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  margin-bottom: 16px;
}

.admin-card__head span {
  color: #647082;
  font-size: 14px;
  font-weight: 900;
}

.admin-card__subhead {
  margin-top: 12px;
}

.admin-card__subhead h3 {
  margin: 0;
  color: #07123d;
  font-size: 18px;
  font-weight: 900;
}

.admin-section-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.admin-section-head h3 {
  margin: 0 0 5px;
  color: #07123d;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.2;
}

.admin-section-head p {
  max-width: 620px;
  margin: 0;
  color: #647082;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
}

.admin-section-head > span {
  flex: 0 0 auto;
  color: #647082;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.3;
}

.admin-section-head button,
.admin-dropzone button,
.admin-gallery button,
.admin-unit__remove {
  min-height: 36px;
  padding: 0 12px;
  background: #eef4ff;
  color: #0d6efd;
  font-size: 12px;
}

.admin-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.admin-form .admin-card__head,
.admin-form__wide,
.admin-check,
.admin-submit {
  grid-column: 1 / -1;
}

.admin-check {
  display: flex !important;
  grid-template-columns: none !important;
  align-items: center;
  gap: 10px !important;
}

.admin-check input {
  min-height: auto;
  width: 18px;
  height: 18px;
}

.admin-search-params {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 14px;
  margin: 0;
  padding: 14px;
  border: 1px solid #edf1f6;
  border-radius: 14px;
}

.admin-search-params legend {
  padding: 0 6px;
  color: #182033;
  font-size: 13px;
  font-weight: 900;
}

.admin-search-params .admin-check {
  grid-column: auto;
}

.admin-media,
.admin-units {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid #edf1f6;
  border-radius: 14px;
  background: #f8fbff;
}

.admin-dropzone {
  position: relative;
  display: grid;
  gap: 8px;
  min-height: 170px;
  place-items: center;
  padding: 22px;
  border: 2px dashed #c9d8ec;
  border-radius: 16px;
  background: #fff;
  text-align: center;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.admin-dropzone--active {
  border-color: #0d6efd;
  background: #eef5ff;
  transform: translateY(-1px);
}

.admin-dropzone input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.admin-dropzone i {
  color: #0d6efd;
  font-size: 34px;
  line-height: 1;
}

.admin-dropzone strong {
  color: #07123d;
  font-size: 16px;
  font-weight: 900;
}

.admin-dropzone span {
  color: #647082;
  font-size: 13px;
  font-weight: 700;
}

.admin-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 10px;
}

.admin-gallery__item {
  overflow: hidden;
  border: 1px solid #dfe8f4;
  border-radius: 14px;
  background: #fff;
}

.admin-gallery__item--primary {
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.14);
}

.admin-gallery__item img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: #eef3f8;
}

.admin-gallery__item div {
  display: flex;
  gap: 6px;
  padding: 8px;
}

.admin-gallery__item button {
  flex: 1;
  min-width: 0;
}

.admin-gallery__item .admin-danger,
.admin-unit__remove.admin-danger {
  background: #fff1f3;
  color: #d82244;
}

.admin-unit {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  padding: 12px;
  border: 1px solid #dfe8f4;
  border-radius: 14px;
  background: #fff;
}

.admin-unit__remove {
  align-self: end;
}

.admin-empty {
  margin: 0;
  padding: 12px;
  border: 1px dashed #c9d8ec;
  border-radius: 12px;
  color: #647082;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
}

.admin-list {
  display: grid;
  gap: 12px;
}

.admin-row,
.admin-review {
  display: grid;
  gap: 14px;
  align-items: center;
  padding: 14px;
  border: 1px solid #edf1f6;
  border-radius: 14px;
  background: #fff;
}

.admin-row {
  grid-template-columns: 86px minmax(0, 1fr) auto;
}

.admin-row img {
  width: 86px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
  background: #eef3f8;
}

.admin-row strong,
.admin-review strong {
  display: block;
  color: #07123d;
  font-size: 15px;
  font-weight: 900;
}

.admin-row span,
.admin-review span,
.admin-row small,
.admin-review small {
  display: block;
  color: #647082;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

.admin-row__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.admin-row__actions button,
.admin-row__actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 10px;
  background: #eef4ff;
  color: #0d6efd;
  font-size: 12px;
  text-decoration: none;
}

.admin-row__actions .admin-danger {
  background: #fff1f3;
  color: #d82244;
}

.admin-review {
  grid-template-columns: minmax(0, 1fr) auto;
}

.admin-review p {
  margin: 8px 0;
  color: #465364;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
}

@media (max-width: 1199.98px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767.98px) {
  .admin-page {
    padding-top: 28px;
  }

  .admin-head,
  .admin-card__head,
  .admin-row,
  .admin-review {
    align-items: flex-start;
    grid-template-columns: 1fr;
  }

  .admin-head {
    flex-direction: column;
  }

  .admin-form,
  .admin-unit,
  .admin-search-params {
    grid-template-columns: 1fr;
  }

  .admin-section-head {
    flex-direction: column;
  }

  .admin-row__actions {
    justify-content: flex-start;
  }
}
</style>
