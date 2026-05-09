<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { ReviewItem } from '~/data/reviews'

interface PendingReview {
  id: string
  name: string
  subtitle: string
  text: string
  rating: number
  contact: string
  status: 'pending'
  createdAt: string
}

const isModalOpen = ref(false)
const isSubmitted = ref(false)
const pendingReviews = ref<PendingReview[]>([])
const failedAvatars = ref<Record<string, boolean>>({})
const isSubmitting = ref(false)
const submitError = ref('')
const { data: approvedReviewsData, refresh: refreshApprovedReviews } = await useFetch<ReviewItem[]>('/api/reviews', {
  default: () => [],
})

const form = reactive({
  name: '',
  subtitle: '',
  text: '',
  rating: 5,
  contact: '',
})

const approvedReviews = computed(() => approvedReviewsData.value ?? [])
const reviewsPageUrl = getAbsoluteUrl('/reviews')
const averageRating = computed(() => {
  const total = approvedReviews.value.reduce((sum, review) => sum + review.rating, 0)

  return approvedReviews.value.length ? (total / approvedReviews.value.length).toFixed(1) : '5.0'
})

const resetForm = () => {
  form.name = ''
  form.subtitle = ''
  form.text = ''
  form.rating = 5
  form.contact = ''
}

const openModal = () => {
  isSubmitted.value = false
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  isSubmitted.value = false
  resetForm()
}

const submitReview = async () => {
  submitError.value = ''
  isSubmitting.value = true

  try {
    const response = await $fetch<{ review: PendingReview }>('/api/reviews', {
      method: 'POST',
      body: {
        name: form.name,
        subtitle: form.subtitle,
        text: form.text,
        rating: form.rating,
        contact: form.contact,
      },
    })

    pendingReviews.value = [response.review, ...pendingReviews.value]
    resetForm()
    isSubmitted.value = true
    await refreshApprovedReviews()
  } catch (error) {
    submitError.value = error && typeof error === 'object' && 'statusMessage' in error
      ? String(error.statusMessage)
      : 'Не удалось отправить отзыв. Проверьте поля и попробуйте снова.'
  } finally {
    isSubmitting.value = false
  }
}

const onAvatarError = (id: string) => {
  failedAvatars.value[id] = true
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})

usePageSeo({
  title: 'Отзывы покупателей квартир',
  description: 'Отзывы клиентов Новостройки НСК о подборе квартир в новостройках Новосибирска, помощи с ипотекой, проверке документов и сопровождении сделки.',
  path: '/reviews',
  keywords: [
    'отзывы Новостройки НСК',
    'отзывы подбор квартир Новосибирск',
    'отзывы покупка новостройки Новосибирск',
  ],
})

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'ReviewPage',
  name: 'Отзывы клиентов Новостройки НСК',
  url: reviewsPageUrl,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: averageRating.value,
    reviewCount: approvedReviews.value.length,
    bestRating: 5,
    worstRating: 1,
  },
  review: approvedReviews.value.slice(0, 10).map(review => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.text,
  })),
})

useBreadcrumbJsonLd([
  { name: 'Главная', path: '/' },
  { name: 'Отзывы', path: '/reviews' },
])
</script>

