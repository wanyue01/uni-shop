<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <image :src="goods.goods_small_logo || defalutPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 商品标题 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{goods.goods_price | toFixed}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    props: {
      goods: {
        type: Object,
        default: {}
      }
    },
    filters: {
      toFixed(num) {
        return num.toFixed(2)
      }
    },
    data() {
      return {
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-defalut-medium.png'
      };
    }
  }
</script>

<style lang="scss">
.goods-item {
    display: flex;
    padding: 10px 5px;
    border: solid 1px #f0f0f0;
    .goods-item-left {
      margin-right: 5px;
      .goods-pic {
        width: 100px;
        height: 100px;
      }
    }
    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goods-name {
        font-size: 13px;
      }
      .goods-info-box {
        .goods-price {
          color: #c00000;
          font-size: 16px;
        }
      }
    }
  }
</style>