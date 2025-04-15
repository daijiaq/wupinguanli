<template>
  <view class="space">
    <u-navbar bgColor="#F5F5F5" leftIcon="" />
    <template v-if="!isLoading && !isError">
      <!-- 背景颜色 -->
      <view class="space__bg"></view>
      <!-- header -->
      <view class="space__header" :style="{ top: navBarHeight + 'px' }">
        <view class="space__header__icon-wrapper">
          <view class="space__header__icon-wrapper__icon">
            <u-icon color="#fff" size="50rpx" @click="jumpPageSearch" name="search"></u-icon>
          </view>
          <view class="space__header__icon-wrapper__icon">
            <u-icon color="#fff" size="40rpx" @click="jumpPageAdd" name="plus"></u-icon>
          </view>
          <view class="space__header__icon-wrapper__icon">
            <u-icon color="#fff" size="50rpx" @click="scanCode" name="scan"></u-icon>
          </view>
        </view>
        <!-- <view v-if="!spaceData[0] && useForm.currentFloor === 2" class="space__header__hello">
        <u-text size="80rpx" text="HELLO!"></u-text>
      </view>
      <view v-if="!spaceData[0] && useForm.currentFloor === 2" class="space__header__empty">
        尚未添加物品,快去添加吧
        <image class="space__header__empty-chair" src="../../static/chair.png" />
        <image class="space__header__empty-plant" src="../../static/plant.png" />
      </view> -->
      </view>

      <!-- 共同管理 -->
      <!-- <view class="space__tabs">
        <u-tabs
          :list="[{ name: '我的' }, { name: '共同管理' }]"
          itemStyle="color: #666666; padding: 0; margin-right: 20rpx; height: 34px;"
        />
      </view> -->

      <!-- header 占位元素 -->
      <view :style="{ height: '70rpx' }"></view>
      <!-- 列表主体 -->
      <u-skeleton rows="20" :loading="isLoading" title animate>
        <view v-if="!isLoading" style="background-color: #f5f5f5">
          <template v-for="(item, index) in spacesData" :key="index">
            <SpaceItem
              :bgColor="bgColor(index)"
              @click="chooseItem(index)"
              @longpress="longpress(index)"
              @tryJumpPageDetail="tryJumpPageDetail"
              :item="item"
              :show="showOperate"
            />
          </template>
        </view>
      </u-skeleton>
      <!-- 空 -->
      <Empty v-if="isEmpty" />
      <!-- 加载更多 -->
      <u-loadmore
        v-if="!isLoading && !isEmpty"
        :status="loadMoreStatus"
        line
        bgColor="#f5f5f5"
        loadingText="努力加载中，先喝杯茶"
        nomoreText="没有更多了"
        marginTop="0"
        marginBottom="0"
        custom-style="padding: 10px 0 10px 0;"
      />
      <!-- 多选弹出框 -->
      <view v-show="showOperate" class="space__operate">
        <view>
          <u-icon @click="jumpPageEdit" size="50rpx" name="edit-pen-fill" color="#3988ff"></u-icon>
          <u-text size="25rpx" color="#88898c" align="center" text="编辑" :bold="true" />
        </view>
        <view>
          <u-icon @click="showDelete = true" size="50rpx" name="trash" color="#898a8d"></u-icon>
          <u-text size="25rpx" color="#88898c" align="center" text="删除" :bold="true" />
        </view>
        <view>
          <u-icon @click="closeOperate" size="50rpx" name="close" color="#898a8d"></u-icon>
          <u-text size="25rpx" color="#88898c" align="center" text="取消" :bold="true" />
        </view>
      </view>
      <!-- 确认删除弹出框 -->
      <u-modal
        title="确认删除？"
        @cancel="showDelete = false"
        @confirm="confirmDelete"
        :showCancelButton="true"
        :show="showDelete"
        width="500rpx"
      >
      </u-modal>
      <!-- 密码弹窗 -->
      <PasswordPopup
        :popup="popup"
        @close="popup = false"
        @confirmGesture="confirmGesture"
        @confirmNumber="confirmNumber"
        :isValidate="true"
      />
    </template>

    <!-- 加载失败 -->
    <view v-if="!isLoading && isError" class="space__error" @click="refresh()">
      <view>加载失败，点击屏幕重新加载</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow, onReachBottom, onPullDownRefresh, onLoad } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'

