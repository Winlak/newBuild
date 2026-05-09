<template>
  <section
    class="contact-hero"
    style="--contact-hero-bg: url('/content/ContactIMG.webp');"
  >
    <div class="container contact-hero__inner">
      <div class="contact-hero__content">
        <div class="contact-hero__text">
          <h1 class="contact-hero__title">
            Свяжитесь с нами<br>
            и подберём квартиру<br>
            <span>без стресса</span>
          </h1>

          <p class="contact-hero__description" >
            Помогаем подобрать новостройку в Новосибирске безопасно,
            выгодно и бесплатно. Ответим на вопросы и подберём лучшие
            варианты под ваш бюджет.
          </p>

          <div class="contact-hero__actions">
            <button
              type="button"
              class="btn contact-hero__btn contact-hero__btn-primary"
              @click="emit('openRequest')"
            >
              <span>Оставить заявку</span>
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </button>

            <a
              :href="`tel:${phoneHref}`"
              class="btn contact-hero__btn contact-hero__btn-outline"
            >
              <span>Позвонить</span>
              <i class="bi bi-telephone" aria-hidden="true"></i>
            </a>
          </div>

          <div class="contact-hero__note">
            <i class="bi bi-clock" aria-hidden="true"></i>
            <span>Ответим в течение 15 минут</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  phoneHref?: string
}

withDefaults(defineProps<Props>(), {
  phoneHref: '83832555521',
})

const emit = defineEmits<{
  openRequest: []
}>()
</script>

<style scoped>
.contact-hero {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 720px;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(255, 255, 255, 0.94) 28%,
      rgba(255, 255, 255, 0.68) 47%,
      rgba(255, 255, 255, 0.12) 68%,
      rgba(255, 255, 255, 0) 100%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 62%,
      rgba(255, 255, 255, 0.96) 100%
    ),
    var(--contact-hero-bg) center right / cover no-repeat;
}

.contact-hero *,
.contact-hero *::before,
.contact-hero *::after {
  box-sizing: border-box;
}

.contact-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 22% 18%, rgba(13, 110, 253, 0.08), transparent 32%),
    linear-gradient(180deg, rgba(248, 251, 255, 0.35), rgba(255, 255, 255, 0.1));
  pointer-events: none;
}

.contact-hero__content {
  position: relative;
  z-index: 1;
}

.contact-hero__inner {
  position: relative;
  z-index: 1;
  padding: 28px;
  border-radius: 22px;
  background-color: rgba(255, 255, 255, 0.68);
}

.contact-hero__text {
  max-width: 720px;
  min-width: 0;
}

.contact-hero__title {
  margin: 0 0 28px;
  max-width: 100%;
  color: #07123d;
  font-size: clamp(44px, 5vw, 78px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.055em;
  overflow-wrap: break-word;
  text-shadow: 0 4px 16px rgba(7, 18, 61, 0.12);
}

.contact-hero__title span {
  color: #0d6efd;
}

.contact-hero__description {
  max-width: 640px;
  margin: 0 0 38px;
  color: #5f6b7c;
  font-size: 21px;
  font-weight: 500;
  line-height: 1.55;
  overflow-wrap: break-word;
}

.contact-hero__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 22px;
  margin-bottom: 30px;
}

.contact-hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 76px;
  padding: 18px 34px;
  border-radius: 14px;
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.contact-hero__btn-primary {
  border: 1px solid #0d6efd;
  background: linear-gradient(135deg, #0d6efd, #0063df);
  color: #fff;
  box-shadow: 0 12px 28px rgba(13, 110, 253, 0.32);
}

.contact-hero__btn-primary:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #0b5ed7, #0055c8);
  color: #fff;
  box-shadow: 0 16px 34px rgba(13, 110, 253, 0.4);
}

.contact-hero__btn-outline {
  border: 2px solid rgba(13, 110, 253, 0.5);
  background: rgba(255, 255, 255, 0.72);
  color: #0d5bd7;
  box-shadow: 0 8px 24px rgba(13, 110, 253, 0.08);
  backdrop-filter: blur(10px);
}

.contact-hero__btn-outline:hover {
  transform: translateY(-2px);
  border-color: #0d6efd;
  background: #0d6efd;
  color: #fff;
}

.contact-hero__note {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  color: #5f6b7c;
  font-size: 19px;
  font-weight: 700;
}

.contact-hero__note i {
  color: #07123d;
  font-size: 25px;
}

@media (max-width: 1199.98px) {
  .contact-hero {
    min-height: 660px;
    padding: 100px 0 70px;
    background-position: center right 35%;
  }

  .contact-hero__text {
    max-width: 620px;
  }
}

@media (max-width: 991.98px) {
  .contact-hero {
    min-height: auto;
    padding: 96px 0 72px;
    background:
      linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.92) 54%,
        rgba(255, 255, 255, 0.62) 100%
      ),
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 58%,
        rgba(255, 255, 255, 0.96) 100%
      ),
      var(--contact-hero-bg) center right / cover no-repeat;
  }

  .contact-hero__description {
    max-width: 560px;
    font-size: 19px;
  }

  .contact-hero__btn {
    min-height: 66px;
    padding: 16px 28px;
    font-size: 19px;
  }
}

@media (max-width: 575.98px) {
  .contact-hero {
    overflow-x: clip;
    padding: 72px 0 52px;
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.96) 0%,
        rgba(255, 255, 255, 0.9) 58%,
        rgba(255, 255, 255, 0.98) 100%
      ),
      var(--contact-hero-bg) center right 36% / cover no-repeat;
  }

  .contact-hero__inner {
    width: auto;
    max-width: none;
    margin-right: 12px;
    margin-left: 12px;
    padding: 20px 0;
    border-radius: 0;
    background-color: rgba(255, 255, 255, 0.72);
  }

  .contact-hero__title {
    margin-bottom: 20px;
    font-size: clamp(29px, 8.4vw, 32px);
    line-height: 1.12;
    letter-spacing: 0;
  }

  .contact-hero__title br {
    display: none;
  }

  .contact-hero__title span {
    display: block;
  }

  .contact-hero__description {
    margin-bottom: 28px;
    font-size: 16px;
  }

  .contact-hero__actions {
    gap: 14px;
    margin-bottom: 24px;
  }

  .contact-hero__btn {
    width: 100%;
    min-height: 58px;
    padding: 15px 22px;
    font-size: 17px;
  }

  .contact-hero__note {
    font-size: 15px;
  }

  .contact-hero__note i {
    font-size: 20px;
  }
}
</style>
