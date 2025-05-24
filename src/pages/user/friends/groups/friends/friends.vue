<template>
  <view class="friends">
    <u-navbar
      bgColor="transparent"
      placeholder
      title="好友"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>
    <view class="friends__group">
      <view
        @click="friend.checked = !friend.checked"
        v-for="(friend, friendIndex) in friends.friendVO"
        :key="friendIndex"
        class="friends__group__item"
      >
        <u-avatar size="75rpx" :src="friend.avatar"></u-avatar>
        <view class="friends__group__item__information">
          <u-text color="#353535" :text="friend.name"></u-text>
          <u-line color="rgba(255,255,255,0)" margin="5rpx 0"></u-line>
          <u-text color="#a4a4a4" size="20rpx" :text="`id: ${friend.id}`"></u-text>
        </view>
        <view
          :style="`background-color:${friend.checked ? `#3988ff` : `#fff`}`"
          class="friends__group__item__tick"
        >
          <u-icon v-if="friend.checked" color="#fff" name="checkbox-mark"></u-icon>
        </view>
      </view>
    </view>
    <view class="friends__submit">
      <u-button @click="confirm" type="primary" text="确认"></u-button>
    </view>
  </view>
  <view v-if="!friends.friendVO?.length" class="null"> 暂无未分组好友 </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Group, Friend, BuddyVO } from '@/types/friend'
import { useFriendStore } from '@/stores/friend'
import { onShow } from '@dcloudio/uni-app'
const friendStore = useFriendStore()

const fetchUngroupedFriends = async () => {
  await friendStore.getPageGroupFriend(94, 1, 10)
  if (friendStore.groupFriendsMap[94]) {
    friends.friendVO = friendStore.groupFriendsMap[94].records
  }
}
const friends = reactive({
  friendVO: [] as BuddyVO[] // 存储未分组好友
})

onShow(() => {
  fetchUngroupedFriends()
})

// 确认并返回
const confirm = () => {
  friendStore.tempFriends = friends.friendVO.filter((item: BuddyVO) => item.checked)
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.friends {
  padding-bottom: 200rpx;
  &__group {
    margin-top: 25rpx;
    margin-left: 40rpx;
    &__item {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      &__information {
        margin-left: 20rpx;
        width: 525rpx;
      }
      &__tick {
        width: 30rpx;
        height: 30rpx;
        border-radius: 15rpx;
        border: solid 1px #e6e6e6;
      }
    }
  }
  &__submit {
    position: fixed;
    display: flex;
    bottom: 75rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 258rpx;
    border-radius: 26rpx;
  }
}

.null {
  text-align: center;
  margin-top: 200rpx;
  font-size: 30rpx;
  color: #a4a4a4;
}
</style>
