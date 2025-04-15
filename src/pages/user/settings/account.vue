<template>
  <view>
    <u-navbar
      bgColor="transparent"
      placeholder
      title="设置"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>
    <view class="account">
      <view class="account__item">
        <view class="account__item__left">
          <u-text text="手机号" size="15"></u-text>
        </view>
        <view class="account__item__right">
          <view style="font-size: 30rpx">{{ currentPhone }}</view>
          <u-icon name="arrow-right" color="#0F0F0F"></u-icon>
        </view>
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
      <view class="account__item" @click="goToSettings(0)">
        <view class="account__item__left">
          <u-text text="修改密码" size="15"></u-text>
        </view>
        <u-divider line-color="#d9d9d9"></u-divider>
        <u-icon name="arrow-right" color="#0F0F0F"></u-icon>
      </view>
      <view class="account__item" @click="goToSettings(1)">
        <view class="account__item__left">
          <u-text text="切换账号" size="15"></u-text>
        </view>
        <u-divider line-color="#d9d9d9"></u-divider>
        <u-icon name="arrow-right" color="#0F0F0F"></u-icon>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const user = useUserStore()
const { userInfo } = storeToRefs(user)

// 默认接受所有共享管理申请
const acceptAllShareRequest = ref(true)

// 手机号中间显示为星号
const hidePhoneNum = (phone: string) => {
  return phone.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
}

// 当前手机号
const currentPhone = computed(() => {
  return hidePhoneNum(userInfo.value.phone)
})

const goToSettings = (index: number) => {
  switch (index) {
    case 0:
      uni.navigateTo({
        url: '/pages/user/settings/passwordSet'
      })
      break
    case 1:
      uni.navigateTo({
        url: '/pages/user/settings/switchAccount'
      })
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
.account {
  width: 100%;
  height: 700rpx;
  margin-top: 40rpx;
  padding: 40rpx 0 40rpx 60rpx;
  background-color: #fff;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    height: 130rpx;
    margin-bottom: 22rpx;

    &__left {
      display: flex;
      padding-left: 20rpx;
    }

    &__right {
      display: flex;
      gap: 20rpx;
    }
  }
}
:deep(.u-divider) {
  position: absolute;
  left: 0;
  bottom: -44rpx;
  width: 105%;
}
</style>
