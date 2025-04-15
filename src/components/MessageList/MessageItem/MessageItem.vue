<template>
  <view class="chatbox__search-list-item__content" @click="jumpDetail">
    <view class="chatbox__search-list-item__content__img">
      <image
        :src="
          product.item.cover || 'https://www.szlab.xyz/item/image/2025/03/08/dZbddacZcokZmsomf.png'
        "
        lazy-load
        :showError="false"
        style="width: 63px; height: 63px; border-radius: 4px; margin: 6px"
      ></image>
    </view>
    <view class="chatbox__search-list-item__content__info-name">
      <u-text :text="product.item.name"></u-text>
      <u-icon name="lock" size="16" v-if="product.item.privacy === 1"></u-icon>
    </view>
    <view class="chatbox__search-list-item__content__info-owner">
      <u-text text="→" size="18" v-if="product.label === 0 && isShare === true"></u-text>
      <u-avatar
        :src="
          product.friend.avatar ||
          'https://www.szlab.xyz/item/image/2025/03/08/cZZedZZcZZcaryknfnomf.png'
        "
        size="21"
        style="margin: 6px"
      ></u-avatar>
      <view class="chatbox__search-list-item__content__info-owner__username">
        <u-text :text="product.friend.name" size="12" lineHeight="12"></u-text>
      </view>
    </view>
    <view
      v-if="isShare === false"
      class="chatbox__search-list-item__content__button"
      :class="{ agreement: info === '同意' }"
      @click.stop="agreement"
    >
      <span>{{ info }}</span>
      <view
        class="chatbox__search-list-item__content__button__withdraw"
        v-if="info === '↗等待验证'"
        @click.stop="withdraw"
      >
        <text>撤销</text>
      </view>
    </view>
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
import type { MessageItem } from '@/types/message'
import { ref, reactive } from 'vue'
import { useFormStore } from '@/stores/form'
import { useSpaceStore } from '@/stores/space'
import { useMessageStore } from '@/stores/message'
const formStore = useFormStore()
const { getShareItemDetail, getDetail } = formStore
const spaceStore = useSpaceStore()
const { addManagement } = spaceStore
const messageStore = useMessageStore()
const { selectMessage } = messageStore

const props = defineProps<{
  // 通知中分页对象数据
  item: MessageItem
  // 是否为物品分享界面
  isShare: boolean
  // 用户自身的userId
  userId: number
}>()

// 声明一个对象，承接分页对象数据
const product = reactive(props.item)
// 按钮信息
let info = ref('')
// 密码弹窗
const popup = ref(false)
// 是否为分享物品
let isShareItem = true

// 验证手势密码
async function confirmGesture(password: string) {
  popup.value = false
  if (product.label === 1) {
    // 别人发给我的消息，别人的物品，传别人的userId
    await getShareItemDetail(2, product.item.id, product.friend.userId, password)
  } else {
    // 自己发给别人，传自己的userId
    await getShareItemDetail(2, product.item.id, props.userId, password)
  }
  uni.navigateTo({
    url: `/pages/details/details?isShareItem=${isShareItem}`
  })
}
// 验证数字密码
async function confirmNumber(password: string) {
  popup.value = false
  if (product.label === 1) {
    // 别人发给我的消息，别人的物品，传别人的userId
    await getShareItemDetail(2, product.item.id, product.friend.userId, password)
  } else {
    // 自己发给别人，传自己的userId
    await getShareItemDetail(2, product.item.id, props.userId, password)
  }
  uni.navigateTo({
    url: `/pages/details/details?isShareItem=${isShareItem}`
  })
}
// 跳转到详情页
const jumpDetail = async () => {
  // 是物品分享界面才可以执行跳转逻辑
  if (product.item.privacy === 1) {
    popup.value = true
  } else {
    if (product.label === 1) {
      // 别人发给我的消息，别人的物品，传别人的userId
      await getShareItemDetail(2, product.item.id, product.friend.userId, '')
    } else {
      // 自己发给别人，传自己的userId
      await getShareItemDetail(2, product.item.id, props.userId, '')
    }
    uni.navigateTo({
      url: `/pages/details/details?isShareItem=${isShareItem}`
    })
  }
}

// 更新按钮信息(label: 0为自己发出去的，1为别人发给我的)
if (product.label === 0) {
  switch (product.choice) {
    case 0:
      info.value = '↗等待验证'
      break
    case 1:
      info.value = '已同意'
      break
    case 2:
      info.value = '已失效'
      break
    default:
      info.value = ''
      console.log('赋值失败,choice有特殊值')
  }
} else if (product.label === 1) {
  switch (product.choice) {
    case 0:
      info.value = '同意'
      break
    case 1:
      info.value = '已同意'
      break
    case 2:
      info.value = '已失效'
      break
    default:
      info.value = ''
      console.log('赋值失败,choice有特殊值')
      break
  }
} else {
  info.value = ''
  console.log('赋值失败,label有特殊值')
}

// 点击同意申请的按钮
const agreement = async () => {
  if (info.value === '同意') {
    await selectMessage(product.id, 1)
    await addManagement(product.friend.userId, product.item.id)
    info.value = '已同意'
    uni.showToast({
      title: '已同意'
    })
  }
}
// 点击撤销的按钮
const withdraw = async () => {
  await selectMessage(product.id, 2)
  info.value = '已撤销'
  uni.showToast({
    title: '已撤销申请'
  })
}
</script>

<style lang="scss" scoped>
.chatbox__search-list-item__content {
  position: relative;
  display: flex;
  justify-content: left;
  align-items: center;
  height: 140rpx;
  border-bottom: 1rpx solid #d9d9d9;
  margin: 20rpx;
  padding-bottom: 10rpx;

  &__img {
    position: absolute;
    top: 0;
    left: 0;
  }

  &__info-name {
    position: absolute;
    display: flex;
    left: 150rpx;
    top: 20rpx;
  }

  &__info-owner {
    position: absolute;
    display: flex;
    justify-content: space-around;
    align-items: center;
    left: 160rpx;
    top: 80rpx;

    &__username {
      white-space: nowrap;
    }
  }

  &__button {
    position: absolute;
    left: 580rpx;
    bottom: 65rpx;
    width: 100rpx;
    height: 50rpx;
    border-radius: 10px;

    font-size: 12px;
    text-align: center;
    line-height: 50rpx;
    color: #a5a6a9;
    white-space: nowrap;

    background-color: transparent;
    transform: translateX(-50%);
    z-index: 999;

    &__withdraw {
      position: absolute;
      width: 100rpx;
      height: 50rpx;
      background-color: #3988ff;
      color: #fff;
      border-radius: 10px;
    }
  }
}

//  同意申请样式
.agreement {
  background-color: #3988ff;
  color: #fff;
}
</style>
