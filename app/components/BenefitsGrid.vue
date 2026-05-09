<script setup lang="ts">
type BenefitIcon = 'percent' | 'shield' | 'bank' | 'handshake'

interface BenefitItem {
  icon: BenefitIcon
  title: string
  text: string
}

const items: BenefitItem[] = [
  {
    icon: 'percent',
    title: 'Честный подбор',
    text: 'Подбираем варианты, которые соответствуют вашим пожеланиям и бюджету.',
  },
  {
    icon: 'shield',
    title: 'Проверка застройщика',
    text: 'Проверяем документы, репутацию и надёжность каждого застройщика и проекта.',
  },
  {
    icon: 'bank',
    title: 'Ипотечное сопровождение',
    text: 'Подбираем выгодную ипотеку и помогаем с одобрением на лучших условиях.',
  },
  {
    icon: 'handshake',
    title: 'Поддержка до сделки и после',
    text: 'Сопровождаем на всех этапах — от выбора до получения ключей и оформления права собственности.',
  },
]
</script>

<template>
  <section class="benefits-section container">
    <div class="benefits-container">
      <article
        v-for="item in items"
        :key="item.title"
        class="benefits-card"
      >
        <div class="benefits-icon" aria-hidden="true">
          <svg
            v-if="item.icon === 'percent'"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path d="M43 17 21 47" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
            <circle cx="21" cy="21" r="6" stroke="currentColor" stroke-width="5" />
            <circle cx="43" cy="43" r="6" stroke="currentColor" stroke-width="5" />
          </svg>

          <svg
            v-else-if="item.icon === 'shield'"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M32 8 50 15v14c0 13-7.5 22.5-18 27-10.5-4.5-18-14-18-27V15L32 8Z"
              stroke="currentColor"
              stroke-width="4.5"
              stroke-linejoin="round"
            />
            <path
              d="m22 32 7 7 14-17"
              stroke="currentColor"
              stroke-width="4.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <svg
            v-else-if="item.icon === 'bank'"
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M12 25 32 13l20 12"
              stroke="currentColor"
              stroke-width="4.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M16 27h32" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
            <path d="M20 27v19M29 27v19M38 27v19M47 27v19" stroke="currentColor" stroke-width="4.5" />
            <path d="M14 46h36M10 53h44" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
          </svg>

          <svg
            v-else
            viewBox="0 0 64 64"
            fill="none"
          >
            <path
              d="M20 35 28 43c2.5 2.5 6.5 2.5 9 0l16-16"
              stroke="currentColor"
              stroke-width="4.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10 27h10l8-7c2.7-2.4 6.8-2.4 9.5 0l3 2.6"
              stroke="currentColor"
              stroke-width="4.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10 27v14l10 10 6-6M54 27v14l-8 8"
              stroke="currentColor"
              stroke-width="4.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div class="benefits-content">
          <h3 class="benefits-title">
            {{ item.title }}
          </h3>

          <p class="benefits-text">
            {{ item.text }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.benefits-section {
  padding: 30px 0;
  background: #fff;
}

.benefits-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  margin: 0 auto;
}

.benefits-card {
  display: flex;
  align-items: flex-start;
  gap: 22px;
  min-height: 250px;
  padding: 48px 30px 34px;
  background: #fff;
  border: 1px solid #edf1f6;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(14, 30, 62, 0.055);
}

.benefits-icon {
  display: flex;
  flex: 0 0 45px;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  color: #0057ff;
  background: #f3f6fc;
  border-radius: 50%;
}

.benefits-icon svg {
  width: 48px;
  height: 48px;
}

.benefits-content {
  max-width: 255px;
  padding-top: 5px;
}

.benefits-title {
  margin: 0 0 20px;
  color: #061747;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.benefits-text {
  margin: 0;
  color: #707887;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.55;
}

@media (max-width: 1600px) {
  .benefits-title {
    font-size: 19px;
  }

  .benefits-text {
    font-size: 14px;
  }
}

@media (max-width: 767.98px) {
  .benefits-title {
    margin-bottom: 10px;
    font-size: 18px;
  }

  .benefits-text {
    font-size: 14px;
  }
}

@media (max-width: 1600px) {
  .benefits-container {
    width: calc(100% - 48px);
  }

  .benefits-card {
    padding: 38px 24px 30px;
  }

}

@media (max-width: 1199.98px) {
  .benefits-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .benefits-card {
    min-height: 210px;
  }

  .benefits-content {
    max-width: none;
  }
}

@media (max-width: 767.98px) {
  .benefits-container {
    grid-template-columns: 1fr;
    width: calc(100% - 32px);
  }

  .benefits-card {
    gap: 18px;
    min-height: auto;
    padding: 24px 20px;
  }

  .benefits-icon {
    flex-basis: 60px;
    width: 60px;
    height: 60px;
  }

  .benefits-icon svg {
    width: 40px;
    height: 40px;
  }


}
</style>