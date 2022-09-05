import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'

// 将Vuex安装为vue插件
Vue.use(Vuex)

// 创建Store的实例对象
const store = new Vuex.Store({
  // TODO：挂载store模块
  modules: {
    'm_cart': moduleCart,
    'm_user': moduleUser
  }
})

// 向外共享Store的实例对象
export default store