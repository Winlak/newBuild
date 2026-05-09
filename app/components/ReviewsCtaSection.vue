<script setup lang="ts">
import { reviews as defaultReviews, type ReviewItem } from '~/data/reviews'

withDefaults(
  defineProps<{
    title?: string
    allLink?: string
    ctaTitle?: string
    ctaText?: string
    ctaLink?: string
    reviews?: ReviewItem[]
  }>(),
  {
    title: 'Отзывы наших клиентов',
    allLink: '/reviews',
    ctaTitle: 'Готовы подобрать квартиру вместе?',
    ctaText: 'Оставьте заявку — поможем выбрать лучший вариант под ваш бюджет и цели',
    ctaLink: '/contacts',
    reviews: () => defaultReviews.slice(0, 2),
  },
)

const failedAvatars = ref<Record<string, boolean>>({})

const onAvatarError = (id: string) => {
  failedAvatars.value[id] = true
}

const getStars = (rating = 5) => {
  return Math.max(0, Math.min(5, Math.round(rating)))
}
</script>

<template>
  <section class="reviews-cta container">
    <div class="reviews-cta__inner">
      <div class="reviews-cta__head">
        <h2 class="reviews-cta__title">
          {{ title }}
        </h2>

        <NuxtLink
          :to="allLink"
          class="reviews-cta__all"
        >
          Все отзывы

          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </NuxtLink>
      </div>

      <div class="reviews-cta__grid">
        <article
          v-for="review in reviews"
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
            <h3 class="review-card__name">
              {{ review.name }}
            </h3>

            <p class="review-card__subtitle">
              {{ review.subtitle }}
            </p>

            <p class="review-card__text">
              {{ review.text }}
            </p>

            <div class="review-card__rating" aria-label="Оценка 5 из 5">
              <svg
                v-for="star in getStars(review.rating)"
                :key="star"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9L12 2.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="reviews-cta__banner">
      <div class="reviews-cta__buildings reviews-cta__buildings--left" aria-hidden="true" />
      <div class="reviews-cta__buildings reviews-cta__buildings--right" aria-hidden="true" />

      <div class="reviews-cta__banner-content">
        <h2 class="reviews-cta__banner-title">
          {{ ctaTitle }}
        </h2>

        <p class="reviews-cta__banner-text">
          {{ ctaText }}
        </p>
      </div>

      <button
        type="button"
        class="reviews-cta__button"
        @click="openRequestModal({ source: 'reviews-cta' })"
      >
        Получить консультацию

        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.reviews-cta {
  width: min(calc(100% - 48px), 1780px);
  margin: 0 auto;
  padding: 36px 0;
}

.reviews-cta__inner {
  padding: 34px 32px 28px;
  background: #fff;
  border: 1px solid #e9eef6;
  border-radius: 28px;
  box-shadow: 0 14px 42px rgba(15, 31, 62, 0.045);
}

.reviews-cta__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}

.reviews-cta__title {
  margin: 0;
  color: #071747;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.035em;
}

.reviews-cta__all {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #1663ff;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.reviews-cta__all svg {
  width: 24px;
  height: 24px;
}

.reviews-cta__all:hover {
  color: #0049d8;
  transform: translateX(2px);
}

.reviews-cta__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}

.review-card {
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 26px;
  min-height: 240px;
  padding: 28px;
  background: #fff;
  border: 1px solid #e9eef6;
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(15, 31, 62, 0.04);
}

.review-card__avatar {
  width: 104px;
  height: 104px;
  overflow: hidden;
  background: #eef3fb;
  border-radius: 50%;
}

.review-card__avatar img,
.review-card__avatar-placeholder {
  display: block;
  width: 100%;
  height: 100%;
}

.review-card__avatar img {
  object-fit: cover;
  object-position: center top;
}

