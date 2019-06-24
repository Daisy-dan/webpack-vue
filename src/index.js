import Vue from 'vue'
import App from './App.vue'

import '../src/assets/styles/test.css'
import '../src/assets/images/bear.jpg'

const root = document.createElement("div")
document.body.appendChild(root)

new Vue({
    render: h => h(App),
  }).$mount(root)
  