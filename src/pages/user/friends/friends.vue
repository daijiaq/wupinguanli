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
      <u-icon @click="jumpPageAddFriend" size="48rpx" name="man-add-fill"></u-icon>
    </view>
    <view v-if="searchResults.length > 0" class="friends__list">
      <view v-for="(result, index) in searchResults" :key="index" class="friends__item">
        <view class="friends__item__content">
          <u-avatar
            @click="jumpPageFriendDetail(result, getGroupForResult(result))"
            size="75rpx"
            :src="result.avatar"
          ></u-avatar>
          <view
            @click="jumpPageFriendDetail(result, getGroupForResult(result))"
            class="friends__item__information"
          >
            <u-text color="#353535" :text="result.notes || result.name"></u-text>
            <u-line color="rgba(255,255,255,0)" margin="5rpx 0"></u-line>
            <u-text color="#a4a4a4" size="20rpx" :text="`id: ${result.id}`"></u-text>
          </view>
        </view>
      </view>
    </view>
    <template v-else>
      <view class="friends__operate">
        <u-text
          @click="jumpPageGroups"
          color="#bcbcbd"
          prefixIcon="edit-pen-fill"
          lines="1"
          size="26rpx"
          text="&nbsp;编辑分组"
          iconStyle="font-size:30rpx"
        />
      </view>
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
            @click="
              checkboxOperate ? (item.checked = !item.checked) : jumpPageFriendDetail(item, group)
            "
            v-for="(item, friendIndex) in groupFriendsMap[group.id]?.records || []"
            :key="friendIndex"
            class="friends__group__item"
            @longpress="longpress(groupIndex, friendIndex)"
          >
            <u-avatar size="75rpx" :src="item.avatar"></u-avatar>
            <view class="friends__group__item__information">
              <u-text color="#353535" :text="item.notes ? item.notes : item.name"></u-text>
              <u-line color="rgba(255,255,255,0)" margin="5rpx 0"></u-line>
              <u-text color="#a4a4a4" size="20rpx" :text="`id: ${item.id}`"></u-text>
            </view>
            <view
              :style="`background-color:${item.checked ? `#3988ff` : `#fff`}`"
              class="friends__group__item__tick"
              v-show="checkboxOperate"
            >
              <u-icon v-if="item.checked" color="#fff" name="checkbox-mark"></u-icon>
            </view>
          </view>
        </view>
      </view>
      <u-modal
        title="确认删除？"
        @cancel="showDelete = false"
        @confirm="confirmDelete"
        :showCancelButton="true"
        :show="showDelete"
        width="500rpx"
      >
      </u-modal>
      <view v-if="checkboxOperate" class="friends__checkbox">
        <view>
          <u-icon @click="showDelete = true" size="50rpx" name="trash" color="#898a8d"></u-icon>
          <u-text size="25rpx" color="#88898c" align="center" text="删除" :bold="true" />
        </view>
        <view>
          <u-icon
            @click="jumpPageMove"
            size="50rpx"
            name="rewind-right-fill"
            color="#898a8d"
          ></u-icon>
          <u-text size="25rpx" color="#88898c" align="center" text="移动" :bold="true" />
        </view>
        <view>
          <u-icon @click="cancel" size="50rpx" name="close" color="#898a8d"></u-icon>
          <u-text size="25rpx" color="#88898c" align="center" text="取消" :bold="true" />
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFriendStore, useGroupStore } from '@/stores/friend'
import { onShow } from '@dcloudio/uni-app'

// 引入类型
import type {
  Friend,
  Group,
  GetFriend,
  getGroupFriendType,
  BuddyVO,
  GroupBaseInfo,
  GroupVO
} from '@/types/friend'
import { searchFriendsByName } from '@/network/apis/friend'
// 引入store
const friendStore = useFriendStore()
const {
  getAllFriends,
  batchDeleteFriends,
  getPageGroupFriend,
  groupFriendInfo,
  groupFriendsMap,
  GroupFriend,
  friend
} = friendStore
const groupStore = useGroupStore()
const { getAllGroups } = groupStore

// 刷新数据
onShow(async () => {
  await refresh()
  // 确保分组数据已加载
  if (!groupStore.groupsInfo.records.length) {
    await getAllGroups()
  }
  if (friendStore.needRefresh) {
    console.log(friendStore.oldGroupId)
    getPageGroupFriend(friendStore.oldGroupId, 1, 10)
    // 重置旧分组的折叠状态为收起（arrow-right）
    const groupIndex = groupStore.groupsInfo.records.findIndex(
      (g) => g.id === friendStore.oldGroupId
    )
    if (groupIndex !== -1) {
      showFriendsBox.value[groupIndex] = false
    }
    friendStore.needRefresh = !friendStore.needRefresh
    console.log('调用后', friendStore.needRefresh)
  }
})

