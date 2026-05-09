<template>
  <section class="why-section py-5">
    <div class="container">
      <div class="why-header text-center mx-auto mb-5">
        <span class="why-badge">
          Наши преимущества
        </span>

        <h2 class="why-title fw-bold mt-3 mb-3">
          Почему выбирают нас
        </h2>

        <p class="why-subtitle mb-0">
          Помогаем подобрать новостройку без лишнего стресса: проверяем объекты,
          условия сделки и сопровождаем вас до результата.
        </p>
      </div>

      <div class="row g-4">
        <div
          v-for="item in advantages"
          :key="item.title"
          class="col-12 col-md-6 col-xl-3"
        >
          <article class="why-card h-100">
            <div class="why-icon">
              <i :class="item.icon"></i>
            </div>

            <h3 class="why-card-title fw-bold mb-2">
              {{ item.title }}
            </h3>

            <p class="why-card-text mb-0">
              {{ item.text }}
            </p>
          </article>
        </div>
      </div>

      <div class="why-bottom mt-5">
        <div class="row align-items-center g-4">
          <div class="col-12 col-lg-8">
            <h3 class="why-bottom-title fw-bold mb-2">
              Подберём квартиру под ваш бюджет и цели
            </h3>

            <p class="why-bottom-text mb-0">
              Расскажем про районы, застройщиков, ипотеку, рассрочку и поможем
              выбрать надёжный вариант в Новосибирске.
            </p>
          </div>

          <div class="col-12 col-lg-4 text-lg-end">
            <NuxtLink to="/catalog" class="btn btn-primary btn-lg px-4">
              Смотреть варианты
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const advantages = [
  {
    icon: 'bi bi-shield-check',
    title: 'Безопасная сделка',
    text: 'Проверяем документы, застройщика и условия покупки перед сделкой.'
  },
  {
    icon: 'bi bi-building-check',
    title: 'Только актуальные ЖК',
    text: 'Подбираем реальные новостройки с актуальными ценами и условиями.'
  },
  {
    icon: 'bi bi-cash-coin',
    title: 'Помощь с ипотекой',
    text: 'Подскажем варианты ипотеки, рассрочки и программ без первого взноса.'
  },
  {
    icon: 'bi bi-person-check',
    title: 'Сопровождение бесплатно',
    text: 'Консультация, подбор и сопровождение для покупателя без комиссии.'
  }
]
</script>

<style scoped>
.why-section {
  background: #ffffff;
}

.why-header {
  max-width: 760px;
}

.why-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(13, 110, 253, 0.08);
  color: #0d6efd;
  font-size: 15px;
  font-weight: 700;
}

.why-title {
  color: #182033;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.12;
  letter-spacing: -0.03em;
}

.why-subtitle {
  color: #5f6b7a;
  font-size: 18px;
  line-height: 1.55;
}

.why-card {
  padding: 28px;
  border: 1px solid #edf0f4;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 16px 50px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
}

.why-card:hover {
  transform: translateY(-4px);
  border-color: rgba(13, 110, 253, 0.2);
  box-shadow: 0 22px 70px rgba(15, 23, 42, 0.1);
}

.why-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 22px;
  border-radius: 18px;
  background: linear-gradient(135deg, #0d6efd, #4da3ff);
  color: #fff;
  font-size: 26px;
}

.why-card-title {
  color: #182033;
  font-size: 21px;
  line-height: 1.25;
}

.why-card-text {
  color: #5f6b7a;
  font-size: 16px;
  line-height: 1.55;
}

.why-bottom {
  padding: 32px;
  border-radius: 32px;
  background:
    linear-gradient(135deg, rgba(13, 110, 253, 0.08), rgba(13, 110, 253, 0.02)),
    #f7f9fc;
  border: 1px solid #edf0f4;
}

.why-bottom-title {
  color: #182033;
  font-size: 28px;
  line-height: 1.2;
}

.why-bottom-text {
  max-width: 760px;
  color: #5f6b7a;
  font-size: 17px;
  line-height: 1.55;
}

@media (max-width: 767.98px) {
  .why-section {
    padding-top: 48px !important;
    padding-bottom: 48px !important;
  }

  .why-title {
    font-size: 32px;
  }

  .why-subtitle {
    font-size: 16px;
  }

  .why-card {
    padding: 24px;
    border-radius: 24px;
  }

  .why-icon {
    width: 52px;
    height: 52px;
    font-size: 24px;
  }

  .why-bottom {
    padding: 24px;
    border-radius: 24px;
  }

  .why-bottom-title {
    font-size: 24px;
  }

  .why-bottom .btn {
    width: 100%;
  }
}
</style>