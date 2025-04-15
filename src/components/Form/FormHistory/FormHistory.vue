<template>
  <view class="formHistory">
    <view class="formHistory__user">
      <text class="formHistory__user-username">{{ history.username }}</text>
      <u-text lines="1" size="22rpx" :text="history.content" />
    </view>
    <u-text size="25rpx" align="right" color="#aaadb7" :text="history.date" />
  </view>
  <u-line customStyle="margin:0 auto" direction="row" length="80%"></u-line>
</template>

<script setup lang="ts">
import type { Log } from '@/types/form'
defineProps<{
  //历史记录
  history: Log
}>()
</script>

<style lang="scss" scoped>
.formHistory {
  display: flex;

  &__user {
    display: flex;
    align-items: center;
    width: 70%;
    font-size: 25rpx;
    font-weight: 1000;

    &-username {
      margin-right: 20rpx;
    }
  }
}
</style>