// 搜索框
const inputBox = ref<string>('')
const searchResults = ref<BuddyVO[]>([]) // 存储所有搜索结果
const selectedGroup = ref<GroupVO>() // 当前选中的分组
// 搜索到的好友分组
const searchedFriendGroup = ref<GroupVO>({
  id: 0,
  name: '',
  sortedNum: 0,
  groupNum: 0
})
// 新增方法：根据搜索结果获取对应的分组
const getGroupForResult = (result: BuddyVO): GroupVO => {
  return (
    groupStore.groupsInfo.records.find((g) => g.id === result.groupId) || {
      id: result.groupId,
      name: '未知分组',
      sortedNum: 0,
      groupNum: 0
    }
  )
}
// 搜索好友
const searchFriendByName = async (): Promise<void> => {
  if (inputBox.value === '') {
    uni.showToast({
      title: '请输入好友名字',
      icon: 'none'
    })
    return
  }
  // 先清空之前的结果
  searchResults.value = []
  const res = await searchFriendsByName(inputBox.value.trim(), 1, 10)
  console.log(res)
  if (res.records?.length > 0) {
    searchResults.value = res.records.map((item) => ({
      id: item.id,
      name: item.name,
      notes: item.notes || '',
      avatar: item.avatar || '',
      qrCode: item.qrCode || '',
      groupId: item.groupId
    }))
    // 确保分组数据已加载
    if (!groupStore.groupsInfo.records.length) {
      await getAllGroups()
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

// 刷新数据
async function refresh() {
  cancel()
  await getAllGroups()
  // 初始化折叠状态（默认全部收起）
  showFriendsBox.value = new Array(groupStore.groupsInfo.records.length).fill(false)
}

const longpress = (groupIndex: number, friendIndex: number) => {
  friendStore.friends[groupIndex].friendVO[friendIndex].checked = true
  checkboxOperate.value = true
}

// 操作界面ui显示
const checkboxOperate = ref(false)
// 取消多选操作
const cancel = () => {
  checkboxOperate.value = false
  for (let i = 0; i < friendStore.friends.length; i++) {
    for (let j = 0; j < friendStore.friends[i].friendVO?.length; j++) {
      friendStore.friends[i].friendVO[j].checked = false
    }
  }
}

// 删除弹窗
const showDelete = ref(false)
// 确认删除
async function confirmDelete() {
  showDelete.value = false
  let ids = []
  for (let i = 0; i < friendStore.friends.length; i++) {
    for (let j = 0; j < friendStore.friends[i].friendVO?.length; j++) {
      if (friendStore.friends[i].friendVO[j].checked) {
        ids.push(friendStore.friends[i].friendVO[j].userId)
      }
    }
  }
  if (ids.length) {
    await batchDeleteFriends(ids)
    uni.showToast({
      title: '删除成功'
    })
    refresh()
  } else
    uni.showToast({
      title: '请先选择好友',
      icon: 'none'
    })
}

// 跳转到移动页
const jumpPageMove = () => {
  friendStore.moveIds = []
  for (let i = 0; i < friendStore.friends.length; i++) {
    for (let j = 0; j < friendStore.friends[i].friendVO?.length; j++) {
      if (friendStore.friends[i].friendVO[j].checked) {
        friendStore.moveIds.push(friendStore.friends[i].friendVO[j].userId)
      }
    }
  }
  if (friendStore.moveIds.length)
    uni.navigateTo({
      url: '/pages/user/friends/move/move'
    })
  else
    uni.showToast({
      title: '请先选择好友',
      icon: 'none'
    })
}

// 分组是否折叠显示
const showFriendsBox = ref<boolean[]>([])

// 跳转到添加好友页
const jumpPageAddFriend = () => {
  uni.navigateTo({
    url: '/pages/user/friends/new/new'
  })
}

//跳转到分组页
const jumpPageGroups = () => {
  uni.navigateTo({
    url: '/pages/user/friends/groups/groups'
  })
}

// 跳转到好友详情页(分页分组获取好友页)
const jumpPageFriendDetail = (item: BuddyVO, groupInfo: GroupVO) => {
  friendStore.group.id = item.groupId
  friendStore.group.name = groupInfo.name
  friendStore.GroupFriend = item
  friendStore.oldGroupId = item.groupId
  uni.navigateTo({
    url: '/pages/user/friends/detail/detail?id=' + item.id
  })
}

const getDetailFriend = async (groupId: number, groupIndex: number) => {
  showFriendsBox.value[groupIndex] = !showFriendsBox.value[groupIndex]
  if (showFriendsBox.value[groupIndex]) {
    await getPageGroupFriend(groupId, 1, 10)
  }
}
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
      width: 612rpx;
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
  &__operate {
    display: flex;
    width: 400rpx;
    justify-content: flex-start;
    margin-left: 40rpx;
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
      &__tick {
        width: 30rpx;
        height: 30rpx;
        border-radius: 15rpx;
        border: solid 1px #e6e6e6;
      }
    }
  }
  &__checkbox {
    position: fixed;
    width: 100vw;
    display: flex;
    justify-content: space-around;
    padding-bottom: 75rpx;
    padding-top: 20rpx;
    bottom: 0;
    border-top: solid 1px #e6e6e6;
    background-color: #fcfcfe;
  }
  // &__new {
  //   margin-top: 20rpx;
  //   padding: 0 40rpx;
  //   display: flex;
  //   align-items: center;
  //   &__information {
  //     margin-left: 20rpx;
  //     width: 525rpx;
  //   }
  // }
  &__list {
    margin-top: 20rpx;
  }
  &__item {
    padding: 0 40rpx;
    margin-bottom: 20rpx; // 添加项之间的间距
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
}

:deep(.u-search__content) {
  border-radius: 10px !important;
}
</style>
