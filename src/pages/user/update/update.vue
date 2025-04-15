<template>
  <view class="update">
    <u-navbar placeholder autoBack></u-navbar>

    <view class="update__info">
      <u-image
        src="/static/user/logo.png"
        radius="26"
        width="114"
        height="114"
        custom-style="margin-bottom: 25rpx;"
      ></u-image>
      <u-text text="理物" align="center"></u-text>
      <u-text text="v1.0.0" align="center"></u-text>
    </view>

    <view class="update__ability">
      <!-- <view class="update__ability__item">
        <u-text text="功能介绍"></u-text>
        <u-icon name="arrow-right"></u-icon>
      </view> -->
      <view class="update__ability__item" style="border-top: none" @click="checkUpdate">
        <u-text text="版本更新"></u-text>
        <u-icon name="arrow-right"></u-icon>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const checkUpdate = () => {
  uni.showToast({
    title: '已是最新版本',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
.update {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding-top: 60rpx;

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
  }

  &__ability {
    width: 80%;
    margin-top: 80rpx;

    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 110rpx;
      padding: 0 20rpx 0 20rpx;
      border-top: 1px solid rgba($color: #d8d7db, $alpha: 0.37);
      border-bottom: 1px solid rgba($color: #d8d7db, $alpha: 0.37);
    }
  }
}
</style>
