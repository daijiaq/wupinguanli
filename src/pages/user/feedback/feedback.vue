<template>
  <view class="nav">
    <up-navbar
      bgColor="transparent"
      placeholder
      title="请选择反馈类型"
      titleStyle="font-weight:bold"
      autoBack="false"
      leftIcon="arrow-left"
    >
    </up-navbar>
  </view>
  <view class="record" @click="gotoRecord">
    <up-icon
      name="file-text"
      class="feedback-record"
      size="28"
      label="反馈记录"
      space="10rpx"
      color="#000"
      bold="true"
    ></up-icon>
  </view>
  <view class="functionError" @click="goToFunctionError">
    <text>功能使用异常</text>
    <up-icon name="arrow-right"></up-icon>
  </view>
  <view class="suggestion" @click="goToSuggestion">
    <text>产品开发建议</text>
    <up-icon name="arrow-right"></up-icon>
  </view>
</template>

<script setup lang="ts">
function goToFunctionError() {
  uni.navigateTo({
    url: '/pages/user/feedback/functionError/index'
  })
}

function goToSuggestion() {
  uni.navigateTo({
    url: '/pages/user/feedback/suggestion'
  })
}
function gotoRecord() {
  uni.navigateTo({
    url: '/pages/user/feedback/record'
  })
}
</script>
<style lang="scss" scoped>
.nav {
  width: 90%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.record {
  width: 80%;
  height: 60rpx;
  margin: 100rpx auto;
  // margin-top: 30rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
%functionError {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 120rpx;
  margin: 30rpx auto;
  text-align: left;
}
.functionError,
.suggestion {
  @extend %functionError;
}
</style>
