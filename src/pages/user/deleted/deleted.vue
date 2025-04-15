<template>
  <view class="deleted" :style="{ paddingTop: navBarHeight + 'px' }">
    <u-navbar
      title="最近删除"
      autoBack
      titleStyle="font-weight:bold"
      :bgColor="navBarColor"
    ></u-navbar>

    <view style="display: flex">
      <SearchInput @onFocus="onFocus" @searchEmpty="determineEmpty" />
      <SearchScreen @screenEmpty="determineEmpty" />
    </view>

    <SearchList
      v-if="!isEmpty"
      :isLoading="isLoading"
      :manualDisable="manualDisable"
      :cancelMultiple="cancelMultiple"
    />

    <!-- 空 -->
    <Empty v-if="isEmpty" type="deleted" width="470" height="500" />
  </view>
</template>

<script setup lang="ts">
import { onShow, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app'
import { ref, provide } from 'vue'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'

const searchStore = useSearchStore()
const { currentSearchList } = storeToRefs(searchStore)
const { searchItemByInput } = searchStore

provide('isNeedEdit', false)
provide('isDetele', true)

// 搜索框获取焦点之后取消多选状态
const cancelMultiple = ref(false)
const onFocus = () => {
  cancelMultiple.value = !cancelMultiple.value
}

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

// 请求列表
async function loadDeletedList(isRepagination?: boolean) {
  manualDisable.value = false
  currentSearchList.value.itemList.length = 0
  currentSearchList.value.offset = 0
  isLoading.value = true

  try {
    await searchItemByInput(1, isRepagination)
  } catch {
    manualDisable.value = true
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
  await loadDeletedList()
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
  loadDeletedList(true)
})
</script>

<style lang="scss" scoped>
.deleted {
  overflow-x: hidden;
}
</style>
