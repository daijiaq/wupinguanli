<template>
  <view class="scan-page">
    <u-navbar
      bgColor="transparent"
      placeholder
      title="扫码"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>

    <view class="scan-page__title" v-if="isSpace">扫描到的空间</view>
    <view class="scan-page__title" v-else>扫描到的物品</view>
    <u-checkbox-group v-model="selectedItemNames" @change="checkboxChange_main">
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
    <u-checkbox-group v-if="isSpace" v-model="selectedItemNames" @change="checkboxChange_inner">
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
          :disabled="mainMove"
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

  <view>
    <up-popup
      :show="moveShow"
      mode="center"
      :round="10"
      :overlay="false"
      @close="close"
      @open="open"
    >
      <view class="popup">
        <text>是否将所选物品移入该空间</text>
        <up-button
          type="primary"
          text="确定"
          color="#606060"
          @click="handleMoveConfirm"
        ></up-button>
        <up-button type="primary" text="取消" color="#606060" @click="handleMoveCancel"></up-button>
      </view>
    </up-popup>
  </view>

  <view>
    <up-popup
      :show="moveToItemShow"
      mode="center"
      :round="10"
      :overlay="false"
      @close="ToItemclose"
      @open="ToItemopen"
    >
      <view class="popup">
        <text>若移入当前选中物品,该物品属性将改为空间属性</text>
        <up-button
          type="primary"
          text="确定"
          color="#606060"
          @click="handleMoveToItemConfirm"
        ></up-button>
        <up-button
          type="primary"
          text="取消"
          color="#606060"
          @click="handleMoveToItemCancel"
        ></up-button>
      </view>
    </up-popup>
  </view>

  <!-- 密码弹窗 -->
  <PasswordPopup
    :popup="popup"
    @close="popup = false"
    @confirmGesture="confirmGesture"
    @confirmNumber="confirmNumber"
    :isValidate="true"
  />
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSpaceStore } from '@/stores/space'
import { useFormStore } from '@/stores/form'
import type { ItemForm } from '@/types/form'
import { batchUpdateItemsAPINew } from '@/network/apis/form'
const spaceStore = useSpaceStore()
const {
  movePath,
  moveToItemPath,
  moveItemFatherId,
  moveToItemFatherId,
  moveItemIds,
  itemToRoomId,
  itemToRoomType,
  canMove,
  privacyBoolean,
  movePassword
} = toRefs(spaceStore)
const { scanItemRequest, getInnerItems, preScanRequest, batchMove } = spaceStore
const formStore = useFormStore()
const { getShareItemDetail, batchDeleteItems, getDetail, updateItem } = formStore
const { itemData } = toRefs(formStore)

const moveShow = ref(false)
const moveToItemShow = ref(false)

function open() {
  moveShow.value = true
}

function close() {
  moveShow.value = false
}

function ToItemopen() {
  moveToItemShow.value = true
}

function ToItemclose() {
  moveToItemShow.value = false
}

const mainMove = ref(false)

const checkboxChange_main = (n: any) => {
  console.log('change', n)
  mainMove.value = !mainMove.value
  const result = n.map((item: string) => parseInt(item.split('-')[1]))
  console.log(result)
  moveItemIds.value = [...result.map((id: number) => mainItems.value[id].id)]
  console.log('moveItemIds_main', moveItemIds.value)
}

const checkboxChange_inner = (n: any) => {
  console.log('change', n)
  const result = n.map((item: string) => parseInt(item.split('-')[1]))
  console.log(result)
  moveItemIds.value = [...result.map((id: number) => innerItems.value[id].id)]
  console.log('moveItemIds_inner', moveItemIds.value)
}

const handleMoveConfirm = async () => {
  console.log('canMove', canMove.value)
  if (canMove.value === false) {
    uni.showToast({
      title: '他人空间/物品，不可移入',
      icon: 'none'
    })
    return
  }
  // 确认逻辑
  moveShow.value = false
  console.log(movePath.value, moveItemFatherId.value[0], moveItemIds.value)
  // if (mainMove.value) await batchMove(moveRoomFatherId.value[0], moveItemIds.value, movePath.value)
  // else
  await batchMove(moveItemFatherId.value[0], moveItemIds.value, movePath.value)
  uni.switchTab({
    url: '/pages/home/home'
  })
  uni.showToast({
    title: '已确认移动',
    icon: 'none'
  })
}

