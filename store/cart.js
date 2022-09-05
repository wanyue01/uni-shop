export default {
  // 开启命名空间
  namespaced: true,
  
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下6各属性
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  
  mutations: {
    addToCart(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (!findResult) state.cart.push(goods)
      else findResult.goods_count ++
    },
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.dispatch('m_cart/saveToStorage', {state})
      }
    },
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.dispatch('m_cart/saveToStorage', {state})
      }
    },
    removeGoodsById(state, goods_id) {
      state.cart  = state.cart.filter(x => x.goods_id !== goods_id)
      this.dispatch('m_cart/saveToStorage', {state})
    },
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      this.dispatch('m_cart/saveToStorage')
    }
  },
  
  actions: {
    addToCart({commit, dispatch}, goods) {
      commit('addToCart', goods)
      dispatch('saveToStorage')
    },
    saveToStorage({state}) {
      // 持久化存储
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    }
  },
  
  getters: {
    total(state) {
      return state.cart.reduce((c, goods) => c += goods.goods_count, 0)
    },
    checkedCount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, goods) => total += goods.goods_count, 0)
    },
    checkedGoodsAmount(state) {
      return state.cart.filter(x => x.goods_state)
                       .reduce((amount, goods) => amount += goods.goods_price * goods.goods_count, 0)
                       .toFixed(2)
    }
  }
}