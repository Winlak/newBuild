<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { loadYandexMapsApi } from '~/utils/yandexMaps'

export interface YandexMapPoint {
  id: string
  title: string
  subtitle?: string
  coordinates: {
    lat: number
    lng: number
  }
  priceLabel?: string
  balloonHtml?: string
}

const props = withDefaults(defineProps<{
  points: YandexMapPoint[]
  center?: { lat: number, lng: number }
  zoom?: number
  fitBounds?: boolean
  interactive?: boolean
  lazy?: boolean
  lazyRootMargin?: string
}>(), {
  center: () => ({ lat: 55.0302, lng: 82.9204 }),
  zoom: 11,
  fitBounds: true,
  interactive: true,
  lazy: true,
  lazyRootMargin: '80px',
})

const config = useRuntimeConfig()
const mapEl = ref<HTMLElement | null>(null)
const map = shallowRef<any>(null)
const collection = shallowRef<any>(null)
const loadError = ref('')
let intersectionObserver: IntersectionObserver | null = null

const apiKey = computed(() => String(config.public.yandexMapsApiKey || '').trim())
const yandexMapsUrl = computed(() => {
  const point = props.points[0]
  const coordinates = point?.coordinates ?? props.center

  return `https://yandex.ru/maps/?ll=${coordinates.lng}%2C${coordinates.lat}&z=${props.zoom}&pt=${coordinates.lng}%2C${coordinates.lat},pm2rdm`
})

const createPointHtml = (point: YandexMapPoint) => point.balloonHtml || `
  <div class="app-yandex-map-balloon">
    <strong>${point.title}</strong>
    ${point.subtitle ? `<span>${point.subtitle}</span>` : ''}
  </div>
`

const setMapBehaviors = () => {
  if (!map.value) {
    return
  }

  if (props.interactive) {
    map.value.behaviors.enable(['drag', 'scrollZoom', 'dblClickZoom', 'multiTouch'])
    return
  }

  map.value.behaviors.disable(['drag', 'scrollZoom', 'dblClickZoom', 'multiTouch'])
}

const updateMap = () => {
  if (!map.value || !collection.value || !window.ymaps) {
    return
  }

  collection.value.removeAll()

  props.points.forEach((point) => {
    const placemark = new window.ymaps!.Placemark(
      [point.coordinates.lat, point.coordinates.lng],
      {
        balloonContent: createPointHtml(point),
        hintContent: point.title,
        iconContent: point.priceLabel,
      },
      {
        preset: point.priceLabel ? 'islands#blueStretchyIcon' : 'islands#blueIcon',
      },
    )

    collection.value.add(placemark)
  })

  const coordinates = props.points.map(point => [point.coordinates.lat, point.coordinates.lng])

  if (props.fitBounds && coordinates.length > 1) {
    const lats = coordinates.map(point => point[0])
    const lngs = coordinates.map(point => point[1])
    map.value.setBounds([
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ], {
      checkZoomRange: true,
      zoomMargin: 42,
    })
    return
  }

  if (coordinates.length === 1) {
    map.value.setCenter(coordinates[0], props.zoom)
    return
  }

  map.value.setCenter([props.center.lat, props.center.lng], props.zoom)
}

const initMap = async () => {
  if (!mapEl.value || map.value) {
    return
  }

  if (!apiKey.value) {
    loadError.value = 'Ключ Яндекс.Карт не задан'
    return
  }

  try {
    const ymaps = await loadYandexMapsApi(apiKey.value)

    map.value = new ymaps.Map(
      mapEl.value,
      {
        center: [props.center.lat, props.center.lng],
        zoom: props.zoom,
        controls: props.interactive ? ['zoomControl', 'fullscreenControl'] : [],
      },
      {
        suppressMapOpenBlock: true,
        yandexMapDisablePoiInteractivity: !props.interactive,
      },
    )
    collection.value = new ymaps.GeoObjectCollection()
    map.value.geoObjects.add(collection.value)

    setMapBehaviors()
    updateMap()
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Не удалось загрузить Яндекс.Карту'
  }
}

const observeMapVisibility = async () => {
  await nextTick()

  if (!mapEl.value) {
    return
  }

  if (!props.lazy || !('IntersectionObserver' in window)) {
    await initMap()
    return
  }

  intersectionObserver = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) {
      return
    }

    intersectionObserver?.disconnect()
    intersectionObserver = null
    void initMap()
  }, {
    rootMargin: props.lazyRootMargin,
  })

  intersectionObserver.observe(mapEl.value)
}

onMounted(async () => {
  await observeMapVisibility()
})

watch(() => props.points, async () => {
  await nextTick()
  updateMap()
}, { deep: true })

watch(() => props.interactive, setMapBehaviors)

onBeforeUnmount(() => {
  intersectionObserver?.disconnect()
  intersectionObserver = null
  map.value?.destroy()
  map.value = null
  collection.value = null
})
</script>

<template>
  <div class="app-yandex-map">
    <div
      v-if="!loadError"
      ref="mapEl"
      class="app-yandex-map__canvas"
      aria-label="Яндекс.Карта"
    ></div>

    <div
      v-else
      class="app-yandex-map__fallback"
    >
      <strong>Яндекс.Карта не загружена</strong>
      <span>{{ loadError }}</span>
      <a
        :href="yandexMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Открыть в Яндекс.Картах
      </a>
    </div>
  </div>
</template>

<style scoped>
.app-yandex-map,
.app-yandex-map__canvas {
  width: 100%;
  height: 100%;
  min-height: inherit;
}

.app-yandex-map__fallback {
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  min-height: inherit;
  padding: 28px;
  background:
    linear-gradient(135deg, rgba(13, 110, 253, 0.11), rgba(255, 255, 255, 0.82)),
    #eef3f8;
  color: #182033;
  text-align: center;
}

.app-yandex-map__fallback strong {
  color: #07123d;
  font-size: 18px;
  font-weight: 900;
}

.app-yandex-map__fallback span {
  color: #647082;
  font-size: 14px;
  font-weight: 700;
}

.app-yandex-map__fallback a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #0d6efd;
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
}

.app-yandex-map__fallback a:hover {
  background: #0b5ed7;
  color: #fff;
}

:global(.app-yandex-map-balloon) {
  display: grid;
  gap: 7px;
  min-width: 220px;
  color: #182033;
}

:global(.app-yandex-map-balloon strong) {
  color: #07123d;
  font-size: 16px;
  font-weight: 900;
  line-height: 1.2;
}

:global(.app-yandex-map-balloon span) {
  color: #647082;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
}

:global(.app-yandex-map-balloon b) {
  color: #07123d;
  font-size: 15px;
  font-weight: 900;
  line-height: 1.2;
}

:global(.app-yandex-map-balloon a) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #0d6efd;
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
}

:global(.app-yandex-map-balloon a:hover) {
  background: #0b5ed7;
  color: #fff;
}
</style>
