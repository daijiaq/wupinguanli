<template>
  <view class="search" :style="{ paddingTop: navBarHeight + 'px' }">
    <u-navbar title="搜索" autoBack titleStyle="font-weight:bold" :bgColor="navBarColor"></u-navbar>

    <view style="display: flex">
      <SearchInput @onFocus="onFocus" @searchEmpty="determineEmpty" />
      <SearchScreen @screenEmpty="determineEmpty" />
    </view>

    <view class="search__total">
      <view class="search__total__text">共{{ currentSearchList.total }}件物品</view>
    </view>

    <SearchList
      v-if="!isEmpty"
      :isLoading="isLoading"
      :manualDisable="manualDisable"
      :cancelMultiple="cancelMultiple"
    />

    <!-- 空 -->
    <Empty v-if="isEmpty" type="search" />
  </view>
</template>

<script setup lang="ts">
import { onShow, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'

const searchStore = useSearchStore()
const { currentSearchList } = storeToRefs(searchStore)
const { fetchNewSearchList } = searchStore

// 是否正在加载
const isLoading = ref(false)
// 手动控制禁用加载
const manualDisable = ref(false)
// 是否为空
const isEmpty = ref(false)
// navBar 颜色
const navBarColor = ref('transparent')

// 判断搜索/筛选后是否为空
const determineEmpty = () => {
  if (!currentSearchList.value.itemList.length) {
    isEmpty.value = true
  } else {
    isEmpty.value = false
  }
}

// 搜索框获取焦点之后取消多选状态
const cancelMultiple = ref(false)
const onFocus = () => {
  cancelMultiple.value = !cancelMultiple.value
}

// 请求列表
async function loadSearchList() {
  manualDisable.value = false
  currentSearchList.value.itemList.length = 0
  currentSearchList.value.offset = 0
  isLoading.value = true

  try {
    await fetchNewSearchList(0)
  } catch {
    manualDisable.value = true
    console.log('请求失败')
  } finally {
    isLoading.value = false
    currentSearchList.value.itemList.length ? (isEmpty.value = false) : (isEmpty.value = true)
  }
}

// navbar 高度
const navBarHeight = ref<number>(44)

// 获取小程序胶囊按钮
const getCapsule = () => {
  const menuButton = uni.getMenuButtonBoundingClientRect()
  navBarHeight.value = menuButton.bottom + 16
}

// 下拉刷新
onPullDownRefresh(async () => {
  await loadSearchList()
  uni.stopPullDownRefresh()
})

// 监听滚动
onPageScroll((e) => {
  if (e.scrollTop !== 0) {
    navBarColor.value = '#ffffff'
  } else {
    navBarColor.value = 'transparent'
  }
})

onShow(() => {
  getCapsule()
  loadSearchList()
})
</script>

<style lang="scss" scoped>
.search {
  overflow-x: hidden;

  &__total {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 190rpx;
    height: 60rpx;
    padding: 0 20rpx;
    margin-left: 40rpx;
    border-radius: 10px;
    background-color: #f8f9fd;

    &__text {
      color: #000;
      font-size: 25rpx;
      letter-spacing: 4rpx;
    }
  }
}
</style>
