<template>
  <view class="friends">
    <u-navbar
      bgColor="transparent"
      placeholder
      title="好友"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>
    <view class="friends__search-input">
      <view class="friends__search-input__content">
        <u-search
          placeholder="搜索好友"
          placeholderColor="#979797"
          searchIconColor="#565b6d"
          searchIconSize="52rpx"
          v-model="inputBox"
          :showAction="false"
          shape="square"
          height="80rpx"
          bgColor="#F8F9FD"
        ></u-search>
        <view class="friends__search-input__content__confirm" @click="searchFriendByName()">
          <span>搜索</span>
        </view>
      </view>
    </view>
    <view v-if="searchedFriend.id" class="friends__new">
      <u-avatar
        @click="share(searchedFriend.userId)"
        size="75rpx"
        :src="searchedFriend.avatar"
      ></u-avatar>
      <view @click="share(searchedFriend.userId)" class="friends__new__information">
        <u-text color="#353535" :text="searchedFriend.name"></u-text>
        <u-line color="rgba(255,255,255,0)" margin="5rpx 0"></u-line>
        <u-text color="#a4a4a4" size="20rpx" :text="`id: ${searchedFriend.id}`"></u-text>
      </view>
    </view>
    <view
      v-for="(group, groupIndex) in friendStore.friends"
      :key="groupIndex"
      class="friends__group"
    >
      <u-text
        @click="showFriendsBox[groupIndex] = !showFriendsBox[groupIndex]"
        :suffixIcon="showFriendsBox[groupIndex] ? 'arrow-down' : 'arrow-right'"
        :text="`${group.name}&nbsp;&nbsp;`"
        size="35rpx"
        bold
      ></u-text>
      <view v-show="showFriendsBox[groupIndex]">
        <view
          v-for="(friend, friendIndex) in group.friendVO"
          @click="share(friend.userId)"
          :key="friendIndex"
          class="friends__group__item"
        >
          <u-avatar size="75rpx" :src="friend.avatar"></u-avatar>
          <view class="friends__group__item__information">
            <u-text color="#353535" :text="friend.notes ? friend.notes : friend.name"></u-text>
            <u-line color="rgba(255,255,255,0)" margin="5rpx 0"></u-line>
            <u-text color="#a4a4a4" size="20rpx" :text="`id: ${friend.id}`"></u-text>
          </view>
        </view>
      </view>
    </view>
  </view>
  <u-modal
    title="确认分享给该好友？"
    @cancel="showShare = false"
    @confirm="confirmShare"
    :showCancelButton="true"
    :show="showShare"
    width="500rpx"
  >
    <image
      class="shareImg"
      :src="
        formStore.itemData.images[0]
          ? formStore.itemData.images[0].url
          : formStore.itemData.type === 0
          ? 'https://www.szlab.xyz/item/image/2025/03/08/ZecZbZbeeZcccdeZtksKnnlomf.png'
          : 'https://www.szlab.xyz/item/image/2025/03/08/ZeeZdZdcdbcdeZtksBsdlomf.png'
      "
    />
  </u-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFriendStore, useGroupStore } from '@/stores/friend'
import { useFormStore } from '@/stores/form'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'

// 引入类型
import type { Friend } from '@/types/friend'

// 引入store
const friendStore = useFriendStore()
const { getAllFriends, shareItem } = friendStore
const groupStore = useGroupStore()
const { getAllGroups } = groupStore
const formStore = useFormStore()

onLoad(async () => {
  try {
    await getAllFriends()
    getAllGroups()
  } catch (err) {
    uni.showToast({
      title: '获取好友列表失败, 请下拉刷新重试',
      icon: 'none'
    })
  }
})

onPullDownRefresh(async () => {
  try {
    if (!friendStore.friends[0]) await getAllFriends()
    if (!groupStore.groupsInfo.groupsData[0]) getAllGroups()
  } catch (err) {
    uni.showToast({
      title: '获取好友列表失败, 请下拉刷新重试',
      icon: 'none'
    })
  }
  uni.stopPullDownRefresh()
})

// 搜索框
const inputBox = ref<string>('')
// 好友信息
const searchedFriend = ref<Friend>({
  id: 0,
  name: '',
  notes: '',
  avatar: '',
  qrCode: '',
  userId: 0
})
// 搜索好友
const searchFriendByName = (): void => {
  if (inputBox.value === '') {
    uni.showToast({
      title: '请输入名字',
      icon: 'none'
    })
    // 清空好友信息
    searchedFriend.value.id = 0
    return
  }
  for (let i = 0; i < friendStore.friends.length; i++) {
    for (let j = 0; j < friendStore.friends[i].friendVO?.length; j++) {
      if (friendStore.friends[i].friendVO[j].name === inputBox.value) {
        searchedFriend.value = friendStore.friends[i].friendVO[j]
        return
      }
    }
  }
  uni.showToast({
    title: '找不到好友',
    icon: 'none'
  })
  // 清空好友信息
  searchedFriend.value.id = 0
  return
}
//
let shareId = 0
// 分组是否折叠显示
const showFriendsBox = ref<boolean[]>([])

const showShare = ref(false)
const share = (friendId: number) => {
  shareId = friendId
  showShare.value = true
}
async function confirmShare() {
  showShare.value = false
  try {
    await shareItem(formStore.itemData.id, shareId)
    uni.showToast({
      title: '分享成功',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch {
    uni.showToast({
      title: '分享失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.friends {
  padding-bottom: 200rpx;
  &__search-input {
    display: flex;
    width: 750rpx;
    padding: 0 10rpx 0 0;
    margin: 6rpx 0 30rpx 40rpx;

    &__content {
      position: relative;
      display: flex;
      align-items: center;
      width: 750rpx;
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
    }
  }
}

.shareImg {
  margin: 0 auto;
  border-radius: 20rpx;
  width: 350rpx;
  height: 350rpx;
}

:deep(.u-search__content) {
  border-radius: 10px !important;
}
</style>
