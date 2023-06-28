import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircleCheck,
  faEye,
  faMagnifyingGlass,
  faCircleXmark,
  faCircleH
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'

library.add(faCircleCheck, faEye, faMagnifyingGlass, faCircleXmark, faCircleH)

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
const vfm = createVfm()

app.use(router)
app.use(vfm)
app.mount('#app')
