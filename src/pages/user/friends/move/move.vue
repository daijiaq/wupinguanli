<template>
  <view class="groups">
    <u-navbar
      bgColor="transparent"
      placeholder
      title="移动到"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>
    <view
      class="groups__item"
      v-for="(item, index) in groupStore.groupsInfo.groupsData"
      :key="index"
    >
      <u-text @click="setGroup(item.id, item.name)" size="32rpx" :text="item.name"></u-text>
    </view>
    <u-modal
      @cancel="showMove = false"
      @confirm="confirmMove()"
      :showCancelButton="true"
      :show="showMove"
      width="600rpx"
    >
      确认移动到{{ groupName }}分组?
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore, useFriendStore } from '@/stores/friend'
const groupStore = useGroupStore()
const friendStore = useFriendStore()
const { moveFriend } = friendStore
const showMove = ref(false)
const groupName = ref('')
let groupID = 0
const setGroup = (id: number, name: string) => {
  showMove.value = true
  groupID = id
  groupName.value = name
}
async function confirmMove() {
  showMove.value = false
  try {
    await moveFriend(groupID, friendStore.moveIds)
    uni.showToast({
      title: '移动成功',
      icon: 'none',
      duration: 2000
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch {
    uni.showToast({
      title: '移动失败',
      icon: 'none',
      duration: 2000
    })
  }
}
</script>

<style lang="scss" scoped>
.groups {
  &__item {
    padding-left: 20rpx;
    height: 114rpx;
    line-height: 114rpx;
    border-bottom: solid 1px #ececec;
  }
}
</style>
