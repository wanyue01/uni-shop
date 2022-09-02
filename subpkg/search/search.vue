<template>
  <view>
    <view class="search-box">
      <uni-search-bar  @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
    <!-- 搜索列表 -->
    <view class="sugg-list" v-if="searchList.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchList" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clear"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        kw: '',
        //  搜索的结果列表
        searchList: [],
        historyList: []
      };
    },
    computed: {
      historys() {
        return [...this.historyList].reverse()
      }
    },
    methods: {
      input(value) {
        clearInterval(this.timer)
        this.timer = setTimeout(() => {
          this.kw = value
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        // 判断关键字是否为空
        if (this.kw.length === 0) {
          this.searchList = []
          return
        }
        const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw})
        if (res.meta.status !== 200) return uni.$showMessage()
        this.searchList = res.message
        this.saveSearchHistory()
      },
      gotoDetail(item) {
        uni.navigateTo({
          url: `/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
        })
      },
      saveSearchHistory() {
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      onLoad() {
        this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
      },
      clear() {
        this.historyList = []
        uni.setStorageSync('kw', [])
      },
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: `/subpkg/goods_list/goods_list?query=${kw}`
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  .sugg-list {
    padding: 0 5px;
    .sugg-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: solid 1px #efefef;
      .goods-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .history-box {
    padding: 0 5px;
    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      border-bottom: solid 1px #efefef;
    }
    .history-list {
      display: flex;
      flex-wrap: wrap;
      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
