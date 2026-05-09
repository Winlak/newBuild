<script setup lang="ts">
interface MapSpotlightStat {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  variant?: 'home' | 'catalog'
  contained?: boolean
  eyebrow?: string
  title?: string
  description?: string
  primaryLabel?: string
  stats?: MapSpotlightStat[]
}>(), {
  variant: 'home',
  contained: true,
  eyebrow: 'Карта новостроек',
  title: 'Посмотреть ЖК на карте',
  description: 'Оцените расположение комплексов относительно метро, центра, набережной и районов города прямо на карте.',
  primaryLabel: 'Смотреть на карте',
  stats: () => [
    { value: '6', label: 'ЖК в подборке' },
    { value: '540 м', label: 'минимум до метро' },
    { value: '4', label: 'района города' },
  ],
})

const emit = defineEmits<{
  (event: 'openMap'): void
}>()
</script>

<template>
  <section
    class="map-spotlight"
    :class="`map-spotlight--${props.variant}`"
  >
    <div :class="props.contained ? 'container' : 'map-spotlight__inner'">
      <div class="map-spotlight__shell">
        <div
          class="map-spotlight__map"
          aria-hidden="true"
        ></div>

        <div class="map-spotlight__fade" aria-hidden="true"></div>

        <div class="map-spotlight__content">
          <span class="map-spotlight__eyebrow">
            <i class="bi bi-geo-alt-fill" aria-hidden="true"></i>
            {{ props.eyebrow }}
          </span>

          <h2>{{ props.title }}</h2>
          <p>{{ props.description }}</p>

          <div class="map-spotlight__actions">
            <button
              type="button"
              class="map-spotlight__primary"
              @click="emit('openMap')"
            >
              <i class="bi bi-map" aria-hidden="true"></i>
              {{ props.primaryLabel }}
            </button>
          </div>

          <dl class="map-spotlight__stats">
            <div
              v-for="stat in props.stats"
              :key="`${stat.value}-${stat.label}`"
            >
              <dt>{{ stat.value }}</dt>
              <dd>{{ stat.label }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-spotlight {
  padding: 72px 0;
  background: #fff;
}

.map-spotlight--catalog {
  padding: 0 0 34px;
  background: transparent;
}

.map-spotlight__shell {
  position: relative;
  overflow: hidden;
  min-height: 520px;
  border: 1px solid #dfe8f4;
  border-radius: 24px;
  background: #eef3f8;
  box-shadow: 0 24px 70px rgba(14, 30, 62, 0.12);
}

.map-spotlight--catalog .map-spotlight__shell {
  min-height: 390px;
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(14, 30, 62, 0.08);
}

.map-spotlight__map {
  pointer-events: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(90deg, rgba(7, 18, 61, 0.08), rgba(7, 18, 61, 0.02)),
    url('/content/MapIMG.webp') center / cover no-repeat;
  transform: scale(1.02);
}

.map-spotlight__fade {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(7, 18, 61, 0.92) 0%, rgba(7, 18, 61, 0.72) 39%, rgba(7, 18, 61, 0.1) 78%),
    linear-gradient(180deg, rgba(7, 18, 61, 0.12), rgba(7, 18, 61, 0.38));
}

.map-spotlight__content {
  pointer-events: none;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  max-width: 560px;
  min-height: 520px;
  padding: 56px;
  color: #fff;
}

.map-spotlight--catalog .map-spotlight__content {
  max-width: 620px;
  min-height: 390px;
  padding: 42px;
}

.map-spotlight__eyebrow,
.map-spotlight__actions,
.map-spotlight__stats {
  pointer-events: auto;
}

.map-spotlight__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding: 9px 12px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 13px;
  font-weight: 900;
  line-height: 1;
  backdrop-filter: blur(10px);
}

.map-spotlight h2 {
  max-width: 520px;
  margin: 0 0 14px;
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 900;
  line-height: 1.06;
  letter-spacing: -0.035em;
}

.map-spotlight--catalog h2 {
  font-size: clamp(28px, 3vw, 40px);
}

.map-spotlight p {
  max-width: 500px;
  margin: 0 0 28px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.55;
}

.map-spotlight__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 30px;
}

.map-spotlight__primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 50px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
  text-decoration: none;
}

.map-spotlight__primary {
  padding: 14px 18px;
  border: 1px solid #fff;
  background: #fff;
  color: #0d5bd7;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
}

.map-spotlight__primary:hover {
  color: #0b5ed7;
  transform: translateY(-1px);
}

.map-spotlight__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  width: min(100%, 520px);
  margin: 0;
}

.map-spotlight__stats div {
  min-width: 0;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.11);
  backdrop-filter: blur(10px);
}

.map-spotlight__stats dt {
  margin: 0 0 4px;
  color: #fff;
  font-size: 21px;
  font-weight: 900;
  line-height: 1.1;
}

.map-spotlight__stats dd {
  margin: 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.25;
}

@media (max-width: 991.98px) {
  .map-spotlight {
    padding: 52px 0;
  }

  .map-spotlight--catalog {
    padding: 0 0 28px;
  }

  .map-spotlight__shell,
  .map-spotlight--catalog .map-spotlight__shell {
    min-height: 560px;
  }

  .map-spotlight__fade {
    background:
      linear-gradient(180deg, rgba(7, 18, 61, 0.88) 0%, rgba(7, 18, 61, 0.7) 46%, rgba(7, 18, 61, 0.12) 100%);
  }

  .map-spotlight__content,
  .map-spotlight--catalog .map-spotlight__content {
    min-height: 560px;
    padding: 34px;
  }
}

@media (max-width: 575.98px) {
  .map-spotlight {
    padding: 40px 0;
  }

  .map-spotlight--catalog {
    padding: 0 0 24px;
  }

  .map-spotlight__shell,
  .map-spotlight--catalog .map-spotlight__shell {
    min-height: 620px;
    border-radius: 18px;
  }

  .map-spotlight__content,
  .map-spotlight--catalog .map-spotlight__content {
    min-height: 620px;
    padding: 24px;
  }

  .map-spotlight h2,
  .map-spotlight--catalog h2 {
    font-size: 29px;
  }

  .map-spotlight p {
    font-size: 15px;
  }

  .map-spotlight__actions {
    width: 100%;
  }

  .map-spotlight__primary {
    width: 100%;
  }

  .map-spotlight__stats {
    grid-template-columns: 1fr;
  }
}
</style>
