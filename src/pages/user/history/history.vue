<template>
  <view class="history">
    <u-navbar
      placeholder
      title="物品修改记录"
      titleStyle="font-weight:bold"
      autoBack
      :bgColor="navBarColor"
    ></u-navbar>

    <view style="display: flex">
      <SearchInput
        @onFocus="onFocus"
        @searchEmpty="determineEmpty"
        @updateInput="handleInputUpdate"
      />
      <SearchScreenother @screenEmpty="determineEmpty" @filterParams="handleFilterParams" />
    </view>

    <SearchList
      v-if="!isEmpty"
      :isLoading="isLoading"
      :manualDisable="manualDisable"
      :cancelMultiple="cancelMultiple"
      :filterParams="filterParams"
      :searchInput="searchInputValue"
    />

    <!-- 空 -->
    <Empty v-if="isEmpty" type="history" width="470" height="500" />
  </view>
</template>

<script setup lang="ts">
import { onShow, onPullDownRefresh, onPageScroll, onLoad } from '@dcloudio/uni-app'
import { ref, provide } from 'vue'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import SearchScreenother from '@/components/SearchScreen/SearchScreenother.vue'

const isFiltering = ref(0)
provide('isFiltering', isFiltering)

const isSearching = ref(0)
provide('isSearching', isSearching)

const filterParams = ref<any>(null)
const handleFilterParams = (params: any) => {
  filterParams.value = params
}

const searchInputValue = ref('')
const handleInputUpdate = (value: string) => {
  searchInputValue.value = value
}

const searchStore = useSearchStore()
const { currentSearchList } = storeToRefs(searchStore)
const { fetchHistoryItem } = searchStore

// 表示当前为历史记录页
const isHistory = ref(true)
provide('isHistory', isHistory)

// 搜索框获取焦点之后取消多选状态
const cancelMultiple = ref(false)
const onFocus = () => {
  cancelMultiple.value = !cancelMultiple.value
}

// 是否正在加载
const isLoading = ref(false)
// 手动控制禁用加载
const manualDisable = ref(false)
// 列表是否为空
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
async function loadHistoryList() {
  manualDisable.value = false
  currentSearchList.value.itemList.length = 0
  currentSearchList.value.offset = 0
  isLoading.value = true

  try {
    await fetchHistoryItem('')
    console.log(111)
  } catch {
    manualDisable.value = true
  } finally {
    isLoading.value = false
    console.log('currentSearchList.value.itemList', currentSearchList.value.itemList)
    currentSearchList.value.itemList.length ? (isEmpty.value = false) : (isEmpty.value = true)
  }
}

// 下拉刷新
onPullDownRefresh(async () => {
  await loadHistoryList()
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
  loadHistoryList()
  console.log('currentSearchList.value.itemList', currentSearchList.value.itemList)
})
</script>

<style lang="scss" scoped>
.history {
  overflow-x: hidden;
}

// ::v-deep .search-input.data-v-53960f6d {
//   width: 90vw;
// }
// ::v-deep .search-input__content.data-v-53960f6d {
//   width: 90vw;
// }
</style>