<template>
  <main class="reviews-page">
    <section class="reviews-hero">
      <div class="container reviews-hero__inner">
        <div class="reviews-hero__content">
          <p class="reviews-hero__eyebrow">
            Клиентский опыт
          </p>

          <h1>Отзывы покупателей квартир</h1>

          <p>
            Собрали истории клиентов, которым помогли подобрать квартиру, проверить документы и пройти сделку.
          </p>
        </div>

        <div class="reviews-hero__aside">
          <strong>{{ averageRating }}</strong>
          <span>средняя оценка</span>
          <div aria-label="Средняя оценка 5 из 5">
            <i
              v-for="star in 5"
              :key="star"
              class="bi bi-star-fill"
              aria-hidden="true"
            ></i>
          </div>
        </div>
      </div>
    </section>

    <section class="container reviews-main">
      <div class="reviews-main__head">
        <div>
          <h2>Все отзывы</h2>
          <p>{{ approvedReviews.length }} опубликованных отзывов</p>
        </div>

        <button
          type="button"
          class="reviews-main__button"
          @click="openModal"
        >
          <i class="bi bi-pencil-square" aria-hidden="true"></i>
          Оставить отзыв
        </button>
      </div>

      <div
        v-if="pendingReviews.length"
        class="reviews-pending"
      >
        <i class="bi bi-hourglass-split" aria-hidden="true"></i>
        <div>
          <strong>{{ pendingReviews.length }} отзыв ожидает модерации</strong>
          <span>После проверки администратором он появится в общем списке.</span>
        </div>
      </div>

      <div class="reviews-grid">
        <article
          v-for="review in approvedReviews"
          :key="review.id"
          class="review-card"
        >
          <div class="review-card__avatar">
            <img
              v-if="review.avatar && !failedAvatars[review.id]"
              :src="review.avatar"
              :alt="review.name"
              loading="lazy"
              @error="onAvatarError(review.id)"
            >

            <svg
              v-else
              class="review-card__avatar-placeholder"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="32" fill="#EEF3FB" />
              <circle cx="32" cy="24" r="11" fill="#B8C3D6" />
              <path
                d="M14 54c2.6-11 9.1-17 18-17s15.4 6 18 17"
                fill="#B8C3D6"
              />
            </svg>
          </div>

          <div class="review-card__content">
            <div class="review-card__top">
              <div>
                <h3>{{ review.name }}</h3>
                <p>{{ review.subtitle }}</p>
              </div>

              <div
                class="review-card__rating"
                :aria-label="`Оценка ${review.rating} из 5`"
              >
                <i
                  v-for="star in review.rating"
                  :key="star"
                  class="bi bi-star-fill"
                  aria-hidden="true"
                ></i>
              </div>
            </div>

            <p class="review-card__text">
              {{ review.text }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        @mousedown.self="closeModal"
      >
        <div class="review-modal__panel">
          <button
            type="button"
            class="review-modal__close"
            aria-label="Закрыть форму отзыва"
            @click="closeModal"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>

          <div
            v-if="isSubmitted"
            class="review-modal__success"
          >
            <i class="bi bi-check2-circle" aria-hidden="true"></i>
            <h2 id="review-modal-title">Отзыв отправлен на модерацию</h2>
            <p>Администратор проверит текст, после одобрения отзыв появится на странице.</p>

            <button
              type="button"
              @click="closeModal"
            >
              Понятно
            </button>
          </div>

          <form
            v-else
            class="review-form"
            @submit.prevent="submitReview"
          >
            <div class="review-form__head">
              <h2 id="review-modal-title">Оставить отзыв</h2>
              <p>Отзыв будет опубликован после модерации администратором.</p>
            </div>

            <label>
              <span>Имя</span>
              <input
                v-model.trim="form.name"
                type="text"
                placeholder="Например, Анна П."
                required
                minlength="2"
              >
            </label>

            <label>
              <span>Что купили или какую задачу решили</span>
              <input
                v-model.trim="form.subtitle"
                type="text"
                placeholder="Купила 2-комнатную квартиру"
                required
                minlength="4"
              >
            </label>

            <div class="review-form__rating">
              <span>Оценка</span>

              <div>
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  :class="{ 'review-form__star--active': star <= form.rating }"
                  :aria-label="`${star} из 5`"
                  @click="form.rating = star"
                >
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <label>
              <span>Отзыв</span>
              <textarea
                v-model.trim="form.text"
                placeholder="Расскажите, как прошел подбор квартиры и сделка"
                required
                minlength="4"
                rows="5"
              ></textarea>
            </label>

            <label>
              <span>Контакт для связи</span>
              <input
                v-model.trim="form.contact"
                type="text"
                placeholder="Телефон или email"
                required
              >
            </label>

            <button
              type="submit"
              class="review-form__submit"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Отправляем...' : 'Отправить на модерацию' }}
            </button>

            <p
              v-if="submitError"
              class="review-form__error"
            >
              {{ submitError }}
            </p>
          </form>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.reviews-page {
  min-height: 100vh;
  padding-bottom: 96px;
  background:
    linear-gradient(180deg, #f7faff 0%, #fff 360px),
    #fff;
}

.reviews-hero {
  padding: 64px 0 34px;
}

.reviews-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 32px;
  align-items: stretch;
}

.reviews-hero__content {
  min-width: 0;
}

.reviews-hero__eyebrow {
  margin: 0 0 14px;
  color: #0d6efd;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.reviews-hero h1 {
  max-width: 850px;
  margin: 0 0 18px;
  color: #07123d;
  font-size: clamp(38px, 4vw, 62px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.035em;
}

.reviews-hero__content > p:last-child {
  max-width: 720px;
  margin: 0;
  color: #647082;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.55;
}

.reviews-hero__aside {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 28px;
  border: 1px solid #e3ebf6;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 18px 46px rgba(14, 30, 62, 0.08);
}

.reviews-hero__aside strong {
  color: #07123d;
  font-size: 54px;
  font-weight: 900;
  line-height: 1;
}

.reviews-hero__aside span {
  margin: 8px 0 14px;
  color: #647082;
  font-size: 14px;
  font-weight: 900;
}

.reviews-hero__aside div,
.review-card__rating {
  display: inline-flex;
  gap: 7px;
  color: #ffa800;
}

.reviews-main {
  display: grid;
  gap: 22px;
}

.reviews-main__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.reviews-main__head h2 {
  margin: 0 0 6px;
  color: #07123d;
  font-size: 34px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.reviews-main__head p {
  margin: 0;
  color: #647082;
  font-size: 15px;
  font-weight: 700;
}

.reviews-main__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 14px 20px;
  border: 0;
  border-radius: 12px;
  background: #0d6efd;
  color: #fff;
  font-size: 15px;
  font-weight: 900;
  line-height: 1;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.24);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.reviews-main__button:hover {
  transform: translateY(-2px);
  background: #0b5ed7;
}

.reviews-pending {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #dbe8fb;
  border-radius: 16px;
  background: #f2f7ff;
  color: #0d5bd7;
}

.reviews-pending i {
  flex: 0 0 auto;
  margin-top: 2px;
  font-size: 20px;
}

.reviews-pending strong,
.reviews-pending span {
  display: block;
  line-height: 1.4;
}

.reviews-pending strong {
  color: #07123d;
  font-size: 15px;
  font-weight: 900;
}

.reviews-pending span {
  color: #647082;
  font-size: 14px;
  font-weight: 700;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.review-card {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 22px;
  min-width: 0;
  padding: 24px;
  border: 1px solid #e7edf5;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 16px 42px rgba(14, 30, 62, 0.07);
}

.review-card__avatar {
  width: 76px;
  height: 76px;
  overflow: hidden;
  border-radius: 50%;
  background: #eef3fb;
}

.review-card__avatar img,
.review-card__avatar-placeholder {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-card__content {
  min-width: 0;
}

.review-card__top {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.review-card h3 {
  margin: 0 0 6px;
  color: #07123d;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.15;
}

.review-card__top p {
  margin: 0;
  color: #7b8492;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.35;
}

.review-card__text {
  margin: 0;
  color: #647082;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.58;
}

.review-modal {
  position: fixed;
  inset: 0;
  z-index: 3200;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(7, 18, 61, 0.52);
}

.review-modal__panel {
  position: relative;
  width: min(100%, 640px);
  max-height: min(760px, calc(100vh - 40px));
  overflow: auto;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(7, 18, 61, 0.28);
}

.review-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 12px;
  background: #eef4ff;
  color: #0d6efd;
}

.review-form,
.review-modal__success {
  padding: 34px;
}

.review-form {
  display: grid;
  gap: 16px;
}

.review-form__head {
  padding-right: 48px;
}

.review-form__head h2,
.review-modal__success h2 {
  margin: 0 0 8px;
  color: #07123d;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.review-form__head p,
.review-modal__success p {
  margin: 0;
  color: #647082;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
}

.review-form label {
  display: grid;
  gap: 8px;
}

.review-form label span,
.review-form__rating > span {
  color: #182033;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.2;
}

.review-form input,
.review-form textarea {
  width: 100%;
  min-width: 0;
  border: 1px solid #dbe6f4;
  border-radius: 12px;
  background: #fff;
  color: #182033;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  outline: 0;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.review-form input {
  min-height: 48px;
  padding: 0 14px;
}

.review-form textarea {
  resize: vertical;
  min-height: 120px;
  padding: 14px;
}

.review-form input:focus,
.review-form textarea:focus {
  border-color: rgba(13, 110, 253, 0.45);
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
}

.review-form__rating {
  display: grid;
  gap: 8px;
}

.review-form__rating div {
  display: flex;
  gap: 6px;
}

.review-form__rating button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 10px;
  background: #eef4ff;
  color: #b8c3d6;
  font-size: 20px;
}

.review-form__rating .review-form__star--active {
  color: #ffa800;
}

.review-form__submit,
.review-modal__success button {
  min-height: 52px;
  border: 0;
  border-radius: 12px;
  background: #0d6efd;
  color: #fff;
  font-size: 15px;
  font-weight: 900;
  line-height: 1;
}

.review-form__submit:disabled {
  cursor: wait;
  opacity: 0.68;
}

.review-form__error {
  margin: 0;
  color: #d82244;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;
}

.review-modal__success {
  display: grid;
  gap: 14px;
  text-align: center;
}

.review-modal__success > i {
  justify-self: center;
  color: #1f8a4c;
  font-size: 56px;
}

.review-modal__success button {
  justify-self: center;
  min-width: 150px;
  margin-top: 8px;
  padding: 0 24px;
}

@media (max-width: 991.98px) {
  .reviews-hero__inner,
  .reviews-grid {
    grid-template-columns: 1fr;
  }

  .reviews-hero__aside {
    max-width: 360px;
  }
}

@media (max-width: 767.98px) {
  .reviews-page {
    padding-bottom: 70px;
  }

  .reviews-hero {
    padding-top: 42px;
  }

  .reviews-main__head {
    align-items: flex-start;
    flex-direction: column;
  }

  .reviews-main__button {
    width: 100%;
  }

  .review-card {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .review-card__top {
    flex-direction: column;
  }

  .review-modal {
    padding: max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom));
  }

  .review-modal__panel {
    max-height: calc(100dvh - 28px);
    border-radius: 18px;
  }

  .review-form,
  .review-modal__success {
    padding: 28px 20px 22px;
  }
}
</style>
