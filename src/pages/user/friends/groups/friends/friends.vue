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
          v-model="searchInput"
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
    <!-- 搜索结果 -->
    <view v-if="searchResults.length > 0" class="friends__list">
      <view v-for="(result, index) in searchResults" :key="index" class="friends__item">
        <view class="friends__item__content">
          <u-avatar size="75rpx" :src="result.avatar"></u-avatar>
          <view class="friends__item__information">
            <u-text color="#353535" :text="result.notes || result.name"></u-text>
            <u-line color="rgba(255,255,255,0)" margin="5rpx 0"></u-line>
            <u-text color="#a4a4a4" size="20rpx" :text="`id: ${result.id}`"></u-text>
          </view>
          <view
            :style="`background-color:${result.checked ? `#3988ff` : `#fff`}`"
            class="friends__group__item__tick"
            @click="result.checked = !result.checked"
          >
            <u-icon v-if="result.checked" color="#fff" name="checkbox-mark"></u-icon>
          </view>
        </view>
        <view class="friends__submit">
          <u-button @click="confirm" type="primary" text="确认"></u-button>
        </view>
      </view>
    </view>
    <!-- 分组列表 -->
    <view v-else>
      <view
        v-for="(group, groupIndex) in groupStore.groupsInfo.records"
        :key="groupIndex"
        class="friends__group"
      >
        <u-text
          @click="getDetailFriend(group.id, groupIndex)"
          :suffixIcon="showFriendsBox[groupIndex] ? 'arrow-down' : 'arrow-right'"
          :text="`${group.name}&nbsp;&nbsp;(${group.groupNum})`"
          size="35rpx"
          bold
        ></u-text>
        <view v-show="showFriendsBox[groupIndex]">
          <view
            @click="friend.checked = !friend.checked"
            v-for="(friend, friendIndex) in groupFriendsMap[group.id]?.records || []"
            :key="friendIndex"
            class="friends__group__item"
          >
            <u-avatar size="75rpx" :src="friend.avatar"></u-avatar>
            <view class="friends__group__item__information">
              <u-text color="#353535" :text="friend.notes ? friend.notes : friend.name"></u-text>
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
      </view>
      <view class="friends__submit">
        <u-button @click="confirm" type="primary" text="确认"></u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { Group, Friend, BuddyVO, GroupVO } from '@/types/friend'
import { useFriendStore, useGroupStore } from '@/stores/friend'
import { onShow } from '@dcloudio/uni-app'
import { searchFriendsByName } from '@/network/apis/friend'
const friendStore = useFriendStore()
const groupStore = useGroupStore()
// 搜索输入框
const searchInput = ref('')
const searchResults = ref<BuddyVO[]>([]) // 存储所有搜索结果

// 控制每个分组的展开/收起状态
const showFriendsBox = ref<boolean[]>([])

// 获取分组好友数据
const groupFriendsMap = computed(() => friendStore.groupFriendsMap)
// 搜索好友功能
const searchFriendByName = async (): Promise<void> => {
  if (searchInput.value === '') {
    uni.showToast({
      title: '请输入好友名字',
      icon: 'none'
    })
    return
  }
  // 先清空之前的结果
  searchResults.value = []
  const res = await searchFriendsByName(searchInput.value.trim(), 1, 10)
  console.log(res)
  if (res.records?.length > 0) {
    searchResults.value = res.records.map((item) => ({
      id: item.id,
      name: item.name,
      notes: item.notes || '',
      avatar: item.avatar || '',
      qrCode: item.qrCode || '',
      groupId: item.groupId,
      checked: false // 添加选中状态
    }))
    // 确保分组数据已加载
    if (!groupStore.groupsInfo.records.length) {
      await groupStore.getAllGroups()
    }
  } else {
    uni.showToast({
      title: '找不到好友',
      icon: 'none'
    })
    // 清空搜索结果
    searchResults.value = []
  }
  return
}

