<template>
  <view class="dependence" :style="{ paddingTop: navBarHeight + 'px' }">
    <u-navbar
      title="关联物品"
      autoBack
      titleStyle="font-weight:bold"
      :bgColor="navBarColor"
    ></u-navbar>

    <view style="display: flex">
      <SearchInput @searchEmpty="determineEmpty" />
      <SearchScreen @screenEmpty="determineEmpty" />
    </view>

    <view class="dependence__total">
      <view class="dependence__total__text">共{{ currentSearchList.total }}件物品</view>
    </view>

    <DependenceList v-if="!isEmpty" :isLoading="isLoading" :manualDisable="manualDisable" />

    <u-modal
      :show="showModal"
      title="确认关联？"
      showCancelButton
      width="500rpx"
      @cancel="showModal = false"
      @confirm="confirmRelated"
    ></u-modal>
    <button v-if="!isEmpty" class="dependence__confirm" @click="showModal = true">确认</button>

    <!-- 空 -->
    <Empty v-if="isEmpty" type="search" />
  </view>
</template>

<script setup lang="ts">
import { onShow, onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useSearchStore } from '@/stores/search'
import { useFormStore } from '@/stores/form'
import { storeToRefs } from 'pinia'

const searchStore = useSearchStore()
const formStore = useFormStore()
const { currentSearchList } = storeToRefs(searchStore)
const { fetchNewSearchList } = searchStore

// 是否正在加载
const isLoading = ref(false)
// 手动控制禁用加载
const manualDisable = ref(false)
// 是否为空
const isEmpty = ref(false)
// 是否显示确认模态框
const showModal = ref(false)

// 判断搜索/筛选后是否为空
const determineEmpty = () => {
  if (!currentSearchList.value.itemList.length) {
    isEmpty.value = true
  } else {
    isEmpty.value = false
  }
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

function uniqueFunc(arr: any, uniId: string) {
  const res = new Map()
  return arr.filter((item: any) => !res.has(item[uniId]) && res.set(item[uniId], 1))
}

// 确认关联
const confirmRelated = () => {
  if (currentSearchList.value.itemList.filter((item) => item.isChecked).length) {
    formStore.tempItemData.items.push(
      ...currentSearchList.value.itemList
        .filter((item) => item.isChecked)
        .map((item) => {
          return {
            id: item.id,
            name: item.name,
            cover: item.cover
          }
        })
    )
    formStore.form.items.push(
      ...currentSearchList.value.itemList
        .filter((item) => item.isChecked)
        .map((item) => {
          return {
            id: item.id,
            name: item.name,
            cover: item.cover
          }
        })
    )
    formStore.tempItemData.items = uniqueFunc(formStore.tempItemData.items, 'id')
    formStore.form.items = uniqueFunc(formStore.form.items, 'id')
    uni.showToast({
      title: '关联成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    showModal.value = false
  } else {
    uni.showToast({
      title: '未选择物品',
      icon: 'error'
    })
  }
}

// 下拉刷新
onPullDownRefresh(async () => {
  await loadSearchList()
  uni.stopPullDownRefresh()
})

// navbar 高度
const navBarHeight = ref<number>(44)

// 获取小程序胶囊按钮
const getCapsule = () => {
  const menuButton = uni.getMenuButtonBoundingClientRect()
  navBarHeight.value = menuButton.bottom + 16
}

// navbar 颜色
const navBarColor = ref('transparent')

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
.dependence {
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

  &__confirm {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 120rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 230rpx;
    height: 85rpx;
    font-size: 30rpx;
    color: #fff;
    border-radius: 13px;
    background-color: $uni-theme-color;
    z-index: 999;
  }
}
</style>
