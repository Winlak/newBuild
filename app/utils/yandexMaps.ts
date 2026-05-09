declare global {
  interface Window {
    ymaps?: {
      ready: (callback: () => void) => void
      [key: string]: any
    }
    __yandexMapsPromise?: Promise<any>
  }
}

export const loadYandexMapsApi = (apiKey: string, lang = 'ru_RU') => {
  if (!import.meta.client) {
    return Promise.reject(new Error('Yandex Maps API is available only in browser'))
  }

  if (!apiKey) {
    return Promise.reject(new Error('Yandex Maps API key is not configured'))
  }

  if (window.ymaps) {
    return new Promise<any>((resolve) => {
      window.ymaps?.ready(() => resolve(window.ymaps))
    })
  }

  if (window.__yandexMapsPromise) {
    return window.__yandexMapsPromise
  }

  window.__yandexMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=${encodeURIComponent(lang)}`
    script.async = true
    script.onload = () => {
      window.ymaps?.ready(() => resolve(window.ymaps))
    }
    script.onerror = () => {
      window.__yandexMapsPromise = undefined
      reject(new Error('Failed to load Yandex Maps API'))
    }

    document.head.appendChild(script)
  })

  return window.__yandexMapsPromise
}

