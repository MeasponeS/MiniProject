import Vue from 'vue'
import App from './App'

import lodashGet from 'lodash/get'

Vue.config.productionTip = false
Vue.prototype.lodashGet = lodashGet
App.mpType = 'app'


const app = new Vue(App)
app.$mount()
