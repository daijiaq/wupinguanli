<template>
  <view class="search" :style="{ paddingTop: navBarHeight + 'px' }">
    <u-navbar title="搜索" autoBack titleStyle="font-weight:bold" :bgColor="navBarColor"></u-navbar>

    <view style="display: flex">
      <SearchInput
        @onFocus="onFocus"
        @searchEmpty="determineEmpty"
        @updateInput="handleInputUpdate"
      />
      <SearchScreen @screenEmpty="determineEmpty" @filterParams="handleFilterParams" />
    </view>

    <view class="search__total">
      <view class="search__total__text">共{{ currentSearchList.effectiveSize }}件物品</view>
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
import { ref, provide } from 'vue'
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

// 新增：筛选/搜索相关状态
const isFiltering = ref(0)
provide('isFiltering', isFiltering)
const isSearching = ref(0)
provide('isSearching', isSearching)

// 搜索输入回调
const handleInputUpdate = (value: string) => {
  isSearching.value = 1
  isFiltering.value = 0
}
// 筛选参数回调
const handleFilterParams = (params: any) => {
  isFiltering.value = 1
  isSearching.value = 0
}

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

  // 重置筛选和搜索状态
  isFiltering.value = 0
  isSearching.value = 0

  try {
    await fetchNewSearchList(0)
  } catch (err) {
    manualDisable.value = true
    console.log('请求失败', err)
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

const enablePullDownRefresh = ref(true)
// 提供方法给子组件，用于控制下拉刷新
const setPullDownRefresh = (enabled: boolean) => {
  enablePullDownRefresh.value = enabled
  // 动态设置下拉刷新状态
  uni.stopPullDownRefresh()
  if (enabled) {
    uni.startPullDownRefresh({
      success: () => {
        uni.stopPullDownRefresh()
      }
    })
  }
}
provide('setPullDownRefresh', setPullDownRefresh)
// 下拉刷新
onPullDownRefresh(async () => {
  if (!enablePullDownRefresh.value) {
    uni.stopPullDownRefresh()
    return
  }
  manualDisable.value = false
  currentSearchList.value.itemList.length = 0
  currentSearchList.value.offset = 0
  isLoading.value = true

  try {
    if (isFiltering.value === 1) {
      // 重置筛选的偏移量，保持筛选条件
      searchStore.currentScreenData.offset = 0
      await searchStore.fetchScreenSearchList(0, true)
    } else if (isSearching.value === 1) {
      // 重置搜索的偏移量，保持搜索条件
      searchStore.currentSearchInputData.offset = 0
      await searchStore.searchItemByInput(0, false, true, true)
    } else {
      await fetchNewSearchList(0)
    }
  } catch {
    manualDisable.value = true
  } finally {
    isLoading.value = false
    currentSearchList.value.itemList.length ? (isEmpty.value = false) : (isEmpty.value = true)
    uni.stopPullDownRefresh()
  }
})

// // 监听滚动
// onPageScroll((e) => {
//   if (e.scrollTop !== 0) {
//     navBarColor.value = '#ffffff'
//   } else {
//     navBarColor.value = 'transparent'
//   }
// })

// 监听滚动
const isAtTop = ref(true)
onPageScroll((e) => {
  if (e.scrollTop !== 0) {
    navBarColor.value = 'transparent'
    isAtTop.value = false
  } else {
    navBarColor.value = 'transparent'
    isAtTop.value = true
  }
})

// 提供方法给子组件，用于检查是否需要滚动
const checkAndScrollIfNeeded = () => {
  if (isAtTop.value === true) {
    // 滚动一下
    // uni.pageScrollTo({
    //   scrollTop: 100,
    //   duration: 300
    // })
    return true
  }
  return false
}

// 提供这个方法给子组件
provide('checkAndScrollIfNeeded', checkAndScrollIfNeeded)

onShow(() => {
  getCapsule()
  // 如果当前有筛选或搜索状态，保持状态；否则加载默认列表
  if (isFiltering.value === 1) {
    // 恢复筛选状态
    searchStore.fetchScreenSearchList(0)
  } else if (isSearching.value === 1) {
    // 恢复搜索状态，确保搜索内容已设置
    const searchName = searchStore.currentSearchInputData.inputData.name
    if (searchName) {
      searchStore.currentSearchInputData.offset = 0
      searchStore.searchItemByInput(0, false, true, true)
    } else {
      // 如果没有搜索内容，重置为默认状态
      isSearching.value = 0
      loadSearchList()
    }
  } else {
    // 加载默认列表
    loadSearchList()
  }
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
