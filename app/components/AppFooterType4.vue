<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-card">
        <div class="row g-4 g-xl-5">
          <div class="col-12 col-lg-4 col-xl-3">
            <NuxtLink to="/" class="footer-brand d-inline-flex align-items-center gap-3 mb-3">
              <span class="brand-icon">Н</span>
              <span class="brand-text">Новостройки НСК</span>
            </NuxtLink>

            <p class="footer-description mb-4">
              Подбираем новостройки в Новосибирске без комиссии и с полной безопасностью.
            </p>

            <div class="footer-socials">
              <a href="#" class="social-link social-link-vk" aria-label="ВКонтакте">
                <FontAwesomeIcon :icon="['fab', 'vk']" />
              </a>

              <a href="#" class="social-link" aria-label="Telegram">
                <FontAwesomeIcon :icon="['fab', 'telegram']" />
              </a>

              <a href="#" class="social-link social-link-whatsapp" aria-label="WhatsApp">
                <FontAwesomeIcon :icon="['fab', 'whatsapp']" />
              </a>

              <a href="#" class="social-link social-link-max" aria-label="MAX">
                <span>MAX</span>
              </a>
            </div>
          </div>

          <div class="col-6 col-lg-2">
            <h3 class="footer-title">
              Навигация
            </h3>

            <nav class="footer-nav">
              <NuxtLink to="/">
                Главная
              </NuxtLink>

              <NuxtLink to="/catalog">
                Каталог новостроек
              </NuxtLink>

              <NuxtLink to="/contacts">
                Контакты
              </NuxtLink>

              <NuxtLink to="/about">
                О нас
              </NuxtLink>
            </nav>
          </div>

          <div class="col-12 col-lg-4 col-xl-3">
            <h3 class="footer-title">
              Контакты
            </h3>

            <div class="footer-contacts">
              <a
                href="https://yandex.ru/maps/?text=Новосибирск, Депутатская 46"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-item"
              >
                <i class="bi bi-geo-alt"></i>
                <span>
                  ул. Депутатская, 46, 1 этаж<br>
                  Новосибирск, 630099
                </span>
              </a>

              <a href="mailto:info@nsk-novostroyki.ru" class="contact-item">
                <i class="bi bi-envelope"></i>
                <span>info@nsk-novostroyki.ru</span>
              </a>

              <div class="contact-item">
                <i class="bi bi-telephone"></i>
                <span>
                  <a href="tel:83832555521">+7 (383) 255-55-21</a><br>
                  <a href="tel:79628355521">+7 (962) 835-55-21</a>
                </span>
              </div>
            </div>
          </div>

          <div class="col-12 col-xl">
            <div class="subscribe-card">
              <h3 class="subscribe-title">
                Будьте в курсе новостей
              </h3>

              <p class="subscribe-text">
                Получайте подборки новостроек и выгодные предложения
              </p>

              <form class="subscribe-form" @submit.prevent="submitSubscribe">
                <input
                  v-model.trim="email"
                  type="email"
                  class="form-control"
                  placeholder="Ваш e-mail"
                  autocomplete="email"
                  required
                >

                <button
                  type="submit"
                  class="btn btn-primary"
                  aria-label="Подписаться"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                  <i v-else class="bi bi-arrow-right"></i>
                </button>
              </form>

              <p v-if="message" class="subscribe-message mb-0">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="mb-0">
            © {{ currentYear }} Новостройки НСК. Все права защищены.
          </p>

          <NuxtLink to="/privacy">
            Политика конфиденциальности
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const email = ref('')
const isLoading = ref(false)
const message = ref('')

