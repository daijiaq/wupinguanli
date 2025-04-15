<template>
  <u-skeleton rows="18" :loading="isLoading" title animate class="denpendence-list">
    <view v-if="!isLoading">
      <!-- 总列表 -->
      <template>
        <view v-for="item in currentSearchList.itemList" :key="item.id">
          <DependenceItem :item-data="item" @onClick="chooseItem(item)" />
        </view>
        <!-- 加载更多 -->
        <u-loadmore
          v-if="!isLoading"
          :status="loadMoreStatus"
          line
          loadingText="努力加载中，先喝杯茶"
          nomoreText="没有更多了"
          marginBottom="50rpx"
        />
      </template>
    </view>
  </u-skeleton>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/stores/search'
import { onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs } from 'vue'
import type { ItemList } from '@/types/search'

const searchStore = useSearchStore()
const { currentSearchList, currentScreenData, currentSearchInputData } = storeToRefs(searchStore)
const { fetchNewSearchList, fetchScreenSearchList, searchItemByInput } = searchStore

const props = defineProps<{
  isLoading: boolean
  cancelMultiple: boolean
}>()

const { isLoading } = toRefs(props)

// 是否正在加载更多
const isLoadingMore = ref(false)

// 是否无法加载更多了
const loadMoreStatus = ref('nomore')
const isNoMore = computed(
  () =>
    currentSearchList.value.itemList.length < currentSearchList.value.limit ||
    (currentSearchList.value.itemList.length &&
      currentSearchList.value.itemList.length === currentSearchList.value.total)
)

// 请求更多
async function loadMoreItem() {
  isLoadingMore.value = true

  try {
    if (currentScreenData.value.offset) {
      await fetchScreenSearchList(0)
    } else if (currentSearchInputData.value.offset) {
      await searchItemByInput(0)
    } else {
      await fetchNewSearchList(0)
    }
  } catch {
    console.log('加载更多失败')
  } finally {
    isLoadingMore.value = false
  }
}

// 点击
const chooseItem = (item: ItemList) => {
  // 点击选中
  item.isChecked = !item.isChecked
}

// 触底加载更多
onReachBottom(async () => {
  if (!isNoMore.value) {
    loadMoreStatus.value = 'loading'
    await loadMoreItem()
  } else {
    loadMoreStatus.value = 'nomore'
  }
})
</script>

<style lang="scss" scoped></style>