const handleMoveCancel = () => {
  moveShow.value = false
  uni.showToast({
    title: '已取消移动',
    icon: 'none'
  })
}

const handleMoveToItemConfirm = async () => {
  console.log('canMove', canMove.value)
  if (canMove.value === false) {
    uni.showToast({
      title: '他人空间/物品，不可移入',
      icon: 'none'
    })
    return
  }
  // 确认逻辑
  moveToItemShow.value = false
  console.log(itemToRoomType.value)
  console.log('密码', privacyBoolean.value, pageOptions.isOwner)
  if (privacyBoolean.value && pageOptions.isOwner) {
    await getDetail(itemToRoomType.value, itemToRoomId.value, movePassword.value || '')
  } else {
    await getDetail(itemToRoomType.value, itemToRoomId.value, '')
  }
  itemData.value.type = 1
  console.log(itemData.value)
  const formData: ItemForm = {
    ...itemData.value,
    fatherName: itemData.value.fatherName || '111',
    path: itemData.value.path || [],
    // path: [],
    url: itemData.value.url || '',
    count: itemData.value.count || 0,
    hide: itemData.value.hide || 0,
    items: itemData.value.items || []
  }
  console.log(formData)
  // console.log('formData.path[0].id', formData.path[0].id)
  // const res = await updateItem(formData.path[0].id, itemToRoomId.value, formData)
  // console.log(movePath.value, moveItemFatherId.value[0], moveItemIds.value)

  // moveToItemPath.value = res.path || []
  // moveToItemPath.value.reverse()
  // moveToItemPath.value.push({ id: res.id, name: res.name })
  // console.log('movepath', moveItemIds.value, moveToItemPath.value)
  // await batchUpdateItemsAPINew(moveItemIds.value, [{ id: res.id, name: res.name }])

  moveToItemPath.value = formData.path || []
  moveToItemPath.value.reverse()
  moveToItemPath.value.push({ id: itemData.value.id, name: itemData.value.name })
  console.log('movepath', moveItemIds.value, moveToItemPath.value)
  await batchUpdateItemsAPINew(moveItemIds.value, [
    { id: itemData.value.id, name: itemData.value.name }
  ])
  // await batchUpdateItemsAPINew(moveItemIds.value, moveToItemPath.value)
  // await batchMove(formData.path[0].id, moveItemIds.value, moveToItemPath.value)
  uni.switchTab({
    url: '/pages/home/home'
  })
  uni.showToast({
    title: '已确认移动',
    icon: 'none'
  })
}

const handleMoveToItemCancel = () => {
  moveToItemShow.value = false
  uni.showToast({
    title: '已取消移动',
    icon: 'none'
  })
}

// 验证手势密码
async function confirmGesture(password: string) {
  movePassword.value = password
  popup.value = false
  if (isScan) {
    // isShareItem = true
    isScan = false
    await getShareItemDetail(2, tempItemId, tempUserId, password)
    // 密码验证成功后跳转到扫码物品页面
    uni.navigateTo({
      url: `/pages/home/scan/scanItem?type=${tempType}&itemId=${tempItemId}&userId=${tempUserId}&privacy=${tempPrivacy}&hide=${tempHide}&isShareItem=${isShareItem}&isOwner=${isOwner}&showMoveDialog=true`
    })
  } else {
    // isShareItem = false
    await getDetail(tempType, tempItemId, password)
    // 密码验证成功后跳转到扫码物品页面
    uni.navigateTo({
      url: `/pages/home/scan/scanItem?type=${tempType}&itemId=${tempItemId}&userId=${tempUserId}&privacy=${tempPrivacy}&hide=${tempHide}&isShareItem=${isShareItem}&isOwner=${isOwner}&showMoveDialog=true`
    })
  }
  // 注释掉其他跳转逻辑
  // if (isEdit) {
  //   uni.navigateTo({
  //     url: `/pages/edit/edit`
  //   })
  // } else
  //   uni.navigateTo({
  //     url: `/pages/details/details?isShareItem=${isShareItem}&isOwner=${isOwner}`
  //     // url: '/pages/details/details?isShareItem=false'
  //   })
  // isEdit = false
}
// 验证数字密码
async function confirmNumber(password: string) {
  movePassword.value = password
  popup.value = false
  if (isScan) {
    // isShareItem = true
    isScan = false
    await getShareItemDetail(2, tempItemId, tempUserId, password)
    // 密码验证成功后跳转到扫码物品页面
    uni.navigateTo({
      url: `/pages/home/scan/scanItem?type=${tempType}&itemId=${tempItemId}&userId=${tempUserId}&privacy=${tempPrivacy}&hide=${tempHide}&isShareItem=${isShareItem}&isOwner=${isOwner}&showMoveDialog=true`
    })
  } else {
    // isShareItem = false
    await getDetail(tempType, tempItemId, password)
    // 密码验证成功后跳转到扫码物品页面
    uni.navigateTo({
      url: `/pages/home/scan/scanItem?type=${tempType}&itemId=${tempItemId}&userId=${tempUserId}&privacy=${tempPrivacy}&hide=${tempHide}&isShareItem=${isShareItem}&isOwner=${isOwner}&showMoveDialog=true`
    })
  }
  // 注释掉其他跳转逻辑
  // if (isEdit)
  //   uni.navigateTo({
  //     url: `/pages/edit/edit`
  //   })
  // else
  //   uni.navigateTo({
  //     url: `/pages/details/details?isShareItem=${isShareItem}&isOwner=${isOwner}`
  //     // url: '/pages/details/details?isShareItem=false'
  //   })
  // isEdit = false
}

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
      url: `/pages/details/details?isShareItem=${pageOptions.isShareItem}&isOwner=${pageOptions.isOwner}`
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
      url: `/pages/details/details?itemId=${params.itemId}&type=${params.type}&isOwner=${pageOptions.isOwner}`
    })
  }
}

