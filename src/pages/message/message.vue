<template>
  <view class="message">
    <u-navbar leftIcon="" title="消息" placeholder titleStyle="font-weight: bold"></u-navbar>

    <MessageList />
  </view>
</template>

<script setup lang="ts">
// import { onShow } from '@dcloudio/uni-app'
// onShow(() => {
//   uni.showToast({
//     title: '该功能尚未开放',
//     icon: 'error'
//   })
// })
</script>

<style scoped lang="scss">
.message {
  overflow-x: hidden;
}
</style>