// 引入组件
import SpaceItem from '@/components/Space/SpaceItem/SpaceItem.vue'

// 引入类型
import type { BriefData } from '@/types/space'

// 引入store
import { useFormStore } from '@/stores/form'
import { useSpaceStore } from '@/stores/space'
import { useSearchStore } from '@/stores/search'
const spaceStore = useSpaceStore()
const { getFirstFloorRooms, preScanRequest } = spaceStore
const { spacesInfo } = storeToRefs(spaceStore)
const formStore = useFormStore()
const { getDetail, batchDeleteItems, getShareItemDetail } = formStore
const searchStore = useSearchStore()
const { currentTagList, currentSearchInputData } = storeToRefs(searchStore)

// 空间数据
const spacesData = ref<BriefData[]>([])
// 加载更多状态
const loadMoreStatus = ref('')
// 是否正在加载
const isLoading = ref(true)
// 是否为空
const isEmpty = ref(false)
// navbar 高度
const navBarHeight = ref<number>(44)
// 是否加载失败
const isError = ref(false)
// 密码弹窗
const popup = ref(false)
// 是否跳转到编辑页
let isEdit = false
// 是否处于扫码
let isScan = false
// 是否为分享物品
let isShareItem = false
// 暂存物品ID
let tempItemId = 0
// 暂存类型
let tempType = 0
// 暂存用户ID
let tempUserId = 0

// 是否没有更多了
const isNoMore = computed(
  () =>
    spacesInfo.value.spaceData.length < spacesInfo.value.size ||
    (spacesInfo.value.spaceData.length &&
      spacesInfo.value.spaceData.length === spacesInfo.value.total)
)

// 当前楼层
formStore.currentFloor++

// 获取小程序胶囊按钮
const getCapsule = () => {
  const menuButton = uni.getMenuButtonBoundingClientRect()
  navBarHeight.value = menuButton.bottom
}

onLoad(() => {
  //显示加载框
  uni.showLoading({
    title: '加载中'
  })
})

onShow(async () => {
  // 从搜索页返回，清空搜索、筛选条件
  currentSearchInputData.value.inputData = {
    name: ''
  }
  currentTagList.value.tagsList.forEach((item) => {
    item.isChecked = false
  })
  //开启分享功能
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  // 获取小程序胶囊按钮位置
  getCapsule()
  //获取路径并初始化路径
  await refresh()
  // 滚动条回到顶部
  uni.pageScrollTo({
    duration: 0,
    scrollTop: 0
  })
})

//下拉刷新
onPullDownRefresh(async () => {
  await refresh()
  uni.stopPullDownRefresh()
})

// 触底加载更多
onReachBottom(async () => {
  if (!isNoMore.value) {
    loadMoreStatus.value = 'loading'
    await getFirstFloorRooms()
  } else {
    loadMoreStatus.value = 'nomore'
  }
})

const longpress = (index: number) => {
  showOperate.value = true
  checkbox.value[index] = true
}