const submitSubscribe = async () => {
  if (!email.value) {
    return
  }

  try {
    isLoading.value = true
    message.value = ''

    await $fetch('/api/subscribe', {
      method: 'POST',
      body: {
        email: email.value,
        source: 'footer',
      },
    })

    message.value = 'Спасибо, вы подписались.'
    email.value = ''
  } catch {
    message.value = 'Не удалось отправить. Попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.site-footer {
  padding: 64px 0 32px;
  background:

    linear-gradient(180deg, rgba(255, 255, 255, 0) 0, #f7faff 150px, #fff 100%);

}

.footer-card {
  padding: 44px 48px 24px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08);
}

.footer-brand {
  color: inherit;
  text-decoration: none;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0d6efd, #4da3ff);
  color: #fff;
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
}

.brand-text {
  color: #182033;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
  white-space: nowrap;
}

.footer-description {
  max-width: 330px;
  color: #6b7685;
  font-size: 16px;
  line-height: 1.55;
}

.footer-socials {
  display: flex;
  align-items: center;
  gap: 12px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #eef5ff;
  color: #0d6efd;
  font-size: 21px;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.social-link:hover {
  transform: translateY(-2px);
  background: #0d6efd;
  color: #fff;
}


.social-link-vk {
  background: #e7f0ff;
  color: #4da3ff;
}
.social-link-vk:hover {
  background: #4da3ff;
  color: #fff;
}

.social-link-whatsapp {
  background: #eaffef;
  color: #20c45a;
}

.social-link-whatsapp:hover {
  background: #20c45a;
  color: #fff;
}

.social-link-max {
  background: #e7f0ff;
  color: #0d6efd;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0;
}

.social-link-max:hover {
  background: #0d6efd;
  color: #fff;
}

.footer-title {
  margin-bottom: 18px;
  color: #182033;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.25;
}

.footer-nav {
  display: grid;
  gap: 12px;
}

.footer-nav a {
  color: #687386;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-nav a:hover,
.footer-nav a.router-link-active {
  color: #0d6efd;
}

.footer-contacts {
  display: grid;
  gap: 14px;
}

.contact-item {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 10px;
  color: #687386;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
}

.contact-item i {
  color: #0d6efd;
  font-size: 20px;
  line-height: 1.2;
}

.contact-item a {
  color: inherit;
  text-decoration: none;
}

.contact-item:hover,
.contact-item a:hover {
  color: #0d6efd;
}

.subscribe-card {
  padding: 24px;
  border-radius: 22px;
  background: #f8fbff;
  box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.8);
}

.subscribe-title {
  margin-bottom: 10px;
  color: #182033;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.25;
}

.subscribe-text {
  margin-bottom: 18px;
  color: #6b7685;
  font-size: 15px;
  line-height: 1.45;
}

.subscribe-form {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.subscribe-form .form-control {
  height: 54px;
  border: 1px solid #dce4ef;
  border-right: 0;
  border-radius: 14px 0 0 14px;
  color: #182033;
  font-size: 15px;
  box-shadow: none;
}

.subscribe-form .form-control:focus {
  border-color: #0d6efd;
  box-shadow: none;
}

.subscribe-form .btn {
  width: 58px;
  min-width: 58px;
  height: 54px;
  border-radius: 0 14px 14px 0;
  font-size: 22px;
}

.subscribe-message {
  margin-top: 12px;
  color: #0d6efd;
  font-size: 14px;
  font-weight: 700;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid #e7ecf3;
  color: #8a94a6;
  font-size: 14px;
}

.footer-bottom a {
  color: #6b7685;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-bottom a:hover {
  color: #0d6efd;
}

@media (max-width: 1199.98px) {
  .subscribe-card {
    max-width: 420px;
  }
}

@media (max-width: 991.98px) {
  .site-footer {
    padding-top: 48px;
  }

  .footer-card {
    padding: 32px 28px 22px;
    border-radius: 28px;
  }
}

@media (max-width: 575.98px) {
  .site-footer {
    padding: 36px 0 24px;
  }

  .footer-card {
    padding: 28px 18px 20px;
    border-radius: 24px;
  }

  .brand-icon {
    width: 46px;
    height: 46px;
    font-size: 23px;
  }

  .brand-text {
    font-size: 21px;
  }

  .footer-description {
    font-size: 15px;
  }

  .subscribe-card {
    padding: 20px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 28px;
  }
}
</style>
