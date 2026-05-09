<script setup lang="ts">
type BreadcrumbItem = {
  label: string
  to?: string
}

type Props = {
  title?: string
  subtitleLines?: string[]
  primaryText?: string
  primaryTo?: string
  secondaryText?: string
  secondaryTo?: string
  breadcrumbs?: BreadcrumbItem[]
  bgImage?: string
  backImage?: string
  frontImage?: string
}

withDefaults(defineProps<Props>(), {
  title: 'О нас',
  subtitleLines: () => [
    'Новостройки НСК — ваш надёжный партнёр',
    'в выборе квартиры в новостройке в Новосибирске.',
    'Подбираем лучшее без комиссии для клиента.',
  ],
  primaryText: 'Подобрать квартиру',
  primaryTo: '/catalog',
  secondaryText: 'Получить консультацию',
  secondaryTo: '/contacts',
  backImage: '/content/AboutFirstIMG.webp',
  frontImage: '/content/AboutSecondIMG.webp',
  breadcrumbs: () => [
    { label: 'Главная', to: '/' },
    { label: 'О нас' },
  ],
})

</script>

<template>
  <section
    class="about-hero"
    style="background-image: url(/content/AboutBG.webp);"
  >
    <div class="container about-hero__container">

      <div class="row align-items-center about-hero__row">
        <div class="col-12 col-lg-6">
          <div class="about-hero__content">
            <h1 class="about-hero__title">
              {{ title }}
            </h1>

            <p class="about-hero__subtitle">
              <span
                v-for="line in subtitleLines"
                :key="line"
                class="about-hero__subtitle-line"
              >
                {{ line }}
              </span>
            </p>

            <div class="about-hero__actions">
              <button
                type="button"
                class="about-hero__btn about-hero__btn--primary"
                @click="openRequestModal({ source: 'about-primary' })"
              >
                <span>{{ primaryText }}</span>
                <span class="about-hero__arrow" aria-hidden="true">→</span>
              </button>

              <button
                type="button"
                class="about-hero__btn about-hero__btn--outline"
                @click="openRequestModal({ source: 'about-secondary' })"
              >
                {{ secondaryText }}
              </button>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="about-hero__media" aria-hidden="true">
            <img
              class="about-hero__image about-hero__image--back"
              :src="backImage"
              alt=""
              width="700"
              height="400"
              loading="eager"
              decoding="async"
            >

            <img
              class="about-hero__image about-hero__image--front"
              :src="frontImage"
              alt=""
              width="620"
              height="320"
              loading="eager"
              decoding="async"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-hero {
  position: relative;
  overflow: hidden;
  min-height: 590px;
  padding: 82px 0 54px;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(5, 94, 224, 0.98) 0%, rgba(0, 80, 214, 0.96) 48%, rgba(0, 65, 190, 0.98) 100%),
    var(--about-bg-image) center bottom / cover no-repeat;
}

.about-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 35% 48%, rgba(53, 167, 255, 0.28) 0, transparent 34%),
    radial-gradient(circle at 78% 35%, rgba(40, 139, 255, 0.28) 0, transparent 30%);
  pointer-events: none;
}

.about-hero__container {
  position: relative;
  z-index: 1;
}

.about-hero__breadcrumbs {
  margin-bottom: 28px;
}

.about-hero__breadcrumbs :deep(.breadcrumb) {
  --bs-breadcrumb-divider-color: rgba(255, 255, 255, 0.55);
}

.about-hero__breadcrumbs :deep(.breadcrumb-item),
.about-hero__breadcrumbs :deep(.breadcrumb-item a) {
  font-size: 17px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
  text-decoration: none;
}

.about-hero__breadcrumbs :deep(.breadcrumb-item.active) {
  color: rgba(255, 255, 255, 0.8);
}

.about-hero__row {
  min-height: 390px;
}

.about-hero__content {
  max-width: 720px;
}

.about-hero__title {
  margin: 0 0 20px;
  font-size: clamp(64px, 6vw, 108px);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.045em;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.18);
}

.about-hero__subtitle {
  max-width: 720px;
  margin: 0;
  font-size: clamp(21px, 1.65vw, 28px);
  font-weight: 700;
  line-height: 1.38;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 3px 14px rgba(0, 0, 0, 0.18);
}

.about-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  margin-top: 44px;
}
.about-hero__subtitle-line {
  display: block;
}
.about-hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 74px;
  padding: 18px 31px;
  border-radius: 12px;
  font-size: clamp(18px, 1.25vw, 23px);
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.about-hero__btn:hover {
  transform: translateY(-2px);
}

.about-hero__btn--primary {
  gap: 28px;
  color: #0860df;
  background: #fff;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 26px rgba(0, 31, 110, 0.22);
}

.about-hero__btn--primary:hover {
  color: #004ec4;
  background: #f7fbff;
  box-shadow: 0 14px 34px rgba(0, 31, 110, 0.3);
}

.about-hero__btn--outline {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.72);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.18),
    0 8px 22px rgba(0, 31, 110, 0.16);
}

.about-hero__btn--outline:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border-color: #fff;
}

.about-hero__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 400;
  line-height: 1;
}

.about-hero__media {
  position: relative;
  min-height: 420px;
}

.about-hero__image {
  position: absolute;
  display: block;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}

.about-hero__image--back {
  top: -25px;
  right: 0;
  width: min(100%, 700px);
  height: 390px;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-radius: 28px;
  box-shadow: 0 22px 46px rgba(0, 26, 96, 0.32);
}

.about-hero__image--front {
  left: -112px;
  bottom: 8px;
  z-index: 2;
  width: min(88%, 620px);
  height: 320px;
  border: 3px solid rgba(255, 255, 255, 0.42);
  border-radius: 28px;
  box-shadow: 0 22px 52px rgba(0, 26, 96, 0.38);
}

@media (max-width: 1199.98px) {
  .about-hero {
    min-height: auto;
  }

  .about-hero__image--front {
    left: -64px;
  }
}

@media (max-width: 991.98px) {
  .about-hero {
    padding: 56px 0 48px;
  }

  .about-hero__breadcrumbs {
    margin-bottom: 22px;
  }

  .about-hero__actions {
    gap: 16px;
    margin-top: 32px;
  }

  .about-hero__btn {
    min-height: 60px;
    padding: 16px 22px;
  }

  .about-hero__media {
    min-height: 360px;
    margin-top: 42px;
  }

  .about-hero__image--back {
    right: 0;
    width: 82%;
    height: 310px;
  }

  .about-hero__image--front {
    left: 0;
    bottom: 0;
    width: 74%;
    height: 250px;
  }
}

@media (max-width: 575.98px) {
  .about-hero {
    padding: 34px 0 38px;
  }

  .about-hero__breadcrumbs :deep(.breadcrumb-item),
  .about-hero__breadcrumbs :deep(.breadcrumb-item a) {
    font-size: 14px;
  }

  .about-hero__title {
    margin-bottom: 16px;
    font-size: 58px;
  }

  .about-hero__subtitle {
    font-size: 18px;
    line-height: 1.45;
  }

  .about-hero__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .about-hero__btn {
    width: 100%;
  }

  .about-hero__media {
    min-height: 270px;
    margin-top: 34px;
  }

  .about-hero__image--back {
    width: 88%;
    height: 235px;
    border-radius: 20px;
  }

  .about-hero__image--front {
    width: 82%;
    height: 185px;
    border-radius: 20px;
  }
}
</style>
