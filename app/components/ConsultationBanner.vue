<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  buttonText?: string
  to?: string
}>(), {
  title: 'Нужна консультация сегодня?',
  subtitle: 'Оставьте заявку — перезвоним и ответим на все вопросы',
  buttonText: 'Получить консультацию',
  to: '',
})

const emit = defineEmits<{
  consultationClick: []
}>()

const handleClick = () => {
  openRequestModal({ source: 'consultation-banner' })
  emit('consultationClick')
}
</script>

<template>
  <section class="consultation-section">
    <div class="container">
      <div class="consultation-banner">
        <div class="buildings buildings-left" aria-hidden="true" />
        <div class="buildings buildings-right" aria-hidden="true" />

        <div class="consultation-content">
          <div class="consultation-text">
            <h2>{{ title }}</h2>
            <p>{{ subtitle }}</p>
          </div>

          <NuxtLink
            v-if="to"
            :to="to"
            class="consultation-btn"
          >
            <span>{{ buttonText }}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12H19" />
              <path d="M13 6L19 12L13 18" />
            </svg>
          </NuxtLink>

          <button
            v-else
            type="button"
            class="consultation-btn"
            @click="handleClick"
          >
            <span>{{ buttonText }}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12H19" />
              <path d="M13 6L19 12L13 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.consultation-section {
  padding: 24px 0;
  background:  linear-gradient(180deg, rgba(255, 255, 255, 0) 0, #f7faff 150px, #fff 100%);
}

.consultation-banner {
  position: relative;
  overflow: hidden;
  min-height: 126px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 20% 0%, rgba(77, 160, 255, 0.75), transparent 34%),
    linear-gradient(135deg, #0058de 0%, #0876f2 48%, #0052d8 100%);
  box-shadow:
    0 18px 42px rgba(0, 94, 230, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.28);
}

.consultation-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  min-height: 126px;
  padding: 28px 180px 28px 170px;
}

.consultation-text h2 {
  margin: 0 0 8px;
  color: #ffffff;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.consultation-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
}

.consultation-btn {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 26px;
  min-width: 360px;
  min-height: 62px;
  padding: 16px 34px;
  border: 0;
  border-radius: 10px;
  background: #ffffff;
  color: #0046b8;
  text-decoration: none;
  box-shadow:
    0 10px 24px rgba(0, 28, 80, 0.18),
    inset 0 0 0 1px rgba(0, 94, 230, 0.08);
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.consultation-btn:hover {
  transform: translateY(-2px);
  background: #f8fbff;
  color: #0046b8;
  box-shadow:
    0 14px 30px rgba(0, 28, 80, 0.22),
    inset 0 0 0 1px rgba(0, 94, 230, 0.12);
}

.consultation-btn svg {
  width: 30px;
  height: 30px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.buildings {
  position: absolute;
  bottom: 0;
  z-index: 1;
  width: 180px;
  height: 96px;
  opacity: 0.16;
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: contain;
  pointer-events: none;
}

.buildings-left {
  left: 18px;
  background-image: url("data:image/svg+xml,%3Csvg width='180' height='96' viewBox='0 0 180 96' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF'%3E%3Cpath d='M0 32L40 12L78 32V96H0V32Z'/%3E%3Cpath d='M92 42L128 24L164 42V96H92V42Z'/%3E%3Cpath d='M144 52H180V96H144V52Z'/%3E%3C/g%3E%3Cg fill='%230052D8' opacity='.45'%3E%3Crect x='14' y='42' width='8' height='8'/%3E%3Crect x='32' y='42' width='8' height='8'/%3E%3Crect x='50' y='42' width='8' height='8'/%3E%3Crect x='14' y='62' width='8' height='8'/%3E%3Crect x='32' y='62' width='8' height='8'/%3E%3Crect x='50' y='62' width='8' height='8'/%3E%3Crect x='106' y='52' width='8' height='8'/%3E%3Crect x='124' y='52' width='8' height='8'/%3E%3Crect x='142' y='52' width='8' height='8'/%3E%3Crect x='106' y='72' width='8' height='8'/%3E%3Crect x='124' y='72' width='8' height='8'/%3E%3Crect x='142' y='72' width='8' height='8'/%3E%3C/g%3E%3C/svg%3E");
}

.buildings-right {
  right: 22px;
  width: 240px;
  height: 118px;
  opacity: 0.18;
  background-image: url("data:image/svg+xml,%3Csvg width='240' height='118' viewBox='0 0 240 118' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF'%3E%3Cpath d='M8 32L62 10L116 32V118H8V32Z'/%3E%3Cpath d='M104 48L148 26L192 48V118H104V48Z'/%3E%3Cpath d='M178 28L218 8L240 20V118H178V28Z'/%3E%3C/g%3E%3Cg fill='%230052D8' opacity='.45'%3E%3Crect x='28' y='44' width='9' height='9'/%3E%3Crect x='52' y='44' width='9' height='9'/%3E%3Crect x='76' y='44' width='9' height='9'/%3E%3Crect x='28' y='68' width='9' height='9'/%3E%3Crect x='52' y='68' width='9' height='9'/%3E%3Crect x='76' y='68' width='9' height='9'/%3E%3Crect x='122' y='60' width='9' height='9'/%3E%3Crect x='146' y='60' width='9' height='9'/%3E%3Crect x='170' y='60' width='9' height='9'/%3E%3Crect x='122' y='84' width='9' height='9'/%3E%3Crect x='146' y='84' width='9' height='9'/%3E%3Crect x='170' y='84' width='9' height='9'/%3E%3Crect x='194' y='42' width='8' height='8'/%3E%3Crect x='214' y='42' width='8' height='8'/%3E%3Crect x='194' y='66' width='8' height='8'/%3E%3Crect x='214' y='66' width='8' height='8'/%3E%3C/g%3E%3C/svg%3E");
}

@media (max-width: 1199.98px) {
  .consultation-content {
    padding: 28px 90px;
  }

  .consultation-text h2 {
    font-size: 30px;
  }

  .consultation-btn {
    min-width: 320px;
  }
}

@media (max-width: 991.98px) {
  .consultation-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 22px;
    padding: 32px;
  }

  .consultation-text h2 {
    font-size: 28px;
  }

  .consultation-text p {
    font-size: 16px;
  }

  .consultation-btn {
    width: 100%;
    min-width: 0;
  }

  .buildings-left {
    opacity: 0.1;
  }

  .buildings-right {
    opacity: 0.12;
  }
}

@media (max-width: 575.98px) {
  .consultation-section {
    padding: 16px 0;
  }

  .consultation-banner {
    border-radius: 16px;
  }

  .consultation-content {
    padding: 26px 20px;
  }

  .consultation-text h2 {
    font-size: 24px;
  }

  .consultation-text p {
    font-size: 14px;
  }

  .consultation-btn {
    min-height: 56px;
    padding: 15px 20px;
    gap: 14px;
    font-size: 15px;
  }

  .consultation-btn svg {
    width: 24px;
    height: 24px;
  }
}
</style>
