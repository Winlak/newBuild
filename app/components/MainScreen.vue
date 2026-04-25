<template>
  <section class="hero-section d-flex align-items-center justify-content-center py-5">
    <div class="container text-center">
      <!-- Заголовок и подзаголовок (из контента сайта) -->
      <h1 class="display-4 fw-bold mb-3">
        Бесплатный сервис по подбору новостроек в Новосибирске
      </h1>
      <p class="lead text-secondary mb-4 mx-auto" style="max-width: 720px;">
        Гарантия чистоты сделки и защиты ваших интересов! Найдем идеальную квартиру по вашим критериям.
      </p>

      <!-- Строка поиска -->
      <div class="row justify-content-center mb-4">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control border-0 py-3"
              placeholder="Введите район, метро или ЖК..."
              @keyup.enter="handleSearch"
            />
            <button class="btn btn-primary px-4 fw-medium" @click="handleSearch">
              Найти
            </button>
          </div>
        </div>
      </div>

      <!-- Быстрые фильтры -->
      <div class="d-flex flex-wrap justify-content-center gap-2 mb-4">
        <button
          v-for="filter in quickFilters"
          :key="filter.id"
          @click="toggleFilter(filter.id)"
          :class="[
            'btn rounded-pill px-3 py-2 fw-medium transition-all',
            selectedFilters.includes(filter.id)
              ? 'btn-primary shadow-sm'
              : 'btn-outline-secondary'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Расширенные фильтры + телефон -->
      <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 text-secondary">
        <button @click="goToAdvancedFilters" class="btn btn-link text-decoration-none p-0 fw-medium d-flex align-items-center gap-1">
          <i class="bi bi-sliders"></i> Посмотреть на карте
        </button>
        <span class="d-none d-sm-block">|</span>
        <a href="tel:89628355521" class="text-decoration-none fw-medium text-secondary hover-primary">
          📞 8 962 835-55-21
        </a>
        <span class="d-none d-sm-block">|</span>
        <a href="tel:83832555521" class="text-decoration-none fw-medium text-secondary hover-primary">
        📞 8 383 255-55-21
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
const searchQuery = ref('')
const selectedFilters = ref([])

const quickFilters = [
  { id: 'renovation', label: 'С ремонтом' },
  { id: 'furniture', label: 'С мебелью' },
  { id: 'installment', label: 'С рассрочкой' },
  { id: 'mortgage_no_dp', label: 'Ипотека Без ПВ' },
  { id: 'completed', label: 'Дом сдан' },
  { id: 'studio', label: 'Студии' }
]

const toggleFilter = (id) => {
  if (selectedFilters.value.includes(id)) {
    selectedFilters.value = selectedFilters.value.filter(f => f !== id)
  } else {
    selectedFilters.value.push(id)
  }
}

const handleSearch = () => {
  const query = {
    ...(searchQuery.value.trim() && { district: searchQuery.value.trim() }),
    ...(selectedFilters.value.length && { filters: selectedFilters.value.join(',') })
  }
  navigateTo({ path: '/catalog', query })
}

const goToAdvancedFilters = () => {
  navigateTo({ path: '/catalog', query: { advanced: 'true' } })
}
</script>

<style scoped>
.hero-section {
  min-height: 560px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
.hover-primary:hover {
  color: #0d6efd !important;
}
/* Плавные переходы для кнопок фильтров */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>