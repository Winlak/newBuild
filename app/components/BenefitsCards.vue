<script setup lang="ts">
type BenefitIcon = 'percent' | 'shield' | 'bank' | 'deal'

interface BenefitItem {
  title: string
  text: string
  icon: BenefitIcon
}

const benefits: BenefitItem[] = [
  {
    title: 'Подбор без комиссии',
    text: 'Работаем напрямую с застройщиками. Услуги для вас полностью бесплатны.',
    icon: 'percent',
  },
  {
    title: 'Проверка застройщика',
    text: 'Проверяем документы, репутацию и надежность каждого проекта.',
    icon: 'shield',
  },
  {
    title: 'Помощь с ипотекой',
    text: 'Подберём выгодную ипотеку и поможем с одобрением.',
    icon: 'bank',
  },
  {
    title: 'Сопровождение сделки',
    text: 'Поддержим на всех этапах — от выбора до получения ключей.',
    icon: 'deal',
  },
]
</script>

<template>
  <section class="benefits-section">
    <div class="container">
      <div class="row g-3 g-xl-4">
        <div
          v-for="benefit in benefits"
          :key="benefit.title"
          class="col-12 col-md-6 col-xl-3"
        >
          <article class="benefit-card h-100">
            <div class="benefit-icon">
              <svg
                v-if="benefit.icon === 'percent'"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <circle cx="32" cy="32" r="25" />
                <path d="M22 42L42 22" />
                <circle cx="23" cy="24" r="4" />
                <circle cx="41" cy="40" r="4" />
              </svg>

              <svg
                v-else-if="benefit.icon === 'shield'"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path d="M32 8L50 15V29C50 42 42 52 32 57C22 52 14 42 14 29V15L32 8Z" />
                <path d="M23 32L29 38L42 24" />
              </svg>

              <svg
                v-else-if="benefit.icon === 'bank'"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path d="M10 24L32 12L54 24H10Z" />
                <path d="M16 28V46" />
                <path d="M27 28V46" />
                <path d="M38 28V46" />
                <path d="M49 28V46" />
                <path d="M12 50H52" />
                <path d="M9 56H55" />
              </svg>

              <svg
                v-else
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path d="M25 25L32 18C35 15 39 15 42 18L55 31C58 34 58 39 55 42L51 46" />
                <path d="M39 47L45 53C47 55 51 55 53 53C55 51 55 48 53 46L39 32" />
                <path d="M26 25L12 39C9 42 9 47 12 50C15 53 20 53 23 50L29 44" />
                <path d="M20 44L27 51" />
                <path d="M26 38L34 46" />
                <path d="M31 33L40 42" />
              </svg>
            </div>

            <div class="benefit-content">
              <h3>{{ benefit.title }}</h3>
              <p>{{ benefit.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.benefits-section {
  padding: 24px 0;
    background:
    linear-gradient(180deg, rgba(255, 255, 255, 0) 0, #f7faff 150px, #fff 100%);
}

.benefit-card {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 142px;
  padding: 28px 30px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 16px 45px rgba(15, 23, 42, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.benefit-card:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 94, 230, 0.16);
  box-shadow: 0 22px 55px rgba(15, 23, 42, 0.12);
}

.benefit-icon {
  flex: 0 0 70px;
  width: 70px;
  height: 70px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #edf4ff;
}

.benefit-icon svg {
  width: 52px;
  height: 52px;
  fill: none;
  stroke: #005ee6;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.benefit-content h3 {
  margin: 0 0 10px;
  color: #071335;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.25;
}

.benefit-content p {
  max-width: 260px;
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
}

@media (max-width: 575.98px) {
  .benefits-section {
    padding: 16px 0;
  }

  .benefit-card {
    align-items: flex-start;
    min-height: auto;
    padding: 22px;
    border-radius: 18px;
  }

  .benefit-icon {
    flex-basis: 58px;
    width: 58px;
    height: 58px;
  }

  .benefit-icon svg {
    width: 42px;
    height: 42px;
  }

  .benefit-content h3 {
    font-size: 16px;
  }

  .benefit-content p {
    font-size: 13px;
  }
}
</style>