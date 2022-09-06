<template>
  <view class="my-container">
    <my-login v-if="!token"></my-login>
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState } from 'vuex'
  export default {
    mixins: [badgeMix],
    computed: {
      ...mapState('m_user', ['token'])
    },
    // onLoad() {
    //   console.log(111)
    //   uni.getSetting({
    //     success(res) {
    //       console.log(res)
          
    //       uni.getUserInfo({
    //         success: function(res) {
    //           console.log(res)
    //           var userInfo = res.userInfo
    //           var nickName = userInfo.nickName
    //           var avatarUrl = userInfo.avatarUrl
    //           var gender = userInfo.gender //性别 0：未知、1：男、2：女
    //           var province = userInfo.province
    //           var city = userInfo.city
    //           var country = userInfo.country
    //         },
    //         fail(e) {
    //           console.log(e)
    //         }
    //       })
          
          
    //       if (!res.authSetting['scope.userInfo']) {
    //         uni.authorize({
    //           scope: 'scope.userInfo',
    //           success() {
    //             // 用户已经同意小程序使用录音功能，后续调用 uni.startRecord 接口不会弹窗询问
    //             uni.getUserInfo({
    //               success: function(res) {
    //                 var userInfo = res.userInfo
    //                 var nickName = userInfo.nickName
    //                 var avatarUrl = userInfo.avatarUrl
    //                 var gender = userInfo.gender //性别 0：未知、1：男、2：女
    //                 var province = userInfo.province
    //                 var city = userInfo.city
    //                 var country = userInfo.country
    //               },
    //               fail(e) {
    //                 console.log(e)
    //               }
    //             })
    //           }
    //         })
    //       }
    //     }
    //   })
    // },
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss">
  page, .my-container {
    height: 100%;
  }
</style>
