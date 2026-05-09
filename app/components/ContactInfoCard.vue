<template>
  <div class="contact-card contact-info-card">
    <div class="contact-card__header">
      <h2 class="contact-card__title">
        Наши контакты
      </h2>

      <p class="contact-card__lead">
        Приходите в офис, звоните или пишите в удобный мессенджер.
      </p>
    </div>

    <div class="contact-info-list">
      <div class="contact-info-item contact-info-item--address">
        <div class="contact-info-icon">
          <i class="bi bi-geo-alt-fill" aria-hidden="true"></i>
        </div>

        <div class="contact-info-content">
          <h3>Офис в Новосибирске</h3>
          <p>
            630099, г. Новосибирск,<br>
            ул. Депутатская, 46, 1 этаж
          </p>
        </div>

        <a
          href="https://yandex.ru/maps/?text=Новосибирск, Депутатская 46"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-route-btn"
        >
          Построить маршрут
        </a>
      </div>

      <div class="contact-info-item contact-info-item--schedule">
        <div class="contact-info-icon">
          <i class="bi bi-clock-fill" aria-hidden="true"></i>
        </div>

        <div class="contact-info-content">
          <h3>Режим работы</h3>
          <p>
            Пн – Пт: 10:00 – 19:00<br>
            Сб – Вс: 10:00 – 16:00
          </p>
        </div>
      </div>

      <div class="contact-info-item contact-info-item--phone">
        <div class="contact-info-icon">
          <i class="bi bi-telephone-fill" aria-hidden="true"></i>
        </div>

        <div class="contact-info-content">
          <h3>Телефон</h3>
          <p>
            <a href="tel:83832555521">+7 (383) 255-55-21</a><br>
            <a href="tel:79628355521">+7 (962) 835-55-21</a>
          </p>
        </div>

        <div class="contact-socials">
          <a
            href="https://wa.me/79628355521"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-social contact-social-whatsapp"
            aria-label="WhatsApp"
          >
            <FontAwesomeIcon :icon="['fab', 'whatsapp']" />
          </a>

          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-social contact-social-telegram"
            aria-label="Telegram"
          >
            <FontAwesomeIcon :icon="['fab', 'telegram']" />
          </a>

          <a
            href="tel:83832555521"
            class="contact-social"
            aria-label="Позвонить"
          >
            <i class="bi bi-telephone-fill" aria-hidden="true"></i>
          </a>
        </div>
      </div>

      <div class="contact-info-item contact-info-item--email">
        <div class="contact-info-icon">
          <i class="bi bi-envelope-fill" aria-hidden="true"></i>
        </div>

        <div class="contact-info-content">
          <h3>Электронная почта</h3>
          <p>
            <a href="mailto:info@nsk-novostroyki.ru">
              info@nsk-novostroyki.ru
            </a>
          </p>
        </div>

        <button
          type="button"
          class="contact-copy-btn"
          :aria-label="isEmailCopied ? 'Email скопирован' : 'Скопировать email'"
          @click="copyEmail"
        >
          <i
            class="bi"
            :class="isEmailCopied ? 'bi-check-lg' : 'bi-copy'"
            aria-hidden="true"
          ></i>
        </button>
      </div>
    </div>

    <div class="contact-safe-note">
      <div class="contact-safe-note__icon">
        <i class="bi bi-shield-check" aria-hidden="true"></i>
      </div>

      <p>
        Консультация бесплатна и ни к чему не обязывает.<br>
        Гарантируем юридическую чистоту и безопасность сделки.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = 'info@nsk-novostroyki.ru'
const isEmailCopied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const copyEmail = async () => {
  if (!import.meta.client) {
    return
  }

  await navigator.clipboard.writeText(email)
  isEmailCopied.value = true

  if (copyTimer) {
    clearTimeout(copyTimer)
  }

  copyTimer = setTimeout(() => {
    isEmailCopied.value = false
  }, 1800)
}
</script>

