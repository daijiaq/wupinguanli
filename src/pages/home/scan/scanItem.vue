<template>
  <view class="scan-page">
    <u-navbar
      bgColor="transparent"
      placeholder
      title="扫码"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>

    <view class="scan-page__title">扫描到的物品</view>
    <u-checkbox-group v-model="selectedItemNames">
      <view
        class="scan-page__item"
        v-for="(item, idx) in mainItems"
        :key="'main-' + idx"
        @longpress="handleLongPress"
        @click="goToDetailPage(item)"
      >
        <image class="scan-page__item-image" :src="item.img" mode="aspectFill" />
        <view class="scan-page__item-info">
          <view class="scan-page__item-name">{{ item.name }}</view>
          <view class="scan-page__item-path">{{ item.path }}</view>
        </view>
        <u-checkbox
          v-if="multiSelectMode"
          :name="'main-' + idx"
          shape="circle"
          class="scan-page__item-checkbox"
          size="22"
          activeColor="#3988ff"
          @click.stop
        />
      </view>
    </u-checkbox-group>
    <!-- 如果是空间还要渲染内含物品 -->
    <view class="scan-page__space-title" v-if="isSpace">内含物品</view>
    <u-checkbox-group v-if="isSpace" v-model="selectedItemNames">
      <view
        class="scan-page__item"
        v-for="(item, idx) in innerItems"
        :key="'inner-' + idx"
        @longpress="handleLongPress"
        @click="goToDetailPage(item)"
      >
        <image class="scan-page__item-image" :src="item.img" mode="aspectFill" />
        <view class="scan-page__item-info">
          <view class="scan-page__item-name">{{ item.name }}</view>
          <view class="scan-page__item-path">{{ item.path }}</view>
        </view>
        <u-checkbox
          v-if="multiSelectMode"
          :name="'inner-' + idx"
          shape="circle"
          class="scan-page__item-checkbox"
          size="22"
          activeColor="#3988ff"
          @click.stop
        />
      </view>
    </u-checkbox-group>
    <!-- 底部操作栏 -->
    <view class="scan-page__actions" v-if="multiSelectMode || !isSpace">
      <view class="action-item" @click="handleAction('delete')">
        <image class="action-icon" src="@/static/icons/trash.png" />
        <view class="action-label">删除</view>
      </view>
      <view class="action-item" @click="handleAction('edit')">
        <image class="action-icon" src="@/static/icons/edit.png" />
        <view class="action-label">编辑</view>
      </view>
      <view class="action-item" @click="handleAction('move')">
        <image class="action-icon" src="@/static/icons/photo-focus-ellipse.png" />
        <view class="action-label">扫码移入</view>
      </view>
      <view class="action-item" @click="handleCancel">
        <image class="action-icon" src="@/static/icons/close-ellipse.png" />
        <view class="action-label">取消</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSpaceStore } from '@/stores/space'
import { useFormStore } from '@/stores/form'
const spaceStore = useSpaceStore()
const { scanItemRequest, getInnerItems, preScanRequest } = spaceStore
const formStore = useFormStore()
const { getShareItemDetail, batchDeleteItems, getDetail } = formStore
// home.vue传到该页面的参数
let pageOptions: any = {}

// 是否为“空间”类型（true 则不显示底部按钮）
const isSpace = ref(false)
const multiSelectMode = ref(false) // 是否进入多选模式

// 所有item的唯一name（如 main-0, inner-0, inner-1...）
const selectedItemNames = ref<string[]>([])

interface ScanItem {
  name: string
  path: string
  img: string
  type: string
  //物品id
  id: number
  userId: number
}
// 主物品列表
const mainItems = ref<ScanItem[]>([])
// 空间内部物品列表
const innerItems = ref<ScanItem[]>([])
// 默认图片
const DEFAULT_IMG =
  'https://tse2.mm.bing.net/th/id/OIP.8KlnNUYOJudsgoReJE6KsAHaQD?rs=1&pid=ImgDetMain&o=7&rm=3'

