<template>
  <view class="space">
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
        <view class="space__header__spaces">
          <view class="space__header__spaces__wrapper">
            <view
              v-for="(item, index) in spaceStore.spaces.slice(0, formStore.currentFloor - 1)"
              :key="index"
              class="space__header__spaces__wrapper-unit"
            >
              <view class="space__header__spaces__wrapper-unit-circle" />
              <view class="space__header__spaces__wrapper-unit-line" />
              <view class="space__header__spaces__wrapper-unit-name">
                {{ item.name }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 共同管理 -->
      <!-- <view class="space__tabs">
        <u-tabs
          :list="[{ name: '我的' }, { name: '共同管理' }]"
          itemStyle="color: #666666; padding: 0; margin-right: 20rpx; height: 34px;"
        />
      </view> -->

      <!-- header 占位元素 -->
      <view :style="{ height: '170rpx' }"></view>
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
          <u-icon @click="openSpace" size="50rpx" name="rewind-right-fill" color="#3988ff"></u-icon>
          <u-text size="25rpx" color="#88898c" align="center" text="移动" :bold="true" />
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
      <!-- 从属空间 -->
      <u-popup :safeAreaInsetBottom="false" round="20rpx" mode="bottom" :show="showSpace">
        <view class="space__subordinateSpace">
          <view class="space__subordinateSpace__title">
            <u-text bold size="40rpx" :text="'从属空间'" />
          </view>
          <view class="space__subordinateSpace__confirm">
            <u-text @click="showSpace = false" lines="1" size="20rpx" :text="'取消'" />
            <u-line margin="15rpx 20rpx" color="#efeff2" length="50%" direction="col"></u-line>
            <u-text @click="confirmMove()" color="#82b4fe" lines="1" size="20rpx" :text="'确认'" />
          </view>
        </view>
        <view class="space__subordinateSpace__currentSpace">
          <view class="space__subordinateSpace__currentSpace__icon">
            <u-icon size="27rpx" name="play-right-fill" color="#3988ff"></u-icon>
          </view>
          <text
            style="font-weight: 600"
            v-for="(item, index) in spacesBox.slice(0, pathFloor)"
            :key="index"
          >
            {{ item.name }}
            <text v-if="index < pathFloor - 1"> >&nbsp; </text>
          </text>
        </view>
        <view v-show="showSpace" v-if="!pathsLoading" class="space__subordinateSpace__floor">
          <SubordinateSpaceItem
            v-for="(item, subIndex) in useSpaceStore().pathsInfo"
            :ids="formStore.ids"
            :titlePadding="'10rpx 40rpx'"
            :tagPadding="'0 70rpx'"
            v-show="pathFloor >= subIndex"
            @radioClick="radioClick"
            :parent="subIndex ? spacesBox[subIndex - 1].id : 0"
            :id="spacesBox[subIndex].id"
            :subordinateSpaces="item"
            :key="subIndex"
            :floor="subIndex + 1"
            :currentFloor="formStore.currentFloor"
          />
        </view>
      </u-popup>
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
import SubordinateSpaceItem from '@/components/Space/SubordinateSpaceItem/SubordinateSpaceItem.vue'

// 引入类型
import type { Path, BriefData } from '@/types/space'

// 引入store
import { useFormStore } from '@/stores/form'
import { useSpaceStore } from '@/stores/space'
const spaceStore = useSpaceStore()
const { getFirstFloorRooms, getRoomItems, batchMove, getAllPaths } = spaceStore
const { spacesInfo } = storeToRefs(spaceStore)
const formStore = useFormStore()
const { getDetail, batchDeleteItems } = formStore

// 空间数据
const spacesData = ref<BriefData[]>([])
// 选择的从属空间
const spacesBox = ref<Path[]>([])
// 路径加载
const pathsLoading = ref(true)
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
// 显示从属空间
const showSpace = ref(false)
// 密码弹窗
const popup = ref(false)
// 是否跳转到编辑页
let isEdit = false
// 暂存ID
let tempItemId = 0
// 暂存类型
let tempType = 0

const currentId = formStore.currentId

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
  //开启分享功能
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
})