// 扫码跳转物品列表展示页
// 密码弹窗
const popup = ref(false)
// 是否处于扫码
let isScan = false
// 是否为分享物品
let isShareItem = false
// 是否为自己的物品
let isOwner = false
// 暂存物品ID
let tempItemId = 0
// 暂存类型
let tempType = 0
// 暂存用户ID
let tempUserId = 0
// 暂存隐私设置
let tempPrivacy = 0
// 暂存隐藏设置
let tempHide = 0

const jumpPageDetail = async (
  itemId: number,
  userId: number,
  type: number,
  privacy: number,
  hide: number
) => {
  itemToRoomId.value = itemId
  // isSpace.value = type === 0 || type === 1 ? true : false
  const res = await preScanRequest(itemId, userId, type, privacy, hide)
  console.log('222', res, type)
  // 1.扫描的是物品、房子
  if (itemId !== 0 && type >= 0) {
    // 如果是非隐私物品
    if (res.code[2] === '0') {
      privacyBoolean.value = false
      // 如果是分享物品
      if (res.code[1] === '1') {
        isShareItem = true
      } else {
        isShareItem = false
      }
      // 是否是自己的物品
      if (res.code[4] === '1') {
        isOwner = true
        itemToRoomType.value = type
        canMove.value = true
      } else {
        canMove.value = false
        isOwner = false
      }
      console.log(isOwner)
      uni.navigateTo({
        url: `/pages/home/scan/scanItem?type=${type}&itemId=${itemId}&userId=${userId}&privacy=${privacy}&hide=${hide}&isShareItem=${isShareItem}&isOwner=${isOwner}&showMoveDialog=true`
      })
      // await getShareItemDetail(2, itemId, userId, '')
      // uni.navigateTo({
      //   url: `/pages/details/details?isShareItem=${isShareItem}`
      // })
    } else {
      privacyBoolean.value = true
      // 是否是自己的物品
      if (res.code[4] === '1') {
        isOwner = true
        itemToRoomType.value = type
        canMove.value = true
      } else {
        canMove.value = false
        isOwner = false
      }
      // 检查是否是他人隐私物品
      if (privacyBoolean.value && !isOwner) {
        uni.showToast({
          title: '他人隐私空间/物品，不可查看',
          icon: 'none'
        })
        return
      }
      // if (res.code[4] === '0') {
      //   return uni.showToast({
      //     title: '他人的隐私空间/物品，不可访问',
      //     icon: 'none'
      //   })
      // }
      tempUserId = userId
      tempItemId = itemId
      tempType = 2
      tempPrivacy = privacy
      tempHide = hide
      isScan = true
      popup.value = true
    }
  } else {
    // 2.扫描的是用户
    // uni.navigateTo({
    //   url: `/pages/user/friends/detail/detail?id=${userId}&isFriend=${
    //     res.code[0] === '0' ? true : false
    //   }`
    // })
    console.log('11111111')
    uni.showToast({
      title: '不可移入好友~',
      icon: 'none'
    })
    return
    // isUser.value = true
  }
}

