<template>
  <div class="contact-card request-card">
    <div class="contact-card__header">
      <h2 class="contact-card__title">
        Оставьте заявку
      </h2>

      <p class="request-card__subtitle">
        Менеджер уточнит пожелания и пришлёт подходящие новостройки.
      </p>
    </div>

    <form class="request-form" @submit.prevent="submitForm">
      <div class="request-field request-field--half">
        <input
          v-model.trim="form.name"
          type="text"
          class="form-control"
          placeholder="Имя"
          autocomplete="name"
          required
        >

        <i class="bi bi-person" aria-hidden="true"></i>
      </div>

      <div class="request-field request-field--half">
        <input
          v-model.trim="form.phone"
          type="tel"
          class="form-control"
          placeholder="Телефон"
          autocomplete="tel"
          required
        >

        <i class="bi bi-telephone" aria-hidden="true"></i>
      </div>

      <div class="request-field">
        <input
          v-model.trim="form.time"
          type="text"
          class="form-control"
          placeholder="Удобное время для звонка"
        >

        <i class="bi bi-clock" aria-hidden="true"></i>
      </div>

      <div class="request-field request-field-textarea">
        <textarea
          v-model.trim="form.comment"
          class="form-control"
          placeholder="Расскажите где хотите жить и что для вас важно"
          rows="5"
        />
      </div>

      <label class="request-policy">
        <input
          v-model="form.agree"
          type="checkbox"
          class="form-check-input"
          required
        >

        <span>
          Я согласен на
          <NuxtLink to="/privacy">
            обработку персональных данных
          </NuxtLink>
        </span>
      </label>

      <button
        type="submit"
        class="btn request-submit"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="spinner-border spinner-border-sm" />
        <span>{{ isLoading ? 'Отправляем...' : 'Отправить заявку' }}</span>
        <i
          v-if="!isLoading"
          class="bi bi-telegram"
          aria-hidden="true"
        ></i>
      </button>

      <p
        v-if="message"
        class="request-message"
        :class="{ 'request-message-error': isError }"
      >
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
interface ContactRequestForm {
  name: string
  phone: string
  time: string
  comment: string
  agree: boolean
}

const emit = defineEmits<{
  submit: [payload: ContactRequestForm]
}>()

const form = reactive<ContactRequestForm>({
  name: '',
  phone: '',
  time: '',
  comment: '',
  agree: true,
})

const isLoading = ref(false)
const message = ref('')
const isError = ref(false)

const submitForm = async () => {
  if (!form.name || !form.phone || !form.agree) {
    message.value = 'Заполните имя, телефон и согласие.'
    isError.value = true
    return
  }

  try {
    isLoading.value = true
    message.value = ''
    isError.value = false

    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        time: form.time,
        message: form.comment,
        source: 'contacts-page',
      },
    })

    emit('submit', { ...form })

    message.value = 'Заявка отправлена. Мы скоро свяжемся с вами.'

    form.name = ''
    form.phone = ''
    form.time = ''
    form.comment = ''
    form.agree = true
  } catch {
    message.value = 'Не удалось отправить заявку. Попробуйте позже.'
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.contact-card {
  min-width: 0;
  padding: 34px;
  border: 1px solid rgba(210, 222, 239, 0.9);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 20px 60px rgba(18, 38, 63, 0.1);
  backdrop-filter: blur(16px);
}

.contact-card__header {
  margin-bottom: 24px;
}

.contact-card__title {
  margin: 0;
  color: #07123d;
  font-size: clamp(28px, 2.2vw, 36px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: 0;
}

.request-card__subtitle {
  max-width: 560px;
  margin: 10px 0 0;
  color: #5f6b7c;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: break-word;
}

.request-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.request-field,
.request-policy,
.request-submit,
.request-message {
  grid-column: 1 / -1;
}

.request-field--half {
  grid-column: span 1;
}

.request-field {
  position: relative;
}

.request-field .form-control {
  min-height: 56px;
  padding: 15px 50px 15px 18px;
  border: 1px solid #dce4ef;
  border-radius: 12px;
  background: #fff;
  color: #07123d;
  font-size: 16px;
  font-weight: 600;
  box-shadow: none;
}

.request-field textarea.form-control {
  min-height: 128px;
  resize: vertical;
}

.request-field .form-control::placeholder {
  color: #8b95a7;
}

.request-field .form-control:focus {
  border-color: rgba(13, 110, 253, 0.65);
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.08);
}

.request-field i {
  position: absolute;
  top: 50%;
  right: 18px;
  color: #b4bdcb;
  font-size: 19px;
  transform: translateY(-50%);
  pointer-events: none;
}

.request-field-textarea .form-control {
  padding-right: 20px;
}

.request-policy {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 2px 0 4px;
  color: #4f5d73;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  cursor: pointer;
}

.request-policy .form-check-input {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin: 0;
  border-color: rgba(13, 110, 253, 0.45);
  cursor: pointer;
}

.request-policy .form-check-input:checked {
  border-color: #0d6efd;
  background-color: #0d6efd;
}

.request-policy a {
  color: #0d6efd;
  font-weight: 800;
  text-decoration: none;
}

.request-policy a:hover {
  text-decoration: underline;
}

.request-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  min-height: 62px;
  border: 1px solid #0d6efd;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d6efd, #0063df);
  color: #fff;
  font-size: 18px;
  font-weight: 900;
  line-height: 1;
  box-shadow: 0 12px 28px rgba(13, 110, 253, 0.28);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.request-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #0b5ed7, #0055c8);
  color: #fff;
  box-shadow: 0 16px 34px rgba(13, 110, 253, 0.38);
}

.request-submit:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.request-submit i {
  margin-left: auto;
  font-size: 23px;
}

.request-message {
  margin: 0;
  color: #0d6efd;
  font-size: 15px;
  font-weight: 800;
}

.request-message-error {
  color: #dc3545;
}

@media (max-width: 575.98px) {
  .contact-card {
    padding: 20px;
    border-radius: 18px;
  }

  .request-card__subtitle {
    font-size: 15px;
  }

  .request-field .form-control {
    min-height: 54px;
    font-size: 15px;
  }

  .request-form {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .request-field--half {
    grid-column: 1;
  }

  .request-policy {
    align-items: flex-start;
    font-size: 14px;
  }

  .request-submit {
    min-height: 60px;
    font-size: 17px;
  }

  .request-submit i {
    font-size: 22px;
  }
}
</style>