// 验证手势密码
async function confirmGesture(password: string) {
  popup.value = false
  if (isScan) {
    isShareItem = true
    isScan = false
    await getShareItemDetail(2, tempItemId, tempUserId, password)
  } else {
    isShareItem = false
    await getDetail(tempType, tempItemId, password)
  }
  if (isEdit) {
    uni.navigateTo({
      url: `/pages/edit/edit`
    })
  } else
    uni.navigateTo({
      url: `/pages/details/details?isShareItem=${isShareItem}`
    })
  isEdit = false
}
// 验证数字密码
async function confirmNumber(password: string) {
  popup.value = false
  if (isScan) {
    isShareItem = true
    isScan = false
    await getShareItemDetail(2, tempItemId, tempUserId, password)
  } else {
    isShareItem = false
    await getDetail(tempType, tempItemId, password)
  }
  if (isEdit)
    uni.navigateTo({
      url: `/pages/edit/edit`
    })
  else
    uni.navigateTo({
      url: `/pages/details/details?isShareItem=${isShareItem}`
    })
  isEdit = false
}

async function tryJumpPageDetail(id: number, type: number, privacy: number) {
  isEdit = false
  if (privacy) {
    tempItemId = id
    tempType = type
    popup.value = true
  } else {
    await getDetail(type, id, '')
    uni.navigateTo({
      url: `/pages/details/details`
    })
  }
}

async function tryJumpPageEdit(id: number, type: number, privacy: number) {
  isEdit = true
  if (privacy) {
    tempItemId = id
    tempType = type
    popup.value = true
  } else {
    await getDetail(type, id, '')
    uni.navigateTo({
      url: `/pages/edit/edit`
    })
  }
}

// 选择的物品数组
const checkbox = ref<boolean[]>([])

// 是否显示操作菜单
const showOperate = ref(false)
// 选择物品或空间触发的回调
const chooseItem = (index: number): void => {
  if (showOperate.value) checkbox.value[index] = !checkbox.value[index]
}
// 修改背景颜色
const bgColor = (index: number): string | undefined => {
  if (checkbox.value[index]) return 'background-color: #c8dbfe;'
}

// 多选编辑操作
async function jumpPageEdit(): Promise<void> {
  // 多选物品数量
  let count = 0
  // 选择的第一个物品隐私权
  let firstPrivacy = 0
  // 选择的第一个物品类型
  let firstType = 0
  // 是否存在隐私权为1的物品
  let havePrivacy = false
  // 打开编辑状态,输入完密码后将跳转至编辑页
  isEdit = true
  // 清空储存多选物品的id数组
  formStore.ids = []
  for (let i = 0; i < checkbox.value.length; i++) {
    // 统计当前选择物品数量
    if (checkbox.value[i]) {
      count++
      // 记录物品id
      formStore.ids.push(spacesData.value[i].id)
      // 记录第一个物品信息
      if (count === 1) {
        firstPrivacy = spacesData.value[i].privacy
        firstType = spacesData.value[i].type
      }
      // 存在隐私权为true的物品,置havePrivacy为true
      if (spacesData.value[i].privacy) {
        havePrivacy = true
      }
    }
    // 存在隐私权为true的物品,且count大于1则跳出循环
    if (havePrivacy && count > 1) {
      uni.showToast({
        title: '多选编辑时,请确保所有物品都是公开的',
        icon: 'none'
      })
      return
    }
  }
  if (count === 0) {
    // 提示选择物品
    uni.showToast({
      title: '请选择物品',
      icon: 'none'
    })
  } else if (count === 1) {
    // 跳转至单选编辑页面
    tryJumpPageEdit(formStore.ids[0], firstType, firstPrivacy)
  } else {
    // 跳转至多选编辑页面
    uni.navigateTo({
      url: '/pages/edit/multiple/multiple'
    })
  }
}

// 是否显示删除弹窗
const showDelete = ref(false)
//确认删除
async function confirmDelete(): Promise<void> {
  showDelete.value = false
  formStore.ids = []
  for (let i = 0; i < checkbox.value.length; i++) {
    if (checkbox.value[i]) {
      formStore.ids.push(spacesData.value[i].id)
    }
  }
  await batchDeleteItems(formStore.ids)
  uni.showToast({
    title: '删除成功',
    icon: 'none'
  })
  closeOperate()
  refresh()
}

