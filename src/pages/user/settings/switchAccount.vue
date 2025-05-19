<template>
  <view>
    <u-navbar
      bgColor="transparent"
      placeholder
      title="切换账号"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>
    <view class="switch-account">
      <view
        v-for="item in accountsInfo"
        :key="item.userId"
        class="switch-account__item"
        @click="switchAccount(item)"
      >
        <!-- 遮罩层 -->
        <view
          v-if="userInfo.id === item.userId && isSetting"
          class="switch-account__item__mask"
        ></view>
        <view class="switch-account__item__left">
          <image
            :src="item.avatar"
            lazy-load
            :showError="false"
            class="switch-account__item__left__avatar"
          ></image>
          <u-text :text="item.name" size="15"></u-text>
        </view>
        <!-- 当前账号 -->
        <u-icon
          v-if="userInfo.id === item.userId"
          name="checkmark-circle-fill"
          color="#3988ff"
        ></u-icon>
        <!-- 退出登录按钮 -->
        <image
          v-if="userInfo.id !== item.userId && isSetting"
          src="https://www.szlab.xyz/item/image/2025/03/08/cZbZbcceacebaknfHtsomf.png"
          style="width: 40rpx; height: 40rpx"
          @click="logOut(item.userId)"
        ></image>
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
      <!-- 添加或注册账号 -->
      <view class="switch-account__item" @click="addNewAccount()">
        <view class="switch-account__item__left">
          <image
            src="https://www.szlab.xyz/item/image/2025/03/08/cbZedaZecbabZcc3bbntmsomf.png"
            lazy-load
            :showError="false"
            class="switch-account__item__left__avatar"
          ></image>
          <u-text text="添加或注册账号" size="15"></u-text>
        </view>
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
      <!-- 底部管理状态切换 -->
      <view class="switch-account__bottom">
        <view class="switch-account__bottom__word" @click="changeToAdmin">
          {{ isSetting ? '完成' : '管理' }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import type { AccountsInfo } from '@/types/settings'
import { changeToken } from '@/network/apis/settings'

const user = useUserStore()
const { userInfo } = storeToRefs(user)
const { fetchUserInfo } = user

const settings = useSettingsStore()
const { accountsInfo } = storeToRefs(settings)
const { initSwitchAccounts } = settings

// 开启管理
const isSetting = ref(false)

// const userInfoWatch = ref<>(false)

// watch(userInfo, (newVal) => {
//   if (newVal) {
//     uni.showToast({
//       title: '管理状态开启',
//       icon: 'none'
//     })
//   }
// })

// 点击切换账号
const switchAccount = async (item: AccountsInfo) => {
  console.log(item)
  // const data = await changeToken(item.id, user.passwordMap.get(item.id))
  // const data = uni.getStorageSync('passwordId')
  const data = uni.getStorageSync('passwordId')
  if (data) user.passwordMap = new Map(JSON.parse(data))
  console.log(user.passwordMap)
  console.log(item.userId, user.passwordMap.get(item.userId))
  const dataToken = await changeToken(item.userId, user.passwordMap.get(item.userId))
  console.log(dataToken)
  // 非管理状态下，点击切换账号
  if (!isSetting.value) {
    uni.showModal({
      title: '确定切换账号？',
      content: '确定切换账号吗？',
      success: async (res) => {
        if (res.confirm) {
          // 改变存储中的 token 和 uuid
          // uni.setStorageSync('uuid', item.id)
          uni.setStorageSync('uuid', dataToken.id)
          uni.setStorageSync('token', dataToken.token)
          // 重新获取当前用户信息
          await fetchUserInfo()
        }
      }
    })
  }
}
// switchAccount(11)

// 添加账号
const addNewAccount = () => {
  uni.navigateTo({
    url: '/pages/login/loginInput'
  })
}

// 切换到管理状态
const changeToAdmin = () => {
  isSetting.value = !isSetting.value
}

// 退出登录
const logOut = (userId: number) => {
  uni.showModal({
    title: '确定退出此账号？',
    content: '确定删除此账号吗？',
    success: (res) => {
      if (res.confirm) {
        console.log(userId)
        // 删除对应 password 新加
        const data = uni.getStorageSync('passwordId')
        if (data) user.passwordMap = new Map(JSON.parse(data))
        user.passwordMap.delete(userId)
        console.log(user.passwordMap)
        uni.setStorageSync('passwordId', JSON.stringify([...user.passwordMap]))
        // 获取本地 userId 数组
        const userIdArr = JSON.parse(uni.getStorageSync('userId'))
        // 删除当前 userId
        const newUserIdArr = userIdArr.filter((item: number) => item !== userId)
        // 更新本地 userId 数组
        uni.setStorageSync('userId', JSON.stringify(newUserIdArr))
        // 重新获取列表
        getAccounts()
      }
    }
  })
}

// 获取已登录过的账号列表
const getAccounts = () => {
  const userId = JSON.parse(uni.getStorageSync('userId'))
  console.log(userId)
  initSwitchAccounts(userId)
}

// onShow(() => {
//   getAccounts()
// })
onShow(async () => {
  await getAccounts() // 确保数据加载完成
})
</script>

<style lang="scss" scoped>
.switch-account {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 700rpx;
  background-color: #fff;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    height: 115rpx;
    margin-top: 20rpx;
    margin-bottom: 22rpx;

    &__mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #fff, $alpha: 0.6);
      z-index: 1;
    }

    &__left {
      display: flex;
      padding-left: 20rpx;

      &__avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        margin-right: 30rpx;
      }
    }
  }

  &__bottom {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 150rpx;
    background-color: #f2f2f2;

    &__word {
      position: absolute;
      top: 45%;
      right: 40rpx;
      color: #565656;
      transform: translateY(-50%);
    }
  }
}
:deep(.u-divider) {
  position: absolute;
  left: 0;
  bottom: -44rpx;
  width: 100%;
}
</style>
