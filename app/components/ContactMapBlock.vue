<script setup lang="ts">
interface TransportItem {
  type: 'metro' | 'bus' | 'parking'
  label: string
  value: string
}

withDefaults(defineProps<{
  mapImage?: string
  title?: string
  description?: string
  markerTitle?: string
  markerAddress?: string
  transport?: TransportItem[]
}>(), {
  mapImage: 'content/MapIMG.webp',
  title: 'Как нас найти',
  description: 'Офис находится в центре Новосибирска. Удобный подъезд и парковка рядом.',
  markerTitle: 'Новостройки НСК',
  markerAddress: 'ул. Депутатская, 46, 1 этаж',
  transport: () => [
    {
      type: 'metro',
      label: 'Метро:',
      value: 'пл. Ленина — 10 мин пешком',
    },
    {
      type: 'bus',
      label: 'Автобусы:',
      value: '13, 24, 28, 50, 54, 64',
    },
    {
      type: 'parking',
      label: 'Парковка:',
      value: 'бесплатная рядом с офисом',
    },
  ],
})
</script>

<template>
  <section class="contacts-map-section">
    <div class="container">
      <article
        class="contacts-map-card"
        :style="{ backgroundImage: `url(${mapImage})` }"
      >
        <div class="contacts-map-overlay">
          <div class="contacts-info">
            <h2>{{ title }}</h2>
            <p class="contacts-description">
              {{ description }}
            </p>

            <ul class="contacts-list">
              <li
                v-for="item in transport"
                :key="item.type"
                class="contacts-list-item"
              >
                <span class="contacts-icon">
                  <svg
                    v-if="item.type === 'metro'"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <path d="M7 17L9.2 7H10.7L12 12.3L13.3 7H14.8L17 17" />
                  </svg>

                  <svg
                    v-else-if="item.type === 'bus'"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M6 4H18C19.1 4 20 4.9 20 6V16C20 17.1 19.1 18 18 18H6C4.9 18 4 17.1 4 16V6C4 4.9 4.9 4 6 4Z" />
                    <path d="M6 9H18" />
                    <path d="M7 18V20" />
                    <path d="M17 18V20" />
                    <circle cx="8" cy="15" r="1" />
                    <circle cx="16" cy="15" r="1" />
                  </svg>

                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect x="4" y="7" width="16" height="13" rx="3" />
                    <path d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7" />
                    <path d="M9 17V10H12.5C14.2 10 15.5 11.3 15.5 13C15.5 14.7 14.2 16 12.5 16H9" />
                  </svg>
                </span>

                <span>
                  <strong>{{ item.label }}</strong>
                  {{ item.value }}
                </span>
              </li>
            </ul>
          </div>

          <div class="contacts-marker">
            <div class="marker-pin">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22C12 22 19 15.4 19 9C19 5.1 15.9 2 12 2C8.1 2 5 5.1 5 9C5 15.4 12 22 12 22Z" />
                <circle cx="12" cy="9" r="3" />
              </svg>
            </div>

            <div class="marker-card">
              <strong>{{ markerTitle }}</strong>
              <span>{{ markerAddress }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.contacts-map-section {
  padding: 24px 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0) 0, #f7faff 150px, #fff 100%);
}

.contacts-map-card {
  position: relative;
  min-height: 330px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 28px;
  background-color: #eef2f7;
  background-position: center;
  background-size: cover;
  box-shadow: 0 18px 55px rgba(15, 23, 42, 0.08);
}

.contacts-map-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 36px 62px;
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(255, 255, 255, 0.94) 28%,
      rgba(255, 255, 255, 0.55) 45%,
      rgba(255, 255, 255, 0.12) 72%,
      rgba(255, 255, 255, 0.05) 100%
    );
}

.contacts-info {
  position: relative;
  z-index: 2;
  max-width: 480px;
}

.contacts-info h2 {
  margin: 0 0 16px;
  color: #071335;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.15;
}

.contacts-description {
  max-width: 430px;
  margin: 0 0 28px;
  color: #4b5563;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.45;
}

.contacts-list {
  display: grid;
  gap: 17px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.contacts-list-item {
  display: flex;
  align-items: center;
  gap: 18px;
  color: #4b5563;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.3;
}

.contacts-list-item strong {
  color: #071335;
  font-weight: 800;
}

.contacts-icon {
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  color: #005ee6;
}

.contacts-icon svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.contacts-marker {
  position: absolute;
  top: 78px;
  left: 56%;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 15px 22px 15px 18px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.2);
}

.contacts-marker::after {
  content: '';
  position: absolute;
  left: 28px;
  bottom: -12px;
  width: 24px;
  height: 24px;
  background: #ffffff;
  transform: rotate(45deg);
  border-radius: 4px;
}

.marker-pin {
  position: relative;
  z-index: 2;
  flex: 0 0 54px;
  width: 54px;
  height: 54px;
  color: #1682f1;
}

.marker-pin svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.marker-pin circle {
  fill: #ffffff;
}

.marker-card {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 4px;
}

.marker-card strong {
  color: #005ee6;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
}

.marker-card span {
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.25;
}

@media (max-width: 991.98px) {
  .contacts-map-card {
    min-height: 520px;
  }

  .contacts-map-overlay {
    align-items: flex-start;
    padding: 32px;
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.9) 48%,
        rgba(255, 255, 255, 0.2) 100%
      );
  }

  .contacts-marker {
    top: auto;
    left: 32px;
    right: 32px;
    bottom: 36px;
    width: auto;
  }
}

@media (max-width: 575.98px) {
  .contacts-map-section {
    padding: 16px 0;
  }

  .contacts-map-card {
    min-height: 560px;
    border-radius: 22px;
  }

  .contacts-map-overlay {
    padding: 24px;
  }

  .contacts-info h2 {
    font-size: 26px;
  }

  .contacts-description {
    margin-bottom: 22px;
    font-size: 15px;
  }

  .contacts-list-item {
    gap: 12px;
    font-size: 15px;
  }

  .contacts-icon {
    flex-basis: 24px;
    width: 24px;
    height: 24px;
  }

  .contacts-marker {
    left: 18px;
    right: 18px;
    bottom: 24px;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 18px;
  }

  .marker-pin {
    flex-basis: 44px;
    width: 44px;
    height: 44px;
  }

  .marker-card strong {
    font-size: 16px;
  }

  .marker-card span {
    font-size: 13px;
  }
}
</style>