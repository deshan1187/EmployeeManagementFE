import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// === VUETIFY IMPORTS ===
import vuetify from './plugins/vuetify'   // ← Add this

const app = createApp(App)

app.use(router)
app.use(vuetify)     // ← Add this line

app.mount('#app')