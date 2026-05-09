<script setup lang="ts">
type StatIcon = 'award' | 'users' | 'building' | 'ruble'

type StatItem = {
  icon: StatIcon
  value: string
  title: string
  text: string
}

type Props = {
  title?: string
  paragraphs?: string[]
  stats?: StatItem[]
}

withDefaults(defineProps<Props>(), {
  title: 'Помогаем выбрать новостройку без лишнего стресса',
  paragraphs: () => [
    'Мы знаем рынок новостроек Новосибирска изнутри и помогаем нашим клиентам сделать правильный выбор — быстро, безопасно и без переплат.',
    'Наша команда ежедневно анализирует предложения застройщиков, проверяет документы и условия, чтобы вы получили только актуальные варианты, которые действительно подходят именно вам.',
    'С нами вы экономите время, получаете экспертную поддержку на каждом этапе и уверенность в завтрашнем дне.',
  ],
  stats: () => [
    {
      icon: 'award',
      value: '7+ лет',
      title: 'опыта',
      text: 'Успешно помогаем выбирать новостройки с 2017 года',
    },
    {
      icon: 'users',
      value: '250+',
      title: 'семей',
      text: 'Уже купили квартиры с нашей помощью',
    },
    {
      icon: 'building',
      value: '50+',
      title: 'проверенных ЖК',
      text: 'Работаем только с надёжными застройщиками',
    },
    {
      icon: 'ruble',
      value: '0 ₽',
      title: 'комиссия для клиента',
      text: 'Наши услуги для вас абсолютно бесплатны',
    },
  ],
})
</script>

<template>
  <section class="about-intro">
    <div class="container">
      <div class="about-intro__box">
        <div class="about-intro__content">
          <h2 class="about-intro__title">
            {{ title }}
          </h2>

          <div class="about-intro__text">
            <p
              v-for="paragraph in paragraphs"
              :key="paragraph"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>

        <div class="about-intro__stats">
          <article
            v-for="stat in stats"
            :key="`${stat.value}-${stat.title}`"
            class="about-stat-card"
          >
            <div class="about-stat-card__icon">
              <svg
                v-if="stat.icon === 'award'"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path d="M32 6l5.3 4.6 6.9-1.3 2.4 6.5 6.4 2.6-1.4 6.8L56 30.5l-4.4 5.3 1.4 6.8-6.4 2.6-2.4 6.5-6.9-1.3L32 55l-5.3-4.6-6.9 1.3-2.4-6.5-6.4-2.6 1.4-6.8L8 30.5l4.4-5.3-1.4-6.8 6.4-2.6 2.4-6.5 6.9 1.3L32 6Z" />
                <path d="M27.5 54 22 62l-2.6-10" />
                <path d="M36.5 54 42 62l2.6-10" />
                <path d="m32 21.5 3 6.1 6.7 1-4.9 4.7 1.2 6.7-6-3.2-6 3.2 1.2-6.7-4.9-4.7 6.7-1 3-6.1Z" />
              </svg>

              <svg
                v-else-if="stat.icon === 'users'"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path d="M24 31c7.2 0 13-5.8 13-13S31.2 5 24 5 11 10.8 11 18s5.8 13 13 13Z" />
                <path d="M4 57c1.8-12 9-19 20-19s18.2 7 20 19H4Z" />
                <path d="M45 30c5.6 0 10-4.4 10-10s-4.4-10-10-10" />
                <path d="M43 39c9.6.4 15.2 6.7 17 18H48" />
              </svg>

              <svg
                v-else-if="stat.icon === 'building'"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path d="M10 58h44" />
                <path d="M15 58V10h28v48" />
                <path d="M43 28h11v30" />
                <path d="M23 20h4M31 20h4M23 30h4M31 30h4M23 40h4M31 40h4" />
                <path d="M49 38h2M49 47h2" />
              </svg>

              <svg
                v-else
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <circle cx="32" cy="32" r="25" />
                <path d="M25 17h13c6 0 10 3.7 10 9.3S44 36 38 36H25" />
                <path d="M25 17v30" />
                <path d="M18 36h20" />
                <path d="M18 46h25" />
              </svg>
            </div>

            <div class="about-stat-card__body">
              <div class="about-stat-card__value">
                {{ stat.value }}
              </div>

              <div class="about-stat-card__title">
                {{ stat.title }}
              </div>

              <p class="about-stat-card__text">
                {{ stat.text }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-intro {
  padding: 50px 0;
  background: #fff;
}

.about-intro__box {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(560px, 0.95fr);
  gap: clamp(38px, 5vw, 78px);
  padding: clamp(40px, 4.2vw, 62px);
  border: 1px solid rgba(7, 24, 64, 0.08);
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(12, 31, 70, 0.08);
}

.about-intro__content {
  max-width: 650px;
}

.about-intro__title {
  margin: 0 0 28px;
  color: #061638;
  font-size: clamp(30px, 3.2vw, 40px);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.045em;
}

.about-intro__text p {
  margin: 0 0 28px;
  color: #5d6a86;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.55;
}

.about-intro__text p:last-child {
  margin-bottom: 0;
}

.about-intro__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.about-stat-card {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 5px;
  min-height: 220px;
  padding: 34px 30px;
  overflow: hidden;
  border: 1px solid rgba(7, 24, 64, 0.08);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 34px rgba(12, 31, 70, 0.06);
}

.about-stat-card__icon {
  color: #005df6;
}

.about-stat-card__icon svg {
  display: block;
  width: 60px;
  height: 60px;
  fill: none;
  stroke: currentColor;
  stroke-width: 3.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.about-stat-card__body {
  min-width: 0;
}

.about-stat-card__value {
  margin-bottom: 4px;
  color: #061638;
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  white-space: nowrap;
}

.about-stat-card__title {
  margin-bottom: 10px;
  color: #061638;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.025em;
}

.about-stat-card__text {
  max-width: 230px;
  margin: 0;
  color: #5d6a86;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

@media (max-width: 1399.98px) {
  .about-intro__box {
    grid-template-columns: minmax(0, 1fr) minmax(500px, 0.9fr);
    gap: 44px;
  }

  .about-stat-card {
    grid-template-columns: 62px minmax(0, 1fr);
    gap: 18px;
    padding: 30px 24px;
  }

  .about-stat-card__icon svg {
    width: 58px;
    height: 58px;
  }

  .about-stat-card__value {
    font-size: 30px;
  }

  .about-stat-card__title {
    font-size: 23px;
  }
}

@media (max-width: 1199.98px) {
  .about-intro__box {
    grid-template-columns: 1fr;
  }

  .about-intro__content {
    max-width: 760px;
  }
}

@media (max-width: 767.98px) {
  .about-intro {
    padding: 36px 0;
  }

  .about-intro__box {
    padding: 28px;
    border-radius: 22px;
  }

  .about-intro__stats {
    grid-template-columns: 1fr;
  }

  .about-stat-card {
    min-height: auto;
  }
}

@media (max-width: 575.98px) {
  .about-intro__box {
    padding: 22px;
  }

  .about-intro__title {
    font-size: 28px;
  }

  .about-intro__text p {
    font-size: 17px;
    line-height: 1.5;
  }

  .about-stat-card {
    grid-template-columns: 52px minmax(0, 1fr);
    padding: 22px;
  }

  .about-stat-card__icon svg {
    width: 48px;
    height: 48px;
  }

  .about-stat-card__value {
    font-size: 34px;
  }

  .about-stat-card__title {
    margin-bottom: 14px;
    font-size: 21px;
  }

  .about-stat-card__text {
    font-size: 15px;
  }
}
</style>