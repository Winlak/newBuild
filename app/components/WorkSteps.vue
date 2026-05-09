<script setup lang="ts">
type StepIcon = 'chat' | 'search' | 'calendar' | 'document'

interface StepItem {
  icon: StepIcon
  number: number
  title: string
  text: string
}

withDefaults(
  defineProps<{
    title?: string
    steps?: StepItem[]
  }>(),
  {
    title: 'Как мы работаем',
    steps: () => [
      {
        icon: 'chat',
        number: 1,
        title: 'Выясняем задачу',
        text: 'Знакомимся, обсуждаем ваши цели, пожелания и бюджет.',
      },
      {
        icon: 'search',
        number: 2,
        title: 'Подбираем варианты',
        text: 'Анализируем рынок и предлагаем лучшие актуальные варианты.',
      },
      {
        icon: 'calendar',
        number: 3,
        title: 'Организуем показы',
        text: 'Проводим показы объектов и помогаем сравнить варианты.',
      },
      {
        icon: 'document',
        number: 4,
        title: 'Сопровождаем сделку',
        text: 'Проверяем документы, помогаем с оформлением и получением ключей.',
      },
    ],
  }
)
</script>

<template>
  <section class="work-steps">
    <div class="work-steps__container">
      <h2 class="work-steps__title">
        {{ title }}
      </h2>

      <div class="work-steps__grid">
        <article
          v-for="(step, index) in steps"
          :key="step.number"
          class="work-step-card"
        >
          <div class="work-step-card__icon" aria-hidden="true">
            <svg
              v-if="step.icon === 'chat'"
              viewBox="0 0 48 48"
              fill="none"
            >
              <path
                d="M13 13.5C16.2 10.7 20.5 9 25 9c8.8 0 16 5.8 16 13s-7.2 13-16 13c-2.4 0-4.6-.4-6.7-1.2L10 37l2.2-6.5C9.6 28.4 8 25.4 8 22c0-2.8 1.1-5.4 3-7.5"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 22h.1M25 22h.1M31 22h.1"
                stroke="currentColor"
                stroke-width="3.5"
                stroke-linecap="round"
              />
            </svg>

            <svg
              v-else-if="step.icon === 'search'"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle
                cx="21"
                cy="21"
                r="10"
                stroke="currentColor"
                stroke-width="2.8"
              />
              <path
                d="M28.5 28.5L38 38"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linecap="round"
              />
              <path
                d="M18 20.5C18.8 18.6 20.7 17.3 22.9 17.3C25.8 17.3 28.2 19.7 28.2 22.6"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linecap="round"
              />
            </svg>

            <svg
              v-else-if="step.icon === 'calendar'"
              viewBox="0 0 48 48"
              fill="none"
            >
              <path
                d="M15 8v6M33 8v6"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linecap="round"
              />
              <rect
                x="8"
                y="11"
                width="32"
                height="28"
                rx="5"
                stroke="currentColor"
                stroke-width="2.8"
              />
              <path
                d="M8 18h32"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linecap="round"
              />
              <path
                d="M18 28l4 4 8-9"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <svg
              v-else
              viewBox="0 0 48 48"
              fill="none"
            >
              <path
                d="M16 6h12l8 8v22a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linejoin="round"
              />
              <path
                d="M28 6v10h10"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linejoin="round"
              />
              <path
                d="M18 21h12M18 27h9"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linecap="round"
              />
              <path
                d="M27 32l3 3 6-7"
                stroke="currentColor"
                stroke-width="2.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div class="work-step-card__header">
            <span class="work-step-card__number">
              {{ step.number }}
            </span>

            <h3 class="work-step-card__title">
              {{ step.title }}
            </h3>
          </div>

          <p class="work-step-card__text">
            {{ step.text }}
          </p>

          <div
            v-if="index !== steps.length - 1"
            class="work-step-card__connector"
            aria-hidden="true"
          />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work-steps {
  padding: 36px 0;
}

.work-steps__container {
  width: min(100% - 48px, 1360px);
  margin: 0 auto;
  padding: 32px 28px 28px;
  background: #ffffff;
  border: 1px solid #e9eef6;
  border-radius: 28px;
}

.work-steps__title {
  margin: 0 0 24px;
  color: #091b4d;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.work-steps__grid {
  --card-gap: 18px;

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--card-gap);
}

.work-step-card {
  position: relative;
  min-height: 220px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e9eef6;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(18, 38, 63, 0.04);
}

.work-step-card__icon {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 44px;
  height: 44px;
  margin-bottom: 18px;
  color: #165dff;
}

.work-step-card__icon svg {
  width: 44px;
  height: 44px;
}

.work-step-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.work-step-card__number {
  display: inline-flex;
  flex: 0 0 30px;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #ffffff;
  background: #165dff;
  border-radius: 50%;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
}

.work-step-card__title {
  margin: 0;
  color: #091b4d;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.015em;
}

.work-step-card__text {
  margin: 0;
  color: #6d778a;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.55;
}

.work-step-card__connector {
  position: absolute;
  top: 61px;
  right: calc((var(--card-gap) / 2 + 12px) * -1);
  z-index: 2;
  width: calc(var(--card-gap) + 11px);
  height: 10px;
  pointer-events: none;
}

.work-step-card__connector::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 8px;
  right: 8px;
  height: 2px;
  background-image: linear-gradient(to right, #c7d7ff 50%, transparent 50%);
  background-size: 8px 2px;
  background-repeat: repeat-x;
  transform: translateY(-50%);
}

.work-step-card__connector::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 8px;
  height: 8px;
  background: #c7d7ff;
  border-radius: 50%;
  transform: translateY(-50%);
  box-shadow: calc(var(--card-gap) + 8px) 0 0 0 #c7d7ff;
}

@media (max-width: 1399.98px) {
  .work-steps__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .work-step-card__connector {
    display: none;
  }
}

@media (max-width: 767.98px) {
  .work-steps {
    padding: 24px 0;
  }

  .work-steps__container {
    width: calc(100% - 24px);
    padding: 22px 14px 14px;
    border-radius: 20px;
  }

  .work-steps__title {
    margin-bottom: 18px;
    font-size: 24px;
  }

  .work-steps__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .work-step-card {
    min-height: auto;
    padding: 18px;
    border-radius: 16px;
  }

  .work-step-card__icon {
    width: 38px;
    height: 38px;
    margin-bottom: 14px;
  }

  .work-step-card__icon svg {
    width: 38px;
    height: 38px;
  }

  .work-step-card__header {
    gap: 10px;
    margin-bottom: 12px;
  }

  .work-step-card__number {
    flex-basis: 28px;
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .work-step-card__title {
    font-size: 17px;
  }

  .work-step-card__text {
    font-size: 14px;
  }
}
</style>