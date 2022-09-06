export default {
  namespaced: true,
  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    token: 'qqq',
    // 用户的信息对象
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 重定向的对象
    redirectInfo: null
  }),
  mutations: {
    updateAddress(state, address) {
      state.address = address
      this.dispatch('m_user/saveAddressToStorage')
    },
    updateUserInfo(state, userinfo) {
      state.userinfo = userinfo
      this.dispatch('m_user/saveUserInfoToStorage')
    },
    updateToken(state, token) {
      state.token = token
      this.dispatch('m_user/saveTokenToStorage')
    },
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
    }
  },
  actions: {
    saveAddressToStorage({
      state
    }) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    saveUserInfoToStorage({
      state
    }) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    saveTokenToStorage({
      state
    }) {
      uni.setStorageSync('token', JSON.stringify(state.token))
    }
  },
  getters: {
    fullAddress(state) {
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}
