<template>
  <view>
    <up-navbar
      bgColor="transparent"
      placeholder
      title=""
      titleStyle="font-weight:bold"
      autoBack="false"
    >
    </up-navbar>
  </view>
  <view class="title">
    <text>请选择异常类型</text>
  </view>
  <view class="content-openFail" @click="goToOpenFail">
    <text>无法打开小程序</text>
    <up-icon name="arrow-right"></up-icon>
  </view>
  <view class="content-crash" @click="goToCrash">
    <text>小程序闪退</text>
    <up-icon name="arrow-right"></up-icon>
  </view>
  <view class="content-slowLoad" @click="goToSlowLoad">
    <text>页面加载慢</text>
    <up-icon name="arrow-right"></up-icon>
  </view>
  <view class="content-other" @click="goToOther">
    <text>其他异常</text>
    <up-icon name="arrow-right"></up-icon>
  </view>
</template>
<script setup lang="ts">
function goToOpenFail() {
  uni.navigateTo({
    url: '/pages/user/feedback/functionError/openFail'
  })
}

function goToCrash() {
  uni.navigateTo({
    url: '/pages/user/feedback/functionError/crash'
  })
}

function goToSlowLoad() {
  uni.navigateTo({
    url: '/pages/user/feedback/functionError/slowLoad'
  })
}

function goToOther() {
  uni.navigateTo({
    url: '/pages/user/feedback/functionError/other'
  })
}
</script>
<style lang="scss">
.title {
  width: 80%;
  height: 60rpx;
  margin: 50rpx auto;
  text-align: center;
  text {
    font-weight: bold;
  }
}
%content {
  width: 80%;
  height: 120rpx;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content-openFail,
.content-crash,
.content-slowLoad,
.content-other {
  @extend %content;
}
</style>