onShow(async () => {
  //显示加载框
  uni.showLoading({
    title: '加载中'
  })
  //获取路径并初始化路径
  await refresh()
  //隐藏加载框
  uni.hideLoading()
  // 获取小程序胶囊按钮位置
  getCapsule()
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

// 验证手势密码
async function confirmGesture(password: string) {
  popup.value = false
  await getDetail(tempType, tempItemId, password)
  // 是否跳转至多选编辑
  if (isEdit)
    uni.navigateTo({
      url: `/pages/edit/edit`
    })
  else
    uni.navigateTo({
      url: `/pages/details/details`
    })
  isEdit = false
}

// 验证数字密码
async function confirmNumber(password: string) {
  popup.value = false
  await getDetail(tempType, tempItemId, password)
  // 是否跳转至多选编辑
  if (isEdit)
    uni.navigateTo({
      url: `/pages/edit/edit`
    })
  else
    uni.navigateTo({
      url: `/pages/details/details`
    })
  isEdit = false
}

const longpress = (index: number) => {
  showOperate.value = true
  checkbox.value[index] = true
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
// 当前层数
const pathFloor = ref<number>(0)

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

// 从属空间弹窗打开时的回调
const openSpace = (): void => {
  showSpace.value = true
  formStore.ids = []
  for (let i = 0; i < checkbox.value.length; i++) {
    if (checkbox.value[i]) {
      formStore.ids.push(spacesData.value[i].id)
    }
  }
}

// 从属空间标签点击事件
const radioClick = (index: number, floor: number): void => {
  // 点击已选择标签
  if (spacesBox.value[floor - 1].id === spaceStore.pathsInfo[floor - 1][index].id) {
    // 修改当前楼层
    pathFloor.value = floor - 1
    // 清空当前点击索引之后的已选择空间id缓存
    for (let i = floor - 1; i < spacesBox.value.length; i++) {
      if (!spacesBox.value[i]) break
      spacesBox.value[i] = { fatherId: 0, id: 0, name: '', layer: 0 }
    }
  }
  // 点击未选择标签
  else {
    // 修改当前楼层
    pathFloor.value = floor
    // 将当前id存入已选择id缓存中
    spacesBox.value[floor - 1] = spaceStore.pathsInfo[floor - 1][index]
    // 清空当前点击索引之后的已选择空间id缓存
    for (let i = floor; i < spacesBox.value.length; i++) {
      if (!spacesBox.value[i]) break
      spacesBox.value[i] = { fatherId: 0, id: 0, name: '', layer: 0 }
    }
  }
}

// 确认移动
async function confirmMove(): Promise<void> {
  showSpace.value = false
  const path = []
  for (let i = 0; i < pathFloor.value; i++) {
    path.push({
      id: spacesBox.value[i].id,
      name: spacesBox.value[i].name
    })
  }
  await batchMove(formStore.currentId, formStore.ids, path)
  uni.showToast({
    title: '移动成功',
    icon: 'none'
  })
  closeOperate()
  // 刷新并重新请求路径
  refresh(true)
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
  refresh(true)
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
      jumpPageDetail(result.type, result.id)
    }
  })
}

// 扫码跳转详情页
const jumpPageDetail = async (type: number, id: number) => {
  // 1.扫描的是物品、房子
  if (type) {
    // if (tempType.value) await fetchItemDetail(id, '')
    // else await fetchRoomDetail(id, '')
    await getDetail(1, id, '')
    uni.navigateTo({
      url: `/pages/details/details`
    })
  } else {
    // 2.扫描的是用户
    // await fetchSpaceDetail(id)
    // uni.navigateTo({
    //   url: `/pages/space/space`
    // })
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
const refresh = async (refreshPath = false) => {
  try {
    // 请求错误状态初始化
    isError.value = false
    // 空间请求参数初始化
    spacesInfo.value.current = 0
    spacesInfo.value.total = 0
    spacesInfo.value.spaceData = []
    // 路径是否正在加载
    pathsLoading.value = true
    // 路径为空时请求数据或请求路径参数为true时重新获取路径
    if (!spaceStore.pathsInfo[0][0] || refreshPath) await getAllPaths()
    // 初始化路径容器
    for (let i = 0; i < spaceStore.pathsInfo.length; i++) {
      spacesBox.value[i] = { fatherId: 0, id: 0, name: '', layer: 0 }
    }
    // 写入当前路径
    for (let i = 0; i < formStore.currentFloor - 1; i++) {
      pathFloor.value++
      spacesBox.value[i] = {
        fatherId: i ? spacesBox.value[i - 1].id : 0,
        id: spaceStore.spaces[i].id,
        name: spaceStore.spaces[i].name,
        layer: i
      }
    }
    // 路径获取完毕后渲染
    pathsLoading.value = false
    // 获取当前空间数据
    await getRoomItems(currentId)
    spacesData.value = spacesInfo.value.spaceData
    // 修改正在请求状态
    isLoading.value = false
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

    &__spaces {
      background-color: #5a5c60;
      width: 600rpx;
      height: 5rpx;
      margin: 100rpx auto;
      position: relative;

      &__wrapper {
        position: absolute;
        top: -8rpx;
        left: -40rpx;
        display: flex;
        justify-content: flex-start;
        max-width: 600rpx;
        overflow-x: auto;

        &-unit {
          width: 100rpx;
          margin-right: 22rpx;

          &-circle {
            background-color: #979797;
            width: 20rpx;
            height: 20rpx;
            margin: 0 auto;
            border-radius: 10rpx;
          }

          &-line {
            width: 5rpx;
            background-color: #b8babe;
            height: 35rpx;
            margin: 0 auto;
          }

          &-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
            line-height: 50rpx;
            width: 100rpx;
            height: 50rpx;
            font-size: 25rpx;
            border-radius: 10rpx;
            background-color: #fcfcfc;
            color: #565656;
            box-shadow: 0 5px 5px #e1e7f0;
            font-weight: 800;
          }
        }
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

  &__subordinateSpace {
    padding: 30rpx;
    padding-bottom: 0;
    display: flex;
    flex-wrap: wrap;

    &__title {
      width: 550rpx;
    }

    &__confirm {
      width: 140rpx;
      display: flex;
    }

    &__currentSpace {
      padding: 10rpx 30rpx;
      display: flex;
      flex-wrap: wrap;

      &__icon {
        margin-top: 9rpx;
        margin-right: 10rpx;
      }
    }

    &__floor {
      max-height: 190px;
      overflow-y: auto;
    }
  }
}
</style>
