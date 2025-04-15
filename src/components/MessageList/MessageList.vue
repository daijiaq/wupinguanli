<template>
  <template>
    <u-skeleton rows="16" :loading="isLoading" title animate class="message-list">
      <view v-if="!isLoading">
        <!-- 总列表 -->
        <view class="message-list__item" @click="chooseMessage(0)">
          <view class="message-list__item__avatar">
            <u-image
              src="https://www.szlab.xyz/item/image/2025/03/08/bcbbdcZecaZebdZarxrsdl3uZsZqomf.png"
              width="120rpx"
              height="120rpx"
              radius="50%"
            ></u-image>
          </view>
          <view class="message-list__item__info">
            <view class="message-list__item__info__username">系统通知</view>
            <view class="message-list__item__info__time">{{
              userStore.systemMessageList[0].content
            }}</view>
          </view>
        </view>
        <view class="message-list__item" @click="chooseMessage(1)">
          <view class="message-list__item__avatar">
            <u-image
              src="https://www.szlab.xyz/item/image/2025/03/08/eebZbcbeedeqhdmc3ookhbZshnmomf.png"
              width="120rpx"
              height="120rpx"
              radius="50%"
            ></u-image>
          </view>
          <view class="message-list__item__info">
            <view class="message-list__item__info__username">好友申请</view>
            <view class="message-list__item__info__time">{{ friendApplicationMsg }}</view>
          </view>
        </view>
        <!-- 共同管理暂无需求 -->
        <!-- <view class="message-list__item" @click="chooseMessage(2)">
          <view class="message-list__item__avatar">
            <u-image
              src="/static/message/manageApplications.png"
              width="120rpx"
              height="120rpx"
              radius="50%"
            ></u-image>
          </view>
          <view class="message-list__item__info">
            <view class="message-list__item__info__username">管理申请</view>
            <view class="message-list__item__info__time">您已成功成为用户138房子的共享管理人</view>
          </view>
        </view> -->
        <view class="message-list__item" @click="chooseMessage(3)">
          <view class="message-list__item__avatar">
            <u-image
              src="https://www.szlab.xyz/item/image/2025/03/08/baZdaaacZbbahsdlLgZqhmfomf.png"
              width="120rpx"
              height="120rpx"
              radius="50%"
            ></u-image>
          </view>
          <view class="message-list__item__info">
            <view class="message-list__item__info__username">物品分享</view>
            <view class="message-list__item__info__time">{{ itemShareMsg }}</view>
          </view>
        </view>
      </view>
    </u-skeleton>
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useMessageStore } from '@/stores/message'
import type { MessageItem } from '@/types/message'

const userStore = useMessageStore()
const { fetchSystemMessage, fetchNewMessageList, fetchItemShareList } = userStore

onShow(async () => {
  // 重置页码
  userStore.itemShareList.currentPage = 1
  userStore.currentMessageList.currentPage = 1
  // 获取系统通知、好友申请、物品分享
  fetchSystemMessage(0, 1)
  fetchNewMessageList(2, 1)
  fetchItemShareList(3, 1)
})

// 好友申请栏展示信息
const friendApplicationMsg = computed(() => {
  if (userStore.currentMessageList.messageList.length !== 0) {
    if (userStore.currentMessageList.messageList[0].label === 0) {
      // 自己发出去的好友申请
      if (userStore.currentMessageList.messageList[0].choice === 0) {
        // 未选
        return `等待${userStore.currentMessageList.messageList[0].friend.name}验证好友申请`
      } else if (userStore.currentMessageList.messageList[0].choice === 1) {
        // 同意
        return `${userStore.currentMessageList.messageList[0].friend.name}已通过您的好友申请`
      } else {
        // 特殊情况处理
        return '等待验证'
      }
    } else {
      // 别人发送给自己的好友申请
      if (userStore.currentMessageList.messageList[0].choice === 0) {
        // 未选
        return `${userStore.currentMessageList.messageList[0].friend.name}申请添加您为好友`
      } else if (userStore.currentMessageList.messageList[0].choice === 1) {
        // 同意
        return `已接受${userStore.currentMessageList.messageList[0].friend.name}的好友申请`
      } else {
        // 特殊情况处理
        return '等待验证'
      }
    }
  } else {
    return ''
  }
})

// 物品分享栏展示信息
const itemShareMsg = computed(() => {
  if (userStore.itemShareList.messageList.length !== 0) {
    if (userStore.itemShareList.messageList[0].label === 1) {
      // 别人分享给自己的
      return `${userStore.itemShareList.messageList[0].friend.name}向您分享了物品`
    } else {
      // 自己分享出去的
      return `您向${userStore.itemShareList.messageList[0].friend.name}分享了物品`
    }
  } else {
    return ''
  }
})

// 是否正在加载
const isLoading = ref(false)

// 点击消息进入聊天界面
const chooseMessage = (index: number) => {
  switch (index) {
    // 系统通知
    case 0:
      uni.navigateTo({
        url: `/pages/message/chatbox/systemMessage?index=${index}`
      })
      break
    // 好友申请
    case 1:
      uni.navigateTo({
        url: `/pages/message/chatbox/friendApplications?index=${index}`
      })
      break
    // 管理申请
    case 2:
      uni.navigateTo({
        url: `/pages/message/chatbox/managingApplications?index=${index}`
      })
      break
    // 物品分享
    case 3:
      uni.navigateTo({
        url: `/pages/message/chatbox/itemShare?index=${index}`
      })
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
.message-list {
  &__item {
    display: flex;
    align-items: center;
    width: 100vw;
    padding-left: 70rpx;
    height: 170rpx;
    background-color: #fcfcfe;
    margin-top: 14rpx;
    border-bottom: 1px solid #dae1ff;

    &__avatar {
      display: flex;
      align-items: center;
      margin-right: 30rpx;
    }

    &__info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 60%;

      &__username {
        font-size: 30rpx;
        font-weight: bold;
      }

      &__time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}
</style>