.review-card__name {
  margin: 0 0 6px;
  color: #071747;
  font-size: 23px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.review-card__subtitle {
  margin: 0 0 20px;
  color: #738096;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.35;
}

.review-card__text {
  max-width: 720px;
  margin: 0 0 18px;
  color: #687386;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.55;
}

.review-card__rating {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffb000;
}

.review-card__rating svg {
  width: 24px;
  height: 24px;
}

.reviews-cta__banner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 40px;
  min-height: 170px;
  margin-top: 24px;
  padding: 34px 90px 34px 130px;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(circle at 50% 30%, rgba(58, 143, 255, 0.4), transparent 38%),
    linear-gradient(135deg, #0046db 0%, #005cff 56%, #0047dc 100%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 28px;
  box-shadow: 0 18px 44px rgba(0, 77, 220, 0.24);
}

.reviews-cta__banner-title {
  position: relative;
  z-index: 1;
  margin: 0 0 2px;
  color: #fff;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.04em;
}

.reviews-cta__banner-text {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.reviews-cta__button {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  min-width: 220px;
  min-height: 78px;
  padding: 10px 14px;
  color: #075cff;
  background: #fff;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  box-shadow: 0 10px 26px rgba(0, 31, 110, 0.18);
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reviews-cta__button svg {
  width: 34px;
  height: 34px;
}

.reviews-cta__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(0, 31, 110, 0.24);
}

.reviews-cta__buildings {
  position: absolute;
  bottom: 0;
  width: 210px;
  height: 130px;
  opacity: 0.18;
  background:
    linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)) 16px 38px / 54px 92px no-repeat,
    linear-gradient(to top, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.65)) 78px 62px / 48px 68px no-repeat,
    linear-gradient(to top, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)) 134px 18px / 60px 112px no-repeat;
}

.reviews-cta__buildings::before {
  position: absolute;
  inset: 0;
  content: "";
  background-image:
    repeating-linear-gradient(to bottom, transparent 0 14px, rgba(0, 91, 255, 0.7) 14px 18px),
    repeating-linear-gradient(to right, transparent 0 16px, rgba(0, 91, 255, 0.7) 16px 20px);
  mix-blend-mode: multiply;
}

.reviews-cta__buildings--left {
  left: 0;
}

.reviews-cta__buildings--right {
  right: 0;
  transform: scaleX(-1);
}

@media (max-width: 1399.98px) {
  .reviews-cta__grid {
    gap: 20px;
  }

  .review-card {
    grid-template-columns: 90px minmax(0, 1fr);
    gap: 20px;
    padding: 24px;
  }

  .review-card__avatar {
    width: 82px;
    height: 82px;
  }

  .review-card__text {
    font-size: 16px;
  }

  .reviews-cta__banner {
    padding: 32px 72px;
  }

  .reviews-cta__banner-title {
    font-size: 34px;
  }

  .reviews-cta__banner-text {
    font-size: 19px;
  }

  .reviews-cta__button {
    min-width: 340px;
    min-height: 68px;
    font-size: 20px;
  }
}

@media (max-width: 991.98px) {
  .reviews-cta__grid {
    grid-template-columns: 1fr;
  }

  .reviews-cta__banner {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 32px;
  }

  .reviews-cta__button {
    width: fit-content;
    min-width: 320px;
  }
}

@media (max-width: 767.98px) {
  .reviews-cta {
    width: calc(100% - 24px);
    padding: 24px 0;
  }

  .reviews-cta__inner {
    padding: 22px 14px 14px;
    border-radius: 20px;
  }

  .reviews-cta__head {
    margin-bottom: 18px;
  }

  .reviews-cta__title {
    font-size: 25px;
  }

  .reviews-cta__all {
    font-size: 0;
    gap: 0;
  }

  .reviews-cta__all svg {
    width: 28px;
    height: 28px;
  }

  .review-card {
    grid-template-columns: 1fr;
    gap: 16px;
    min-height: auto;
    padding: 18px;
    border-radius: 16px;
  }

  .review-card__avatar {
    width: 72px;
    height: 72px;
  }

  .review-card__name {
    font-size: 20px;
  }

  .review-card__subtitle {
    margin-bottom: 14px;
    font-size: 15px;
  }

  .review-card__text {
    font-size: 15px;
  }

  .review-card__rating svg {
    width: 21px;
    height: 21px;
  }

  .reviews-cta__banner {
    min-height: auto;
    margin-top: 16px;
    padding: 28px 20px;
    border-radius: 20px;
  }

  .reviews-cta__banner-title {
    font-size: 27px;
  }

  .reviews-cta__banner-text {
    font-size: 16px;
  }

  .reviews-cta__button {
    width: 100%;
    min-width: 0;
    min-height: 58px;
    padding: 16px 18px;
    gap: 14px;
    font-size: 17px;
  }

  .reviews-cta__button svg {
    width: 26px;
    height: 26px;
  }

  .reviews-cta__buildings {
    opacity: 0.1;
  }
}
</style>
