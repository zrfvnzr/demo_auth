import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Vue axios setup
import axios from 'axios'
import VueAxios from 'vue-axios'
app.use(VueAxios, axios)
// end Vue axios setup

// Vue router setup
  // import compoonents
  import Forgot from './views/Forgot.vue'
  import Home from './views/Home.vue'
  import Login from './views/Login.vue'
  import Register from './views/Register.vue'
  // end import components
  // define routes
  const routes = [
    // { path: '/', component: Home } // example
    {path: '/', component: Home},
    {path: '/', component: Forgot},
    {path: '/login', component: Login},
    {path: '/register', component: Register}
  ]
  // end define routes
  // setup router
  import { createRouter, createWebHistory } from 'vue-router'
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  // end setup router
  app.use(router)
// end Vue router setup

app.mount('#app')
