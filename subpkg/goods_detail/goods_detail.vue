<template>
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :circular="true" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview((i))"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 商品信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名字 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>
    
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    
    <!-- 商品导航区域 -->
    <view class="goods-nav">
      <uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  // import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
  import { mapState, mapGetters, mapActions } from 'vuex'
  export default {
    // 当 一个值 依赖于其他变量时用computed
    computed: {
      ...mapState('m_cart', []),
      ...mapGetters('m_cart', ['total'])
    },
    // 当一个值改变，想引起 另一个值 的变化时，用watch
    watch: {
      total: {
       handler(newVal) {
         const findResult = this.options.find(x => x.text === '购物车')
         if (findResult) {
           findResult.info = newVal
         }
       },
       immediate: true
      }
    },
    data() {
      return {
        goods_info: [],
        options: [{
        			icon: 'shop',
        			text: '店铺',
        			infoBackgroundColor:'#007aff',
        			infoColor:"red"
        		}, {
        			icon: 'cart',
        			text: '购物车',
        			info: 0
        		}],
        	    buttonGroup: [{
        	      text: '加入购物车',
        	      backgroundColor: '#ff0000',
        	      color: '#fff'
        	    },
        	    {
        	      text: '立即购买',
        	      backgroundColor: '#ffa200',
        	      color: '#fff'
        	    }
        	    ]
      };
    },
    onLoad(options) {
      const {goods_id} = options
      this.getGoodsDetail(goods_id)
    },
    methods: {
      // ...mapMutations('m_cart', ['addToCart']),
      ...mapActions('m_cart', ['addToCart']),
      async getGoodsDetail(goods_id) {
        const {data: res} = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
        if (res.meta.status !== 200) return uni.$showMessage()
        res.message.goods_introduce.replace(/<img /g, '<img style="display: "block" ').replace(/webp/g, 'jpg')
        this.goods_info = res.message
      },
      preview(i) {
        // 调用 uni.previewImage() 预览图片
        uni.previewImage({
          // 预览时默认显示图片的索引，就按数组的索引即可
          current: i,
          // 所有图片的url地址的数组
          urls: this.goods_info.pics.map(item => item.pics_big)
        })
      },
      onClick(e) {
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      buttonClick(e) {
        if (e.content.text === '加入购物车') {
          const {goods_id, goods_name, goods_price, goods_small_logo} = this.goods_info
          const goods = {
            goods_id,
            goods_name,
            goods_price,
            goods_count: 1,
            goods_small_logo,
            goods_state: true
          }
          this.addToCart(goods)
        }
      }
    }
  }
</script>

<style lang="scss">
  .goods-detail-container {
    padding-bottom: 50px;
    swiper {
      height: 750rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .goods-info-box {
      padding: 10px;
      padding-right: 0;
      .price {
        color: #c00000;
        font-size: 18px;
        margin: 10px 0;
      }
      .goods-info-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-name {
          font-size: 13px;
          margin-right: 10px;
        }
        .favi {
          width: 120px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-left: solid 1px #efefef;
          color: gray
        }
      }
      .yf {
        font-size: 12px;
        color: gray;
        margin: 10px 0;
      }
    }
    .goods-nav {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }
</style>
