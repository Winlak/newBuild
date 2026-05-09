<template>
  <header class="app-navbar">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <NuxtLink to="/" class="navbar-brand d-flex align-items-center gap-2">
          <span class="brand-icon">Н</span>
          <span class="brand-text">
            <span>Новостройки НСК</span>
            <span class="brand-separator" aria-hidden="true">|</span>
            <span class="brand-service">Бесплатный сервис</span>
          </span>
        </NuxtLink>

        <button
          class="navbar-toggler border-0 shadow-none"
          type="button"
          aria-label="Открыть меню"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          class="navbar-collapse"
          :class="{ show: isMenuOpen }"
        >
          <ul class="navbar-nav mx-auto mb-3 mb-lg-0">
            <li
              v-for="item in navItems"
              :key="item.to"
              class="nav-item"
            >
              <NuxtLink
                :to="item.hash ? { path: item.to, hash: item.hash } : item.to"
                class="nav-link"
                :class="{ active: isActiveNavItem(item) }"
                @click="isMenuOpen = false"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>

          <div class="navbar-actions d-flex align-items-center gap-2">
            <a href="tel:89628355521" class="phone-link d-lg-none">
              <i class="bi bi-telephone"></i>
              <span>8 962 835-55-21</span>
            </a>

            <button
              type="button"
              class="btn btn-primary rounded-pill px-4"
              @click="handleRequestClick"
            >
              Подобрать квартиру
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
type NavItem = {
  label: string
  to: string
  hash?: string
}

const route = useRoute()
const isMenuOpen = ref(false)

const navItems: NavItem[] = [
  { label: 'Главная', to: '/' },
  { label: 'Каталог', to: '/catalog' },
  { label: 'Контакты', to: '/contacts' },
  { label: 'О нас', to: '/about' }
]

const isActiveNavItem = (item: NavItem) => {
  if (item.hash) {
    return route.path === item.to && route.hash === item.hash
  }

  if (item.to === '/') {
    return route.path === '/' && !route.hash
  }

  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

const handleRequestClick = () => {
  isMenuOpen.value = false
  openRequestModal({ source: 'navbar' })
}
</script>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.navbar {
  min-height: 82px;
}

.navbar-brand {
  min-width: 0;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0d6efd, #4da3ff);
  color: #fff;
  font-size: 21px;
  font-weight: 800;
  line-height: 1;
}

.brand-text {
  flex: 1 1 auto;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 9px;
  min-width: 0;
  color: #182033;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.15;
}

.brand-separator {
  color: #cbd5e1;
  font-weight: 700;
}

.brand-service {
  color: #526071;
  font-size: 15px;
  font-weight: 700;
}

.navbar-nav {
  gap: 6px;
}

.nav-link {
  padding: 10px 16px !important;
  border-radius: 999px;
  color: #465364;
  font-weight: 700;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #0d6efd;
  background: rgba(13, 110, 253, 0.08);
}

.phone-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #465364;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.phone-link:hover {
  color: #0d6efd;
}

@media (max-width: 991.98px) {
  .navbar {
    min-height: 72px;
  }

  .navbar-collapse {
    display: none;
    padding: 18px 0 8px;
  }

  .navbar-collapse.show {
    display: block;
  }

  .navbar-nav {
    align-items: stretch;
    gap: 8px;
  }

  .nav-link {
    text-align: center;
    background: #f7f9fc;
  }

  .navbar-actions {
    flex-direction: column;
    align-items: stretch !important;
    margin-top: 16px;
  }

  .phone-link {
    justify-content: center;
    padding: 12px;
    border-radius: 999px;
    background: #f7f9fc;
  }

  .navbar-actions .btn {
    width: 100%;
  }
}

@media (max-width: 575.98px) {
  .navbar-brand {
    max-width: calc(100% - 78px);
    margin-right: 8px;
  }

  .brand-text {
    font-size: 16px;
    row-gap: 2px;
  }

  .brand-service {
    font-size: 13px;
  }

  .brand-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    font-size: 19px;
  }
}
</style>
