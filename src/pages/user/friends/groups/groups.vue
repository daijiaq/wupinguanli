<template>
  <view class="groups">
    <u-navbar bgColor="#f6f6f6" title="编辑分组" :autoBack="true" />
    <view class="groups__item" v-show="!showNew">
      <Tag
        @deleteTag="setId(item.id)"
        v-for="(item, index) in groupStore.groupsInfo.groupsData"
        :key="index"
        :tag="item"
        @focus="focus"
        @blur="blur"
        :showColor="false"
        :index="index"
      >
      </Tag>
    </view>
    <view v-show="!showNew" @click="showNew = true" class="groups-plus">
      <u-icon size="70rpx" color="#fff" name="plus" />
    </view>
    <view v-if="showNew" class="groups__new">
      <view class="groups__new-title"> 名称 </view>
      <view class="groups__new-input">
        <u-input v-model="name" fontSize="35rpx" border="none" placeholder="输入分组名称" />
      </view>
      <view class="groups__new-title"> 分组成员 </view>
      <view
        v-for="(item, index) in friendStore.tempFriends"
        :key="index"
        class="groups__new__friend"
      >
        <u-avatar size="75rpx" :src="item.avatar"></u-avatar>
        <view class="groups__new__friend__information">
          <u-text color="#353535" :text="item.name"></u-text>
          <u-line color="rgba(255,255,255,0)" margin="5rpx 0"></u-line>
          <u-text color="#a4a4a4" size="20rpx" :text="`id: ${item.id}`"></u-text>
        </view>
        <view @click="deleteFriend(index)" class="groups__new__friend__delete">
          <u-icon size="20rpx" color="#fff" name="close"></u-icon>
        </view>
      </view>
      <view class="groups__new-input">
        <u-text
          iconStyle="color:#3988ff"
          color="#3988ff"
          prefixIcon="plus"
          text="&nbsp;&nbsp;添加好友"
          @click="jumpPageAdd"
        ></u-text>
      </view>
      <view class="groups__new-submit">
        <u-button @click="showNew = false" text="返回"></u-button>
        <u-line color="rgba(255,255,255,0)" direction="col" margin="0 10rpx" />
        <u-button @click="submit" type="primary" text="确认"></u-button>
      </view>
    </view>
    <u-modal
      @cancel="showDelete = false"
      @confirm="confirmDelete()"
      :showCancelButton="true"
      :show="showDelete"
      width="600rpx"
    >
      确认删除?
    </u-modal>
    <u-modal
      @cancel="cancelChangeName"
      @confirm="confirmChangeName"
      :showCancelButton="true"
      :show="showChangeName"
      width="600rpx"
    >
      确认修改分组名?
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore, useFriendStore } from '@/stores/friend'

// 引入store
const groupStore = useGroupStore()
const { getAllGroups, createGroup, deleteGroup, updateGroup } = groupStore
const friendStore = useFriendStore()
const { moveFriend } = friendStore
friendStore.tempFriends.length = 0

// 获取分组
if (groupStore.groupsInfo.groupsData.length === 0) getAllGroups()

// 显示新建分组
const showNew = ref(false)
// 显示删除弹窗
const showDelete = ref(false)
// 显示修改名字弹窗
const showChangeName = ref(false)
// 暂存变量
let originName = ''
let submitName = ''
let submitId = 0
// 聚焦事件
const focus = (name: string): void => {
  // 避免聚焦先于脱焦发生
  setTimeout(() => {
    originName = name
  }, 100)
}
// 脱焦事件
const blur = (id: number, name: string) => {
  if (originName !== name) showChangeName.value = true
  submitId = id
  submitName = name
}
// 暂存当前分组id
const setId = (id: number) => {
  submitId = id
  showDelete.value = true
}
// 确认删除
async function confirmDelete() {
  await deleteGroup(submitId)
  uni.showToast({
    title: '删除成功',
    icon: 'none',
    duration: 2000
  })
  refresh()
  showDelete.value = false
}
// 确认修改名字
async function confirmChangeName() {
  showChangeName.value = false
  console.log(submitId, submitName)
  await updateGroup(submitId, submitName)
  uni.showToast({
    title: '修改成功',
    icon: 'none',
    duration: 2000
  })
  refresh()
}
// 新建分组
async function submit() {
  let ids: number[] = []
  for (let i = 0; i < friendStore.tempFriends.length; i++) {
    ids.push(friendStore.tempFriends[i].userId)
  }
  const newGroup = await createGroup(name.value)
  await moveFriend(newGroup.id, ids)
  showNew.value = false
  uni.showToast({
    title: '添加成功',
    icon: 'none',
    duration: 2000
  })
  refresh()
  // 清空数据
  name.value = ''
  friendStore.tempFriends.length = 0
}
const name = ref('')
// 取消修改名字
const cancelChangeName = () => {
  showChangeName.value = false
  refresh()
}
// 刷新
async function refresh() {
  groupStore.groupsInfo.groupsData.length = 0
  await getAllGroups()
}
// 删除好友
const deleteFriend = (index: number) => {
  friendStore.tempFriends.splice(index, 1)
}
const jumpPageAdd = () => {
  uni.navigateTo({
    url: '/pages/user/friends/groups/friends/friends'
  })
}
</script>

<style lang="scss">
.groups {
  box-sizing: border-box;
  margin-top: 100rpx;
  height: calc(100vh - 100rpx);
  overflow: auto;
  background-color: #f6f6f6;

  &__item {
    margin-top: 75rpx;
  }
  &-plus {
    position: fixed;
    width: 100rpx;
    height: 100rpx;
    background-color: #3988ff;
    border-radius: 50rpx;
    right: 35rpx;
    bottom: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__new {
    &-title {
      margin-top: 20px;
      padding-left: 40rpx;
      color: #656565;
      font-size: 30rpx;
      margin-bottom: 20rpx;
    }

    &-input {
      padding-left: 50rpx;
      margin-top: 20rpx;
      background-color: #fff;
      height: 100rpx;
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
    }

    &-submit {
      position: fixed;
      display: flex;
      bottom: 50rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 400rpx;
    }

    &__friend {
      margin-top: 20rpx;
      padding-left: 30rpx;
      display: flex;
      align-items: center;
      &__information {
        margin-left: 20rpx;
        width: 550rpx;
      }

      &__delete {
        width: 30rpx;
        height: 30rpx;
        border-radius: 15rpx;
        background-color: #d9d9d9;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 6rpx;
      }
    }
  }
}
</style>