// 获取分组好友详情
const getDetailFriend = async (groupId: number, groupIndex: number) => {
  // 切换展开/收起状态
  showFriendsBox.value[groupIndex] = !showFriendsBox.value[groupIndex]
  // 如果展开且该分组还没有数据，则获取数据
  if (showFriendsBox.value[groupIndex] && !groupFriendsMap.value[groupId]) {
    await friendStore.getPageGroupFriend(groupId, 1, 10)
  }
}

// 恢复之前选中的好友状态
const restoreCheckedStatus = () => {
  // 获取之前选中的好友列表
  const previouslySelectedFriends = friendStore.tempFriends || []
  // 恢复搜索结果中的选中状态
  searchResults.value.forEach((friend) => {
    const isPreviouslySelected = previouslySelectedFriends.some(
      (selected) => selected.id === friend.id
    )
    friend.checked = isPreviouslySelected
  })
  // 恢复分组好友中的选中状态
  Object.values(groupFriendsMap.value).forEach((group) => {
    if (group?.records) {
      group.records.forEach((friend) => {
        const isPreviouslySelected = previouslySelectedFriends.some(
          (selected) => selected.id === friend.id
        )
        friend.checked = isPreviouslySelected
      })
    }
  })
}

// 初始化所有分组数据
const initAllGroups = async () => {
  // 获取所有分组信息
  if (groupStore.groupsInfo.records.length === 0) {
    await groupStore.getAllGroups()
  }
  // 初始化展开状态数组
  showFriendsBox.value = new Array(groupStore.groupsInfo.records.length).fill(false)
  // 默认展开第一个分组（通常是未分组）
  if (groupStore.groupsInfo.records.length > 0) {
    showFriendsBox.value[0] = true
    await getDetailFriend(groupStore.groupsInfo.records[0].id, 0)
  }
  // 恢复之前选中的好友状态
  restoreCheckedStatus()
}

// 确认并返回
const confirm = () => {
  // 收集所有分组中选中的好友
  const selectedFriends: BuddyVO[] = []
  // 如果有搜索结果，优先使用搜索结果中的选中好友
  if (searchResults.value.length > 0) {
    const checkedSearchResults = searchResults.value.filter((friend: BuddyVO) => friend.checked)
    selectedFriends.push(...checkedSearchResults)
  } else {
    // 否则使用分组中的选中好友
    Object.values(groupFriendsMap.value).forEach((group) => {
      if (group?.records) {
        const checkedFriends = group.records.filter((friend: BuddyVO) => friend.checked)
        selectedFriends.push(...checkedFriends)
      }
    })
  }
  friendStore.tempFriends = selectedFriends
  // 设置需要刷新的标志，让主好友页面知道需要重新获取数据
  friendStore.needRefresh = true
  uni.navigateBack()
}

onShow(() => {
  initAllGroups()
})
</script>

<style lang="scss" scoped>
.friends {
  padding-bottom: 200rpx;
  &__search-input {
    display: flex;
    width: 666rpx;
    padding: 0 10rpx 0 0;
    margin: 6rpx 0 30rpx 40rpx;

    &__content {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 80rpx;

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
  &__list {
    margin-top: 20rpx;
  }
  &__item {
    padding: 0 40rpx;
    margin-bottom: 20rpx;
    &__content {
      display: flex;
      align-items: center;
    }
    &__information {
      margin-left: 20rpx;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  &__group {
    margin-top: 25rpx;
    margin-left: 40rpx;
    margin-right: 40rpx;
    // 分组标题样式
    .u-text {
      padding: 20rpx 0;
      border-bottom: 1px solid #f0f0f0;
    }
    &__item {
      margin-top: 20rpx;
      display: flex;
      align-items: center;
      padding: 10rpx 0;
      &__information {
        margin-left: 20rpx;
        width: 525rpx;
      }
      &__tick {
        width: 30rpx;
        height: 30rpx;
        border-radius: 15rpx;
        border: solid 1px #e6e6e6;
        display: flex;
        align-items: center;
        justify-content: center;
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
:deep(.u-search__content) {
  border-radius: 10px !important;
}
</style>
