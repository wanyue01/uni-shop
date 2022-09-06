<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#c9c9c9"></uni-icons>
    <button type="primary" @click="login" class="btn-login">一键登录</button>
    <!-- <button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" class="btn-login">一键登录</button> -->
    <text class="tips-text">登陆后尽享更多权益</text>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    data() {
      return {

      };
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateRedirectInfo']),
      login() {
        uni.login({
          async success(res) {
            if (res.code) {
              //发起网络请求
              const res1 = await uni.$http.post('/api/public/v1/users/wxlogin', {code: res.code})
              console.log(res1)
              this.navigateBack()
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
        // if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMessage('您取消了登录授权！')
        // this.updateUserInfo(e.detail.userInfo)
        // console.log(e)
      },
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            success() {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 40px;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #f5f5f5;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
