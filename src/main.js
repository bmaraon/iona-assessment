import '@assets/main.css'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

// Make BootstrapVue available throughout your project
app.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
app.use(IconsPlugin)

app.mount('#app')
