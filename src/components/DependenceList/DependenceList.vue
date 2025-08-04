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
import { useFormStore } from '@/stores/form'
import { onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs } from 'vue'
import type { ItemList } from '@/types/search'

const searchStore = useSearchStore()
const { currentSearchList, currentScreenData, currentSearchInputData } = storeToRefs(searchStore)
const { fetchScreenSearchList, searchItemByInput, fetchDependceItems } = searchStore

const formStore = useFormStore()

const props = defineProps<{
  isLoading: boolean
  cancelMultiple: boolean
}>()

const { isLoading } = toRefs(props)

// 是否正在加载更多
const isLoadingMore = ref(false)

// 是否无法加载更多了
const loadMoreStatus = ref('nomore')
const isNoMore = computed(() => {
  console.log('itemList length:', currentSearchList.value.itemList.length)
  console.log('limit:', currentSearchList.value.limit)
  console.log('total:', currentSearchList.value.total)
  return (
    currentSearchList.value.itemList.length < currentSearchList.value.limit ||
    (currentSearchList.value.itemList.length &&
      currentSearchList.value.itemList.length === currentSearchList.value.total)
  )
})

// 请求更多
async function loadMoreItem() {
  isLoadingMore.value = true

  try {
    if (currentScreenData.value.offset) {
      await fetchScreenSearchList(0)
      console.log(111)
    } else if (currentSearchInputData.value.offset) {
      await searchItemByInput(0)
      console.log(222)
    } else {
      await fetchDependceItems(0)
      console.log(333)
    }
  } catch {
    console.log('加载更多失败')
  } finally {
    isLoadingMore.value = false
  }
}

// 点击
const chooseItem = (item: ItemList) => {
  // 检查物品是否已经关联
  const isAlreadyRelated = checkIfItemAlreadyRelated(item.id)

  if (isAlreadyRelated) {
    // 弹窗提示用户此物品已经关联
    uni.showModal({
      title: '提示',
      content: '此空间/物品已关联，无法重复关联',
      showCancel: false,
      confirmText: '确定'
    })
    return
  }

  // 点击选中
  item.isChecked = !item.isChecked
}

// 检查物品是否已经关联
const checkIfItemAlreadyRelated = (itemId: number): boolean => {
  // 判断当前是编辑模式还是新建模式
  // 如果tempItemData有id且不为0，说明是编辑模式
  const isEditMode = formStore.tempItemData && formStore.tempItemData.id !== 0

  if (isEditMode) {
    // 编辑模式：只检查tempItemData.items
    const tempItems = formStore.tempItemData?.items || []
    return tempItems.some((item) => item.id === itemId)
  } else {
    // 新建模式：只检查form.items
    const formItems = formStore.form?.items || []
    return formItems.some((item) => item.id === itemId)
  }
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
