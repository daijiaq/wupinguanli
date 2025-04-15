<template>
  <view class="message">
    <u-navbar leftIcon="" title="广场" placeholder titleStyle="font-weight:bold"></u-navbar>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
onShow(() => {
  uni.showToast({
    title: '该功能尚未开放',
    icon: 'error'
  })
})
</script>

<style scoped lang="scss">
.message {
  overflow-x: hidden;
}
</style>
