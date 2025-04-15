<template>
  <u-skeleton rows="18" :loading="isLoading" title animate>
    <view v-if="!isLoading">
      <!-- 总列表 -->
      <template>
        <view v-for="(item, index) in currentSearchList.itemList" :key="item.id">
          <SearchListItem
            :item-data="item"
            :is-checking="checkboxOperate"
            @onClick="chooseItem(item)"
            @longpress="showOperate(index)"
            @setID="setID"
          />
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
      <!-- 多选状态的弹出框 -->
      <CheckboxOperation
        v-if="!isHistory"
        :isLongpressing="checkboxOperate"
        @edit="editMultiple"
        @cancel="cancelChecking"
        @delete="deleteItem"
        @recover="recoverItem"
      />
      <PasswordPopup
        :popup="popup"
        @close="popup = false"
        @confirmGesture="confirmGesture"
        @confirmNumber="confirmNumber"
        :isValidate="true"
      />
    </view>
  </u-skeleton>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/stores/search'
import { useFormStore } from '@/stores/form'
import { onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, inject, watch } from 'vue'
import type { ItemList } from '@/types/search'
const searchStore = useSearchStore()
const { currentSearchList, currentScreenData, currentSearchInputData } = storeToRefs(searchStore)
const {
  fetchNewSearchList,
  fetchScreenSearchList,
  searchItemByInput,
  batchDeleteSearch,
  restoreDeletedItem,
  fetchHistoryItem
} = searchStore
const FormStore = useFormStore()
const { getDetail } = FormStore
// 是否是删除页面
const isDeleted = inject<boolean>('isDetele', false)
const isHistory = inject<boolean>('isHistory', false)

const props = defineProps<{
  isLoading: boolean
  manualDisable: boolean
  cancelMultiple: boolean
}>()

const { isLoading } = toRefs(props)
const manualDisable = ref(props.manualDisable)

// 取消多选状态
watch(
  () => props.cancelMultiple,
  () => {
    checkboxOperate.value = false
  }
)

//密码弹窗
const popup = ref(false)
const tempID = ref(0)
const tempType = ref(0)
async function setID(id: number, type: number, privacy: number): Promise<void> {
  if (privacy) {
    tempID.value = id
    tempType.value = type
    popup.value = true
  } else {
    await getDetail(type, id, '')
    uni.navigateTo({
      url: `/pages/details/details?isDeleted=${isDeleted}`
    })
  }
}

//验证手势密码
async function confirmGesture(password: string) {
  popup.value = false
  await getDetail(tempType.value, tempID.value, password)
  uni.navigateTo({
    url: `/pages/details/details?isDeleted=${isDeleted}`
  })
}
//验证数字密码
async function confirmNumber(password: string) {
  popup.value = false
  await getDetail(tempType.value, tempID.value, password)
  uni.navigateTo({
    url: `/pages/details/details`
  })
}

// 是否正在加载更多通知
const isLoadingMore = ref(false)

// 是否无法加载更多了
const loadMoreStatus = ref('nomore')
const isNoMore = computed(
  () =>
    currentSearchList.value.itemList.length < currentSearchList.value.limit ||
    (currentSearchList.value.itemList.length &&
      currentSearchList.value.itemList.length === currentSearchList.value.total)
)
// isNoMore 改变时，改变列表加载状态
watch(isNoMore, () => {
  if (isNoMore.value) {
    loadMoreStatus.value = 'nomore'
  } else {
    loadMoreStatus.value = 'loading'
  }
})

// 触底加载更多
onReachBottom(async () => {
  if (!isNoMore.value && !manualDisable.value) {
    loadMoreStatus.value = 'loading'
    await loadMoreItem()
  } else {
    loadMoreStatus.value = 'nomore'
  }
})

// 请求更多
async function loadMoreItem() {
  isLoadingMore.value = true
  manualDisable.value = true

  try {
    if (currentScreenData.value.offset) {
      isDeleted ? await fetchScreenSearchList(1) : await fetchScreenSearchList(0)
    } else if (currentSearchInputData.value.offset) {
      isDeleted ? await searchItemByInput(1) : await searchItemByInput(0)
    } else {
      isHistory
        ? fetchHistoryItem('')
        : isDeleted
        ? await fetchNewSearchList(1)
        : await fetchNewSearchList(0)
    }
    manualDisable.value = false
  } catch {
    manualDisable.value = true
  } finally {
    isLoadingMore.value = false
  }
}

// 多选操作
const checkboxOperate = ref(false)

const showOperate = (index: number) => {
  if (!isHistory) {
    // 如果处在历史记录界面，则长按页面不起效果
    checkboxOperate.value = true
    currentSearchList.value.itemList[index].isChecked = true
  }
}

// 点击
const chooseItem = (item: ItemList) => {
  // 多选状态下点击选中
  if (checkboxOperate.value) {
    item.isChecked = !item.isChecked
  } else {
    // 非多选状态下跳转到详情页
    getDetail(item.type, item.id, '')
    uni.navigateTo({
      url: `/pages/details/details`
    })
  }
}

// 多选编辑
const editMultiple = async () => {
  // uni.navigateTo({
  //   url: `/pages/edit/multiple/multiple`
  uni.showToast({
    title: '开发中~',
    icon: 'none',
    duration: 2000
  })
  // })
}

// 删除
const deleteItem = async (type: number) => {
  await batchDeleteSearch(currentSearchList.value.checkedItemList, type)
  uni.showToast({
    title: '删除成功',
    icon: 'success'
  })
}

// 恢复
const recoverItem = async () => {
  await restoreDeletedItem(currentSearchList.value.checkedItemList)
  uni.showToast({
    title: '恢复成功',
    icon: 'success'
  })
}

// 取消多选
const cancelChecking = () => {
  checkboxOperate.value = false
  // 将所有属性的 isChecked 重置为 false
  for (let i = 0; i < currentSearchList.value.itemList.length; i++) {
    currentSearchList.value.itemList[i].isChecked = false
  }
}
</script>

<style lang="scss" scoped></style>