<style scoped>
.contact-card {
  min-width: 0;
  padding: 34px;
  border: 1px solid rgba(210, 222, 239, 0.9);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.94);
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

.contact-card__lead {
  max-width: 520px;
  margin: 10px 0 0;
  color: #667386;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: break-word;
}

.contact-info-list {
  display: grid;
  gap: 12px;
}

.contact-info-item {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto;
  gap: 18px 20px;
  align-items: center;
  min-height: 96px;
  padding: 18px;
  border: 1px solid #e1e9f4;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff, #f9fbff);
}

.contact-info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #eef5ff;
  color: #0d6efd;
  font-size: 24px;
}

.contact-info-content h3 {
  margin: 0 0 6px;
  color: #07123d;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.25;
}

.contact-info-content p {
  margin: 0;
  color: #657184;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.45;
}

.contact-info-content a {
  color: inherit;
  text-decoration: none;
}

.contact-info-content a:hover {
  color: #0d6efd;
}

.contact-route-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 10px 16px;
  border: 1px solid rgba(13, 110, 253, 0.38);
  border-radius: 10px;
  color: #0d6efd;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.contact-route-btn:hover {
  border-color: #0d6efd;
  background: #0d6efd;
  color: #fff;
}

.contact-socials {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contact-social,
.contact-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(13, 110, 253, 0.35);
  border-radius: 50%;
  background: #f8fbff;
  color: #0d6efd;
  font-size: 20px;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.contact-copy-btn {
  cursor: pointer;
}

.contact-social:hover,
.contact-copy-btn:hover {
  transform: translateY(-2px);
  border-color: #0d6efd;
  background: #0d6efd;
  color: #fff;
}

.contact-social-whatsapp {
  border-color: rgba(37, 211, 102, 0.45);
  color: #25d366;
}

.contact-social-whatsapp:hover {
  border-color: #25d366;
  background: #25d366;
}

.contact-social-telegram {
  border-color: rgba(34, 158, 217, 0.45);
  color: #229ed9;
}

.contact-social-telegram:hover {
  border-color: #229ed9;
  background: #229ed9;
}

.contact-safe-note {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 16px;
  align-items: center;
  margin-top: 16px;
  padding: 18px;
  border: 1px solid rgba(13, 110, 253, 0.2);
  border-radius: 16px;
  background: linear-gradient(135deg, #edf6ff, #f8fbff);
}

.contact-safe-note__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0d6efd;
  font-size: 28px;
}

.contact-safe-note p {
  margin: 0;
  color: #07123d;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
}

@media (max-width: 1199.98px) {
  .contact-card {
    padding: 30px;
  }

  .contact-info-item {
    grid-template-columns: 56px minmax(0, 1fr) auto;
  }
}

@media (max-width: 767.98px) {
  .contact-info-item {
    grid-template-columns: 52px minmax(0, 1fr);
  }

  .contact-route-btn,
  .contact-socials,
  .contact-copy-btn {
    grid-column: 2;
    justify-self: start;
  }
}

@media (max-width: 575.98px) {
  .contact-card {
    padding: 20px;
    border-radius: 18px;
  }

  .contact-info-item {
    grid-template-columns: 52px minmax(0, 1fr);
    gap: 14px;
    min-height: 0;
    padding: 16px;
  }

  .contact-info-icon {
    width: 52px;
    height: 52px;
    font-size: 24px;
  }

  .contact-info-content h3 {
    font-size: 17px;
  }

  .contact-info-content p {
    font-size: 15px;
    overflow-wrap: anywhere;
  }

  .contact-socials {
    gap: 12px;
    flex-wrap: wrap;
  }

  .contact-social,
  .contact-copy-btn {
    width: 48px;
    height: 48px;
    font-size: 21px;
  }

  .contact-safe-note {
    grid-template-columns: 42px 1fr;
    padding: 16px;
    border-radius: 14px;
  }

  .contact-safe-note p {
    font-size: 14px;
  }
}
</style>
