<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeGoodsState">
      <radio color="#c00000" :checked="isFullCheck"/><text>全选</text>
    </label>
    
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations, mapState } from 'vuex'
  export default {
    name:"my-settle",
    computed: {
      ...mapGetters('m_cart', ['checkedCount' , 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['fullAddress']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      isFullCheck() {
        return this.checkedCount === this.total
      }
    },
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        timer: null
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeGoodsState() {
        this.updateAllGoodsState(!this.isFullCheck)
      },
      settlement() {
        if (!this.checkedCount) return uni.$showMessage('请选择要结算的商品！')
        if (!this.fullAddress) return uni.$showMessage('请选择收获地址！')
        if (!this.token) return this.delayNavigate()
        this.payOrder()
        // 支付
        
      },
      // 展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: `请登录后再结算！${n}秒后自动跳转到登录页`,
          mask: true,
          duration: 1500
        })
      },
      delayNavigate() {
        this.seconds = 3
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              success() {
                this.updateRedirectInfo({
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        })
      },
      async payOrder() {
        // 1.创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // 开发期间，注释掉真实的订单价格
          // order_price: this.checkedGoodsAmount
          // 开发期间金额写死为1分钱
          order_price: 0.01,
          consignee_addr: this.fullAddress,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        // 1.2 发起请求创建订单
        const {data: res} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMessage('创建订单失败！')
        // 1.3 得到服务器响应的订单编号
        const orderNumber = res.message.order_number
        
        // 2.订单预支付
        // 2.1 发起请求获取订单的支付信息
        const {data: res2} = await uni.$http.post('api/public/v1/my/orders/req_unifiedorder', {order_number: orderNumber})
        // 2.2 如果预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showMessage('预付订单生成失败！')
        
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
        
        // 3. 发起微信支付
        // 3.1 调用uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 如果未完成支付
        if (err) return uni.$showMessage('订单未支付')
        // 3.3 完成了支付，要进一步查询支付的结果
        const {data: res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {order_number: orderNumber})
        // 3.4 如果检测到订单没有支付
        if (res3.meta.status !== 200) return uni.$showMessage('订单未支付！')
        // 3.5 订单支付成功
        uni.showToast({
          title: '支付成功！',
          icon: 'success'
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    .radio{
      display: flex;
      align-items: center;
    }
    
    .amount-box {
      .amount {
        color: #c00000;
        font-weight: bold;
      }
    }
    
    .btn-settle {
      background-color: #c00000;
      height: 50px;
      color: white;
      padding: 0 10px;
      line-height: 50px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>