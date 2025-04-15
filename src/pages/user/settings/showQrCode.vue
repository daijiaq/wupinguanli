<template>
  <view class="codeBox">
    <u-navbar
      title="我的二维码"
      autoBack
      placeholder
      bgColor="#f5f5f5"
      titleStyle="font-weight:bold"
    >
    </u-navbar>
    <view class="codeBox__content">
      <view class="codeBox__content__user-info">
        <view class="codeBox__content__user-info__avatar">
          <image
            :src="userInfoData.avatar || 'https://www.szlab.xyz/item/image/2025/03/08/bcaZabcbcZZuZsZqomf.png'"
            lazy-load
            style="width: 50px; height: 50px; border-radius: 4px; margin: 10px"
          />
        </view>
        <view class="codeBox__content__user-info__name">
          <u-text :text="userInfoData.name || '用户1234567'" bold="true"></u-text>
          <u-text :text="`ID: ${userInfoData.id}`" color="#A0A7BA" size="12"></u-text>
        </view>
      </view>
      <view class="codeBox__content__qr-code">
        <image
          :src="userInfoData.qrCode"
          lazy-load
          mode="scaleToFill"
          style="width: 236px; height: 236px"
        />
      </view>
      <view class="codeBox__content__info">
        <text>扫一扫二维码，添加我为好友</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import type { UserInfo } from '@/types/user'
import { onShow } from '@dcloudio/uni-app'

// 获取用户信息
const user = useUserStore()
const { fetchUserInfo } = user
const { userInfo } = storeToRefs(user)

watch(userInfo, (val) => {
  ;({
    id: userInfoData.id,
    name: userInfoData.name,
    avatar: userInfoData.avatar,
    qrCode: userInfoData.qrCode
  } = val)
})

const userInfoData = reactive<UserInfo>({
  id: userInfo.value.id,
  userId: userInfo.value.userId,
  phone: userInfo.value.phone,
  name: userInfo.value.name,
  avatar: userInfo.value.avatar,
  qrCode: userInfo.value.qrCode
})

onShow(() => {
  fetchUserInfo()
})
</script>

<style lang="scss" scoped>
.codeBox {
  position: relative;

  &__content {
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);

    &__user-info {
      display: flex;
      align-items: center;
    }
    &__qr-code {
      margin: 20rpx 0 40rpx;
    }
    &__info {
      font-size: 13px;
      text-align: center;
      color: #a0a7ba;
    }
  }
}
</style>