// 关闭操作菜单的回调
const closeOperate = (): void => {
  showOperate.value = false
  for (let i = 0; i < checkbox.value.length; i++) {
    checkbox.value[i] = false
  }
}

// 扫码
const scanCode = (): void => {
  uni.scanCode({
    success(res) {
      const result = JSON.parse(res.result)
      jumpPageDetail(result.userId, result.itemId)
    },
    fail(err) {
      console.log('扫码失败:', err)
    }
  })
}

// 扫码跳转详情页
const jumpPageDetail = async (userId: number, itemId: number) => {
  const res = await preScanRequest(userId, itemId)
  // 1.扫描的是物品、房子
  if (itemId !== 0) {
    if (res.state === 0) {
      isShareItem = true
      await getShareItemDetail(2, itemId, userId, '')
      uni.navigateTo({
        url: `/pages/details/details?isShareItem=${isShareItem}`
      })
    } else {
      tempUserId = userId
      tempItemId = itemId
      tempType = 2
      isScan = true
      popup.value = true
    }
  } else {
    // 2.扫描的是用户
    uni.navigateTo({
      url: `/pages/user/friends/detail/detail?id=${userId}&isFriend=${
        res.state === 0 ? true : false
      }`
    })
  }
}

//跳转搜索页
const jumpPageSearch = (): void => {
  uni.navigateTo({
    url: '/pages/search/search'
  })
}

//跳转添加页
const jumpPageAdd = (): void => {
  uni.navigateTo({
    url: '/pages/new/new'
  })
}

// 获取数据
const refresh = async () => {
  try {
    // 请求错误状态初始化
    isError.value = false
    // 空间请求参数初始化
    spacesInfo.value.current = 0
    spacesInfo.value.total = 0
    spacesInfo.value.spaceData = []
    // 获取当前空间数据
    await getFirstFloorRooms()
    spacesData.value = spacesInfo.value.spaceData
    // 修改正在请求状态
    isLoading.value = false
    //隐藏加载框
    uni.hideLoading()
    // 请求完后判断是否为空
    isEmpty.value = !spacesData.value.length
  } catch {
    isError.value = true
  }
}
</script>

<style lang="scss">
.space {
  padding-top: 100px;

  &__bg {
    position: absolute;
    width: 100vw;
    height: 87vh;
    background-color: #f5f5f5;
    z-index: -1;
  }

  &__header {
    position: fixed;
    width: 100vw;
    min-height: 100rpx;
    padding-top: 23rpx;
    background: #f5f5f5;
    z-index: 999;

    &__icon-wrapper {
      position: absolute;
      right: 30rpx;
      display: flex;
      flex-direction: row-reverse;

      &__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70rpx;
        height: 70rpx;
        border-radius: 10rpx;
        background-color: #7d7191;
        margin-right: 20rpx;
      }
    }
  }

  &__error {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    font-size: 18px;
    background-color: #fff;
  }

  &__hello {
    width: 600rpx;
    margin: 0 auto;
    margin-top: 100rpx;
  }

  &__operate {
    box-sizing: border-box;
    display: flex;
    position: fixed;
    bottom: 50rpx;
    border-radius: 20rpx;
    left: 75rpx;
    width: 600rpx;
    height: 170rpx;
    padding: 30rpx 50rpx 0 50rpx;
    justify-content: space-around;
    background-color: #f8f8f8;
  }

  &__empty {
    box-sizing: border-box;
    padding: 35rpx;
    font-size: 30rpx;
    color: #979797;
    background-color: #bcd8ff;
    position: relative;
    margin: 0 auto;
    width: 650rpx;
    height: 200rpx;
    border-radius: 30rpx;

    &-chair {
      width: 250rpx;
      height: 250rpx;
      position: absolute;
      right: 50rpx;
      bottom: 0;
    }

    &-plant {
      width: 100rpx;
      height: 100rpx;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }

  &__tabs {
    padding-top: 80rpx;
    width: 650rpx;
    margin: 0 auto;
  }
}
</style>
