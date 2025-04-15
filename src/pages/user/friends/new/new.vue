<template>
  <view class="friends">
    <u-navbar
      bgColor="transparent"
      placeholder
      title="添加好友"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>
    <view class="friends__search-input">
      <view class="friends__search-input__content">
        <u-search
          placeholder="请输入用户id"
          placeholderColor="#979797"
          searchIconColor="#565b6d"
          searchIconSize="52rpx"
          v-model="inputBox"
          :showAction="false"
          shape="square"
          height="80rpx"
          bgColor="#F8F9FD"
        ></u-search>
        <view class="friends__search-input__content__confirm" @click="searchUserById">
          <span>搜索</span>
        </view>
      </view>
    </view>
    <view v-if="user.id" class="friends__new">
      <u-avatar @click="jumpPageDetail" size="75rpx" :src="user.avatar"></u-avatar>
      <view @click="jumpPageDetail" class="friends__new__information">
        <u-text color="#353535" :text="user.name"></u-text>
        <u-line color="rgba(255,255,255,0)" margin="5rpx 0"></u-line>
        <u-text color="#a4a4a4" size="20rpx" :text="`id: ${user.id}`"></u-text>
      </view>
      <view v-if="!isFriend" @click="confirmAddFriend" class="friends__new__confirm">
        <u-text color="#3988ff" size="26rpx" align="center" text="加好友"></u-text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFriendStore } from '@/stores/friend'

// 引入类型
import type { Friend } from '@/types/friend'

// 引入store
const friendStore = useFriendStore()
const { sendApplication, searchUser } = friendStore

// 输入框
const inputBox = ref()
// 用户信息
const user = ref<Friend>({
  id: 0,
  name: '',
  notes: '',
  avatar: '',
  qrCode: '',
  userId: 0
})

// 搜索用户
async function searchUserById() {
  const data = await searchUser(inputBox.value)
  if (data.id) Object.assign(user.value, data)
}

// 显示分组弹窗
const showGroup = ref(false)
// 是否能添加
const showAdd = ref(false)

// 确认添加好友
async function confirmAddFriend() {
  showGroup.value = false
  showAdd.value = false
  await sendApplication(user.value.userId)
  uni.showToast({
    title: '发送申请成功',
    icon: 'none'
  })
}

// 此用户是否为好友
const isFriend = computed(() => {
  for (let i = 0; i < friendStore.friends.length; i++) {
    for (let j = 0; j < friendStore.friends[i].friendVO?.length; j++) {
      if (friendStore.friends[i].friendVO[j].id === user.value.id) return true
    }
  }
  return false
})

// 跳转到详情页
const jumpPageDetail = () => {
  friendStore.friend = user.value
  uni.navigateTo({
    url: `/pages/user/friends/detail/detail?isFriend=${isFriend.value}&id=${user.value.userId}`
  })
}
</script>

<style lang="scss" scoped>
.friends {
  padding-left: 40rpx;

  &__search-input {
    display: flex;
    width: 686rpx;
    padding: 0 10rpx 0 0;
    margin: 6rpx 0 30rpx 0;

    &__content {
      position: relative;
      display: flex;
      align-items: center;
      width: 686rpx;
      height: 80rpx;
      margin-right: 20rpx;

      &__confirm {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: -30rpx;
        width: 100rpx;
        height: 72%;
        border-radius: 10px;
        font-size: 14px;
        color: #fff;
        background-color: #76acfc;
        transform: translateX(-50%);
        z-index: 999;
      }
    }
  }

  &__new {
    margin-top: 20rpx;
    display: flex;
    align-items: center;

    &__information {
      margin-left: 20rpx;
      width: 425rpx;
    }

    &__confirm {
      background-color: #c4dcff;
      width: 148rpx;
      height: 68rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
    }
  }

  &__popup {
    padding: 30rpx;
    max-height: 600rpx;
    overflow-y: auto;
    &__group {
      margin-top: 15rpx;
      padding-left: 10rpx;
      padding-bottom: 10rpx;
      border-bottom: solid 1px #e8e8e8;
    }
  }
}

:deep(.u-search__content) {
  border-radius: 10px !important;
}
</style>
