<template>
  <view class="login">
    <image
      src="https://www.szlab.xyz/item/image/2025/03/08/aaebdddacZbZknfhm4fomf.png"
      class="login__bg"
    ></image>
    <view class="login__welcome">
      <view class="login__welcome__text-content">
        <view class="login__welcome__text-content__title1">理物123123123123123123</view>
        <view class="login__welcome__text-content__title2">欢迎你 !</view>
      </view>
      <u-button
        class="login__welcome__btn"
        text="登录"
        color="#3988FF"
        customStyle="width: 80vw; height: 100rpx; margin-top: 60rpx; border-radius: 8px;"
        @click="jumpToInput"
      ></u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
// 如果有 token，则重定向到首页
uni.getStorage({
  key: 'token',
  success: function () {
    uni.switchTab({
      url: '/pages/home/home'
    })
  }
})

const jumpToInput = () => {
  uni.redirectTo({
    url: '/pages/login/loginInput'
  })
}
</script>

<style lang="scss" scoped>
.login {
  overflow-y: hidden;
  &__bg {
    position: relative;
    width: 100vw;
    height: 85vh;
  }

  &__welcome {
    position: absolute;
    bottom: 100rpx;
    width: 100vw;
    height: 450rpx;
    border-radius: 35px 35px 0 0;
    background-color: #fff;
    z-index: 999;

    &__text-content {
      display: flex;
      justify-content: center;
      align-items: baseline;
      width: 100%;
      height: 80rpx;
      font-size: 38rpx;
      margin-top: 60rpx;

      &__title1 {
        font-size: 44rpx;
        font-weight: bold;
        margin-right: 20rpx;
      }
    }
  }
}
</style>