// 长按进入多选模式
const handleLongPress = () => {
  multiSelectMode.value = true
}
// 跳转到物品详情页
const goToDetailPage = async (item: ScanItem) => {
  if (multiSelectMode.value) return // 多选模式禁止跳转
  // 判断是否为分享物品
  if (pageOptions?.isShareItem) {
    const params = {
      type: Number(item.type),
      itemId: Number(item.id),
      userId: Number(pageOptions.userId),
      password: ''
    }
    console.log('跳转到分享物品详情页，参数:', params.userId)
    await getShareItemDetail(params.type, params.itemId, params.userId, params.password)
    uni.navigateTo({
      url: `/pages/details/details?isShareItem=${pageOptions.isShareItem}`
    })
  } else {
    //  非分享物品调getDetail接口
    const params = {
      type: Number(item.type),
      itemId: Number(item.id),
      password: ''
    }
    console.log('跳转到普通物品详情页，参数:', params)
    await getDetail(params.type, params.itemId, params.password)
    uni.navigateTo({
      url: `/pages/details/details?itemId=${params.itemId}&type=${params.type}`
    })
  }
}
// 底部操作栏按钮校验和取消逻辑
const handleAction = async (action: string) => {
  if (isSpace.value && selectedItemNames.value.length === 0) {
    uni.showToast({
      title: '还未选择物品',
      icon: 'none'
    })
    return
  }
  // 根据action类型做后续处理
  if (action === 'delete') {
    console.log('scanItem', pageOptions.isOwner)
    // 判断是否有权限删除
    if (pageOptions && pageOptions.isOwner === 'false') {
      uni.showToast({
        title: '不可以删除他人物品',
        icon: 'none'
      })
      return
    }
    // 删除逻辑
    uni.showModal({
      title: '提示',
      content: '是否删除所选物品',
      cancelText: '取消',
      confirmText: '确认',
      success: async (res) => {
        if (res.confirm) {
          // 1. 获取所有选中的item的id
          const allItems = [
            ...mainItems.value.map((item, idx) => ({ ...item, name: 'main-' + idx })),
            ...innerItems.value.map((item, idx) => ({ ...item, name: 'inner-' + idx }))
          ]
          const selectedIds = allItems
            .filter((item) => selectedItemNames.value.includes(item.name))
            .map((item) => item.id)
          // 2. 调用批量删除接口
          await batchDeleteItems(selectedIds)
          // 3. 检查是否删除了空间本身
          const isDeletingSpace =
            isSpace.value && selectedItemNames.value.some((name) => name.startsWith('main-'))
          if (isDeletingSpace) {
            // 如果删除的是空间本身，直接返回上一页
            uni.showToast({
              title: '空间已删除',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1200)
          } else {
            // 4. 获取最新数据渲染
            await fetchScanData(pageOptions)
          }
          // 5. 删除成功后清空多选状态
          multiSelectMode.value = false
          selectedItemNames.value = []
        }
        // 取消则什么都不做
      }
    })
  } else if (action === 'edit') {
    // 编辑逻辑
    // 如果不是自己的物品或空间
    if (pageOptions.isOwner === 'false') {
      uni.showToast({
        title: '不可以编辑他人物品',
        icon: 'none'
      })
      return
    }
    // 如果是自己的
    if (!isSpace.value && pageOptions.isOwner === 'true') {
      // 非空间，直接进入编辑页
      const item = mainItems.value[0]
      await getDetail(Number(item.type), item.id, '')
      uni.navigateTo({
        url: `/pages/edit/edit?from=scan&itemId=${item.id}&type=${item.type}`
      })
      return
    }
    // 空间下，先合并所有选中的
    const selectedItems = [
      ...mainItems.value.filter((item, idx) => selectedItemNames.value.includes('main-' + idx)),
      ...innerItems.value.filter((item, idx) => selectedItemNames.value.includes('inner-' + idx))
    ]
    if (selectedItems.length === 0) {
      uni.showToast({ title: '请先选择要编辑的物品', icon: 'none' })
      return
    }
    if (selectedItems.length > 1) {
      uni.showToast({ title: '只能编辑一个物品', icon: 'none' })
      return
    }
    const item = selectedItems[0]
    await getDetail(Number(item.type), item.id, '')
    uni.navigateTo({
      url: `/pages/edit/edit?from=scan&itemId=${item.id}&type=${item.type}`
    })
  } else if (action === 'move') {
    // 扫码移入逻辑
  }
}
// 点击取消退出多选模式
function handleCancel() {
  multiSelectMode.value = false
  selectedItemNames.value = []
}
// 1. 数据获取渲染逻辑
async function fetchScanData(options: any) {
  // 如果删除的是空间本身，需要调用preScanRequest， 因为scanItemRequest还会继续返回数据
  let preScanRes = null
  try {
    preScanRes = await preScanRequest(
      Number(options?.itemId),
      Number(options?.userId),
      Number(options?.type),
      Number(options?.privacy),
      Number(options?.hide)
    )
    console.log('preScanRes', preScanRes)
  } catch (e) {
    console.log('preScanRequest error', e)
    preScanRes = null
  }
  if (!preScanRes) {
    mainItems.value = []
    innerItems.value = []
    return
  }
  isSpace.value = !!(options && String(options.type) === '1')
  // 获取物品数据
  try {
    const res = await scanItemRequest(Number(options?.itemId), Number(options?.userId))
    if (res) {
      const item = res
      const parsed = [
        {
          name: item.name,
          path: (item.path || [])
            .slice()
            .reverse()
            .map((each) => each.name)
            .join(' -> '),
          img: item.cover || DEFAULT_IMG,
          type: item.type,
          id: item.id,
          userId: item.userId
        }
      ]
      mainItems.value = parsed
    }
  } catch (error) {
    console.log('scanItemRequest error', error)
    // 如果获取物品数据失败，可能是物品已被删除，清空数据并返回
    mainItems.value = []
    innerItems.value = []
    return
  }
  // 如果是空间类型，获取内部物品列表
  if (isSpace.value) {
    try {
      const innerRes = await getInnerItems(Number(options?.userId), Number(options?.itemId), 1, 10)
      if (innerRes && Array.isArray(innerRes.records)) {
        innerItems.value = innerRes.records.map((item: any) => ({
          name: item.name,
          path: (item.path || [])
            .slice()
            .reverse()
            .map((each: any) => each.name)
            .join(' -> '),
          img: item.cover || DEFAULT_IMG,
          type: item.type,
          id: item.id,
          userId: item.userId
        }))
      } else {
        innerItems.value = []
      }
    } catch (error) {
      console.log('getInnerItems error', error)
      // 如果获取内部物品失败，可能是空间已被删除，清空数据
      innerItems.value = []
    }
  } else {
    innerItems.value = []
  }
}
// 判断传参是否为“空间
onLoad(async (options) => {
  pageOptions = options
  await fetchScanData(options)
})
</script>

<style lang="scss">
.scan-page {
  padding: 0 32rpx;
  padding-bottom: 140rpx;
  &__title {
    padding: 12rpx 26rpx;
    font-size: 28rpx;
    color: #666;
    background-color: #f5f5f5;
    border-radius: 20rpx;
    display: inline-block;
    margin: 24rpx 0 8rpx 0;
  }
  &__space-title {
    padding: 12rpx 26rpx;
    font-size: 28rpx;
    color: #666;
    background-color: #f5f5f5;
    border-radius: 20rpx;
    display: inline-block;
    margin: 24rpx 0 8rpx 0;
  }
  &__space-container {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
  &__space__item {
    display: flex;
    align-items: center;
    padding: 21rpx 4rpx 39rpx;
    border-bottom: 1rpx solid #dae1ff;
    &-image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 12rpx;
      margin-right: 24rpx;
      background-color: #ddd;
    }
    &-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-name {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 35rpx;
    }
    &-path {
      font-size: 26rpx;
      color: #999;
    }
    &-checkbox {
      position: absolute;
      right: 20rpx;
      top: 20rpx;
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      border: 2rpx solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      background-color: white;
      font-size: 24rpx;
      &.selected {
        background-color: #4a90e2;
        border-color: #4a90e2;
      }
    }
  }

  &__item-container {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  &__item {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: 24rpx 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
    background: #fff;
  }

  &__item-image {
    width: 80rpx;
    height: 80rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
    background-color: #ddd;
    flex-shrink: 0;
  }

  &__item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__item-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
  }

  &__item-path {
    font-size: 26rpx;
    color: #999;
  }
  &__item-checkbox {
    margin-left: auto;
    margin-right: 24rpx;
    flex-shrink: 0;
  }
  &__actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    z-index: 1000;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24rpx;
      color: #333;

      .action-icon {
        width: 48rpx;
        height: 48rpx;
        margin-bottom: 8rpx;
      }

      .action-label {
        font-size: 24rpx;
      }
    }
  }
}
</style>
