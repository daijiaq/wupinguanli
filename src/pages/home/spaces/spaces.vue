<template>
  <view class="spaces">
    <u-navbar autoBack titleWidth="250rpx" :title="name" bgColor="#F5F5F5" />
    <Space />
  </view>
</template>

<script setup lang="ts">
import { onUnload } from '@dcloudio/uni-app'
import { useFormStore } from '@/stores/form'
const name = useFormStore().currentName
onUnload(() => {
  useFormStore().currentFloor--
})
</script>
