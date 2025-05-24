<template>
  <u-navbar autoBack title="好友申请" placeholder titleStyle="font-weight: bold"></u-navbar>
  <view class="search-input">
    <view class="search-input__content">
      <u-search
        placeholder=""
        placeholderColor="#979797"
        searchIconColor="#565b6d"
        searchIconSize="52rpx"
        v-model="inputBox"
        :showAction="false"
        shape="square"
        height="80rpx"
        bgColor="#F8F9FD"
      ></u-search>
      <view
        class="search-input__content__confirm"
        @click="submitSearch"
        :class="{ active: !inputBox }"
      >
        <span>搜索</span>
      </view>
    </view>
  </view>
  <view class="time">
    <u-text :text="dataShow ? '三天前' : '近期'"></u-text>
  </view>
  <scroll-view @scrolltolower="onScrollTolower" scroll-y class="scroll-content">
    <view class="friend">
      <scroll-view scroll-y class="friend__scroll">
        <view class="friend__content">
          <navigator
            v-for="(item, index) in newMessageData"
            :key="item.noticeId"
            :url="`/pages/user/friends/detail/detail?id=${item.relateId}&isFriend=${
              item.choice === 1
            }`"
            open-type="navigate"
            class="friend__content__item"
            hover-class="none"
          >
            <view class="friend__content__item__pic">
              <u-image
                :src="item.relateAvatar"
                mode="aspectFill"
                width="120rpx"
                height="120rpx"
                radius="50%"
              />
            </view>
            <view class="friend__content__item__text">
              <text>{{ item.relateName }}</text>
            </view>
            <view
              class="friend__content__item__state"
              :class="{ friend__state: item.label === 0 || item.choice === 1 }"
            >
              <span @click.stop="addFriend(index)">{{
                item.choice === 1 ? '已添加' : item.label === 0 ? '等待验证' : '添加'
              }}</span>
            </view>
          </navigator>
        </view>
      </scroll-view>
    </view>
  </scroll-view>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
// import type { FriendMessageDetail, MessageItem } from '@/types/message'
import type { FriendMsgDetail } from '@/types/message'

import { storeToRefs } from 'pinia'
import { useMessageStore } from '@/stores/message'
import { chooseMessage, getFriend } from '@/network/apis/message'
import { useFriendStore } from '@/stores/friend'
const messageStore = useMessageStore()
// const newMessageData = ref<MessageItem[]>([])
const newMessageData = ref<FriendMsgDetail[]>([])

//计算日期
const dataShow = computed(() => {
  return Date.now() - Date.parse(newMessageData.value[0]?.noticeTime) > 86400000 * 3
})

const { currentMessageList } = storeToRefs(messageStore)

//搜索逻辑
const inputBox = ref<string>('')
const submitSearch = async () => {
  currentMessageList.value.currentPage = 1
  currentMessageList.value.content = inputBox.value
  uni.showLoading({
    title: '搜索中'
  })
  await messageStore.fetchNewMessageList(10)
  newMessageData.value = messageStore.currentMessageList.messageList
  uni.showToast({
    title: '搜索成功'
  })
}

//添加请求
const addFriend = async (activeIndex: any) => {
  //改变用户通知状态
  if (
    newMessageData.value[activeIndex].choice === 1 ||
    newMessageData.value[activeIndex].label === 0
  ) {
    return
  }
  //渲染前端页面
  newMessageData.value[activeIndex].choice = 1

  uni.showToast({
    icon: 'success',
    title: '已添加'
  })
  //更新后端数据
  await useFriendStore().addFriend(
    newMessageData.value[activeIndex].noticeId,
    0,
    newMessageData.value[activeIndex].relateNotes
  )
  // 更新后端数据
  await chooseMessage(
    newMessageData.value[activeIndex].noticeId,
    newMessageData.value[activeIndex].choice
  )
}

//下拉刷新
const onScrollTolower = async () => {
  //发送网络请求
  if (messageStore.currentMessageList.currentPage <= messageStore.currentMessageList.total) {
    await messageStore.fetchNewMessageList(10)
    newMessageData.value.push(...messageStore.currentMessageList.messageList)
  }
}

//发送网络请求
onLoad(async () => {
  currentMessageList.value.currentPage = 1
  await messageStore.fetchNewMessageList(10)
  newMessageData.value = messageStore.currentMessageList.messageList
})
</script>
<style scoped lang="scss">
page {
  width: 100%;
  display: flex;
}

.search-input {
  display: flex;
  box-sizing: border-box;

  &__content {
    position: relative;
    display: flex;
    align-items: center;
    width: 100vw;
    height: 80rpx;
    padding: 10rpx 40rpx 20rpx 40rpx;

    &__confirm {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      position: absolute;
      right: 60rpx;
      border-radius: 10rpx;
      width: 100rpx;
      height: 50%;
      font-size: 14px;
      color: #fff;
      background-color: #3988ff;
      z-index: 999;
    }
  }

  .active {
    background-color: #76acfc;
  }
}

.time {
  margin-left: 40rpx;
  font-size: 16rpx;
}

.friend {
  margin: 20rpx 40rpx 0 40rpx;

  box-sizing: border-box;
  position: relative;

  &__friend__scroll {
    flex: 3;
  }

  &__content {
    &__item {
      display: flex;
      width: 335.2px;
      align-items: center;
      padding-top: 20rpx;
      border-bottom: 1rpx solid #f4f4f5;
      padding-bottom: 20rpx;
      z-index: 9999;

      &__text {
        display: inline-block;
        font-size: 16px;
        color: #808080;
        height: 70rpx;
        white-space: nowrap;
        padding-left: 30rpx;
        line-height: 4rpx;
      }

      &__state {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 0rpx;
        border-radius: 10rpx;
        width: 110rpx;
        height: 50rpx;
        font-size: 14px;
        color: #fff;
        background-color: #3988ff;
        z-index: 999;
      }
    }
  }
}

.scroll-content {
  height: 649px;
}

.friend__state {
  white-space: nowrap;
  color: #a5a6a9;
  background-color: #ffffff;
}
</style>