// const isUser = ref(false)

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
      // 只设置路径相关store，itemData用接口返回的完整数据
      if (!formStore.itemData.path || formStore.itemData.path.length === 0) {
        // 没有空间链，补一层
        spaceStore.spaces = [
          {
            id: formStore.itemData.id,
            name: formStore.itemData.name,
            fatherId: 0,
            layer: 1
          }
        ]
        formStore.currentFloor = 1
      } else {
        spaceStore.spaces = formStore.itemData.path
        formStore.currentFloor = formStore.itemData.path.length
      }
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
      // 多选，跳转到共同编辑页面，传递选中物品id列表
      const ids = selectedItems.map((item) => item.id)
      uni.navigateTo({
        url: `/pages/edit/multiple/multiple?ids=${ids.join(',')}`
      })
      return
    }
    const item = selectedItems[0]
    await getDetail(Number(item.type), item.id, '')
    // 只设置路径相关store，itemData用接口返回的完整数据
    if (!formStore.itemData.path || formStore.itemData.path.length === 0) {
      // 没有空间链，补一层, 不然spaceItem页面toSpace可能会报错
      spaceStore.spaces = [
        {
          id: formStore.itemData.id,
          name: formStore.itemData.name,
          fatherId: 0,
          layer: 1
        }
      ]
      formStore.currentFloor = 1
    } else {
      spaceStore.spaces = formStore.itemData.path
      formStore.currentFloor = formStore.itemData.path.length
    }
    uni.navigateTo({
      url: `/pages/edit/edit?from=scan&itemId=${item.id}&type=${item.type}`
    })
  } else if (action === 'move') {
    if (pageOptions && pageOptions.isOwner === 'false') {
      uni.showToast({
        title: '他人空间/物品，不可移入',
        icon: 'none'
      })
      return
    }
    // if (isUser.value) {
    //   uni.showToast({
    //     title: '不可移入好友~',
    //     icon: 'none'
    //   })
    //   return
    // }
    // 扫码移入逻辑
    uni.scanCode({
      success(res) {
        const result = JSON.parse(res.result)
        console.log('扫码结果:', result)
        jumpPageDetail(result.itemId, result.userId, result.type, result.privacy, result.hide)
      },
      fail(err) {
        console.log('扫码失败:', err)
      }
    })
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
  isSpace.value = !!(options && (String(options.type) === '1' || String(options.type) === '0'))
  // 获取物品数据
  try {
    const res = await scanItemRequest(Number(options?.itemId), Number(options?.userId))
    // console.log('scanItemRequest res', res, movePath.value)
    console.log('111', res)
    if (res) {
      const item = res
      isSpace.value = String(item.type) === '0' || String(item.type) === '1' ? true : false
      console.log('isSpace', item.type, isSpace.value)
      moveToItemFatherId.value.push(item.path[0]?.id)
      movePath.value = (item.path || []).reverse()
      movePath.value.push({ id: item.id, name: item.name })
      moveItemFatherId.value.push(movePath.value[0].id || 0)
      // moveToItemPath.value = (item.path || []).reverse()
      // console.log('moveToItemPath', moveToItemPath.value)
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
        movePath.value = (innerRes.records[0].path || []).reverse()
        moveItemFatherId.value.push(movePath.value[0].id || 0)
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
      console.log('innerItems', moveItemFatherId.value, movePath.value, innerRes, innerItems.value)
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

  // 检查是否需要显示移动弹窗
  if (options?.showMoveDialog === 'true' && isSpace.value === true) {
    setTimeout(() => {
      moveShow.value = true
    }, 300)
  } else if (options?.showMoveDialog === 'true' && isSpace.value === false) {
    setTimeout(() => {
      moveToItemShow.value = true
    }, 300)
  }
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
.popup {
  background-color: #606060;
  width: 400rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  // height: 250rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10rpx;

  text {
    font-size: 28rpx;
    color: #fff;
    margin-bottom: 20rpx;
    text-align: center;
    height: 150rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #fff;
    line-height: 1.2;
  }

  // up-button {
  //   padding: 20rpx;
  //   color: #fff;
  //   width: 100%;
  //   border: none;
  //   border-radius: 25rpx;
  // }

  ::v-deep .data-v-461e713c {
    // margin: 0;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    color: #fff;
    border: none;
  }

  ::v-deep .data-v-3ec581de {
    margin-bottom: 0;
  }
}
</style>
