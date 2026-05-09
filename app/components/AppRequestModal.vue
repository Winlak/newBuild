<template>
  <Teleport to="body">
    <Transition name="request-modal">
      <div
        v-if="isOpen"
        class="request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
        @click.self="closeModal"
      >
        <div class="request-modal__panel">
          <button
            type="button"
            class="request-modal__close"
            aria-label="Закрыть форму"
            @click="closeModal"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>

          <div class="request-modal__intro">
            <span class="request-modal__badge">
              <i class="bi bi-house-check" aria-hidden="true"></i>
              Новостройки НСК
            </span>

            <h2 id="request-modal-title">
              Оставить заявку
            </h2>

            <p>
              Заполните форму, и мы перезвоним в ближайшее время.
            </p>
          </div>

          <form class="request-modal__form" @submit.prevent="submitForm">
            <label>
              <span>Ваше имя</span>
              <input
                v-model.trim="form.name"
                type="text"
                placeholder="Иван"
                autocomplete="name"
                required
              >
            </label>

            <label>
              <span>Телефон</span>
              <input
                v-model.trim="form.phone"
                type="tel"
                placeholder="+7 999 999-99-99"
                autocomplete="tel"
                required
              >
            </label>

            <label class="request-modal__wide">
              <span>Комментарий</span>
              <textarea
                v-model.trim="form.comment"
                rows="4"
                placeholder="Расскажите где хотите жить и что для вас важно"
              ></textarea>
            </label>

            <label class="request-modal__policy">
              <input
                v-model="form.agree"
                type="checkbox"
                required
              >
              <span>
                Согласен на обработку персональных данных
              </span>
            </label>

            <button
              type="submit"
              class="request-modal__submit"
              :disabled="isLoading"
            >
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
              ></span>
              {{ isLoading ? 'Отправляем...' : 'Отправить заявку' }}
            </button>

            <p
              v-if="message"
              class="request-modal__message"
              :class="{ 'request-modal__message--error': isError }"
            >
              {{ message }}
            </p>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  phone: '',
  comment: '',
  agree: true,
})

const isOpen = ref(false)
const isLoading = ref(false)
const isError = ref(false)
const message = ref('')
const source = ref('request-modal')

const resetForm = () => {
  form.name = ''
  form.phone = ''
  form.comment = ''
  form.agree = true
}

const closeModal = () => {
  isOpen.value = false
  message.value = ''
  isError.value = false
}

const openModal = (event?: Event) => {
  const customEvent = event as CustomEvent<{ source?: string }>
  source.value = customEvent.detail?.source || 'request-modal'
  isOpen.value = true
  message.value = ''
  isError.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

watch(isOpen, (value) => {
  if (!import.meta.client) {
    return
  }

  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('open-request-modal', openModal)
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('open-request-modal', openModal)
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

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
        message: form.comment,
        source: source.value,
      },
    })

    message.value = 'Заявка отправлена. Мы скоро свяжемся с вами.'
    resetForm()
  } catch {
    message.value = 'Не удалось отправить заявку. Попробуйте позже.'
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.request-modal {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(7, 18, 61, 0.48);
  backdrop-filter: blur(10px);
}

.request-modal__panel {
  position: relative;
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  padding: 34px;
  border: 1px solid rgba(231, 237, 245, 0.96);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 90px rgba(7, 18, 61, 0.26);
}

.request-modal__close {
  position: absolute;
  top: 18px;
  right: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid #e1e9f5;
  border-radius: 12px;
  background: #fff;
  color: #647082;
  cursor: pointer;
}

.request-modal__intro {
  display: grid;
  gap: 10px;
  max-width: 560px;
  margin-bottom: 24px;
  padding-right: 48px;
}

.request-modal__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  color: #0d5bd7;
  font-size: 14px;
  font-weight: 900;
}

.request-modal__intro h2 {
  margin: 0;
  color: #07123d;
  font-size: clamp(28px, 4vw, 38px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: 0;
}

.request-modal__intro p {
  margin: 0;
  color: #647082;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.45;
}

.request-modal__form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.request-modal__form label {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.request-modal__form label span {
  color: #344054;
  font-size: 14px;
  font-weight: 900;
}

.request-modal__form input,
.request-modal__form textarea {
  width: 100%;
  border: 1px solid #dce4ef;
  border-radius: 14px;
  background: #fff;
  color: #07123d;
  font: inherit;
  font-weight: 700;
  outline: 0;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.request-modal__form input {
  min-height: 56px;
  padding: 15px 16px;
}

.request-modal__form textarea {
  resize: vertical;
  min-height: 128px;
  padding: 15px 16px;
}

.request-modal__form input:focus,
.request-modal__form textarea:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.12);
}

.request-modal__wide,
.request-modal__policy,
.request-modal__submit,
.request-modal__message {
  grid-column: 1 / -1;
}

.request-modal__policy {
  display: flex !important;
  grid-template-columns: none !important;
  flex-direction: row;
  align-items: flex-start;
  gap: 9px;
  color: #647082;
  font-size: 13px;
  font-weight: 700;
}

.request-modal__policy input {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  min-height: 0;
  margin-top: 2px;
}

.request-modal__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: fit-content;
  min-height: 54px;
  padding: 16px 34px;
  border: 1px solid #0d6efd;
  border-radius: 999px;
  background: #0d6efd;
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.request-modal__submit:hover {
  transform: translateY(-2px);
  background: #0b5ed7;
  box-shadow: 0 14px 30px rgba(13, 110, 253, 0.22);
}

.request-modal__submit:disabled {
  cursor: wait;
  opacity: 0.72;
  transform: none;
}

.request-modal__message {
  margin: 0;
  color: #0d6efd;
  font-size: 14px;
  font-weight: 800;
}

.request-modal__message--error {
  color: #dc3545;
}

.request-modal-enter-active,
.request-modal-leave-active {
  transition: opacity 0.18s ease;
}

.request-modal-enter-active .request-modal__panel,
.request-modal-leave-active .request-modal__panel {
  transition: transform 0.18s ease;
}

.request-modal-enter-from,
.request-modal-leave-to {
  opacity: 0;
}

.request-modal-enter-from .request-modal__panel,
.request-modal-leave-to .request-modal__panel {
  transform: translateY(12px);
}

@media (max-width: 575.98px) {
  .request-modal {
    align-items: end;
    padding: 12px;
  }

  .request-modal__panel {
    max-height: calc(100vh - 24px);
    padding: 24px 18px;
    border-radius: 20px;
  }

  .request-modal__intro {
    padding-right: 44px;
  }

  .request-modal__form {
    grid-template-columns: 1fr;
  }

  .request-modal__submit {
    width: 100%;
  }
}
</style>
