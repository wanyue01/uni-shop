<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收获地址 +</button>
    </view>
    
    <!-- 渲染收获地址的盒子 -->
    <view class="address-info-box" v-else  @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <text class="username">收货人：{{address.userName}}</text>
        </view>
        <view class="row1-right">
          <text class="phone">电话：{{address.telNumber}}</text>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <text class="row2-left">收货地址：</text>
        <text class="row2-right">{{fullAddress}}</text>
      </view>
    </view>
    
    <!-- 底部边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  export default {
    name:"my-address",
    data() {
      return {

      };
    },
    computed: {
      ...mapState('m_user', ['address']),
      ...mapGetters('m_user', ['fullAddress'])
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress']),
      async chooseAddress() {
        console.log(this)
        // 1.调用小程序提供的chooseAddress() 方法，即可使用收货地址
        //   返回值时一个数组，第一项为错误对象，第二项为成功之后的收货地址
        const [err, succ] = await uni.chooseAddress().catch(e => e)
        
        // 2.用户成功选择了收货地址
        if (err === null && succ.errMsg === 'chooseAddress:ok') {
          this.updateAddress(succ)
        }
        
        // 3.用户没有授权
        if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
          this.reAuth() // 重新发起授权申请
        }
      },
      async reAuth() {
        const [err, confirmResult] = await uni.showModal({
          content: '检测到您没有打开地址权限，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消'
        })
        if (err) return
        if (confirmResult.cancel) return uni.$showMessage('您取消了授权！')
        // 重新授权
        if (confirmResult.confirm) return uni.authorize({
          scope: 'scope.address',
          success() {
              uni.$showMessage('授权成功！请选择收货地址')
          },
          fail() {
            uni.$showMessage('您取消了授权！')
          }
      })
        // uni.openSetting({
        //   success(settingResult) {
        //     if (!settingResult.authSetting['scope.address']) return uni.$showMessage('您取消了授权！')
        //     if (settingResult.authSetting['scope.address']) return uni.$showMessage('授权成功！请选择收货地址')
        //   }
        // })
      }
    }
  }
</script>

<style lang="scss">
  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    .btnChooseAddress {
      
    }
  }
  .address-info-box {
    font-size: 12px;
    display: flex;
    height: 90px;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;
    .row1 {
      display: flex;
      justify-content: space-between;
      .row1-left {
        .username {
          
        }
      }
      .row1-right {
        display: flex;
        align-items: center;
        .phone {
          
        }
      }
    }
    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .row2-left {
        white-space: nowrap;
      }
      .row2-right {
        
      }
    }
  }
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }
</style>