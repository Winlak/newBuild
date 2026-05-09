<template>
  <footer id="contacts" class="app-footer">
    <div class="container">
      <div class="footer-main">
        <div class="row g-5">
          <div class="col-12 col-lg-5">
            <NuxtLink to="/" class="footer-brand d-inline-flex align-items-center gap-2 mb-4">
              <span class="brand-icon">Н</span>
              <span class="brand-text">Новостройки НСК</span>
            </NuxtLink>

            <h2 class="footer-title fw-bold mb-3">
              Поможем подобрать квартиру в новостройке
            </h2>

            <p class="footer-text mb-4">
              Оставьте контакты — специалист свяжется с вами, уточнит критерии
              и подберёт подходящие варианты в Новосибирске.
            </p>

            <div class="footer-contacts d-grid gap-3">
              <a href="tel:89628355521" class="footer-contact-link">
                <i class="bi bi-telephone"></i>
                8 962 835-55-21
              </a>

              <a href="tel:83832555521" class="footer-contact-link">
                <i class="bi bi-telephone"></i>
                8 383 255-55-21
              </a>

              <a href="mailto:info@example.ru" class="footer-contact-link">
                <i class="bi bi-envelope"></i>
                info@example.ru
              </a>

              <span class="footer-contact-link">
                <i class="bi bi-geo-alt"></i>
                Новосибирск
              </span>
            </div>
          </div>

          <div class="col-12 col-lg-7">
            <div class="contact-card">
              <h3 class="contact-title fw-bold mb-3">
                Оставить заявку
              </h3>

              <p class="contact-subtitle mb-4">
                Заполните форму, и мы перезвоним в ближайшее время.
              </p>

              <form class="row g-3" @submit.prevent="submitForm">
                <div class="col-12 col-md-6">
                  <label class="form-label">Ваше имя</label>
                  <input
                    v-model.trim="form.name"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Иван"
                    autocomplete="name"
                    required
                  >
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Телефон</label>
                  <input
                    v-model.trim="form.phone"
                    type="tel"
                    class="form-control form-control-lg"
                    placeholder="+7 999 999-99-99"
                    autocomplete="tel"
                    required
                  >
                </div>

                <div class="col-12">
                  <label class="form-label">Комментарий</label>
                  <textarea
                    v-model.trim="form.message"
                    class="form-control"
                    rows="4"
                    placeholder="Расскажите где хотите жить и что для вас важно"
                  ></textarea>
                </div>

                <div class="col-12">
                  <div class="form-check">
                    <input
                      id="footerAgreement"
                      v-model="form.agreement"
                      class="form-check-input"
                      type="checkbox"
                      required
                    >
                    <label class="form-check-label" for="footerAgreement">
                      Согласен на обработку персональных данных
                    </label>
                  </div>
                </div>

                <div v-if="successMessage" class="col-12">
                  <div class="alert alert-success mb-0">
                    {{ successMessage }}
                  </div>
                </div>

                <div v-if="errorMessage" class="col-12">
                  <div class="alert alert-danger mb-0">
                    {{ errorMessage }}
                  </div>
                </div>

                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg rounded-pill px-5"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Отправляем...' : 'Отправить заявку' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = reactive({
  name: '',
  phone: '',
  message: '',
  agreement: false
})

const resetMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
}

const submitForm = async () => {
  resetMessages()

  if (!form.agreement) {
    errorMessage.value = 'Нужно согласиться на обработку персональных данных.'
    return
  }

  try {
    isLoading.value = true

    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        message: form.message,
        source: 'home-footer',
      }
    })

    successMessage.value = 'Заявка отправлена. Мы скоро свяжемся с вами.'

    form.name = ''
    form.phone = ''
    form.message = ''
    form.agreement = false
  } catch {
    errorMessage.value = 'Не удалось отправить заявку. Попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.app-footer {
  padding: 72px 0 28px;
  background: url(/content/AskIMG.webp) no-repeat center;
}
.footer-main {
  padding: 48px;
  border: 1px solid #edf0f4;
  border-radius: 36px;
  background: rgba(255, 255, 255, 0.86);
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
  width: 44px;
  height: 44px;
  border-radius: 15px;
  background: linear-gradient(135deg, #0d6efd, #4da3ff);
  color: #fff;
  font-size: 22px;
  font-weight: 800;
}

.brand-text {
  color: #182033;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.footer-title {
  max-width: 520px;
  color: #182033;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.12;
  letter-spacing: -0.03em;
}

.footer-text {
  max-width: 560px;
  color: #5f6b7a;
  font-size: 17px;
  line-height: 1.6;
}

.footer-contact-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  color: #465364;
  font-size: 17px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-contact-link i {
  color: #0d6efd;
  font-size: 20px;
}

a.footer-contact-link:hover {
  color: #0d6efd;
}

.contact-card {
  padding: 32px;
  border: 1px solid #edf0f4;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.07);
}

.contact-title {
  color: #182033;
  font-size: 30px;
  line-height: 1.2;
}

.contact-subtitle {
  color: #5f6b7a;
  font-size: 16px;
}

.form-label {
  color: #344054;
  font-weight: 700;
}

.form-control {
  border-color: #e4e8ee;
  border-radius: 16px;
}

.form-control:focus {
  border-color: rgba(13, 110, 253, 0.55);
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.12);
}

.form-check-label {
  color: #5f6b7a;
  font-size: 14px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
  color: #6b7685;
  font-size: 14px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.footer-links a {
  color: #6b7685;
  text-decoration: none;
}

.footer-links a:hover {
  color: #0d6efd;
}

@media (max-width: 991.98px) {
  .app-footer {
    padding-top: 56px;
  }

  .footer-main {
    padding: 32px;
    border-radius: 30px;
  }
}

@media (max-width: 575.98px) {
  .footer-main {
    padding: 24px 16px;
    border-radius: 24px;
  }

  .contact-card {
    padding: 24px 16px;
    border-radius: 22px;
  }

  .footer-title {
    font-size: 30px;
  }

  .contact-title {
    font-size: 26px;
  }

  .contact-card .btn {
    width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-links {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
