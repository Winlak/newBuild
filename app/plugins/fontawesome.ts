import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faTelegram,
  faVk,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
  library.add(
    faTelegram,
    faVk,
    faWhatsapp,
  )

  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
