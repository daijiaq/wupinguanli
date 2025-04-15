<template>
  <view class="user">
    <u-navbar
      bgColor="transparent"
      leftIcon=""
      placeholder
      title="个人中心"
      titleStyle="font-weight:bold"
    >
    </u-navbar>

    <view class="user__info">
      <!-- <u-avatar :src="userInfoData.avatar" size="84"></u-avatar> -->
      <image
        class="user__info__avatar"
        :src="
          userInfoData.avatar ||
          'https://www.szlab.xyz/item/image/2025/03/08/bcaZabcbcZZuZsZqomf.png'
        "
        lazy-load
        @click="chooseAvatar"
      />
      <view class="user__info__main">
        <view class="user__info__main__name">
          <u-input
            v-model="userInfoData.name"
            :border="isChangingName ? 'surround' : 'none'"
            :disabled="!isChangingName"
            fontSize="40rpx"
            custom-style="padding: 0; font-weight: 600; margin-left: 46rpx;"
            maxlength="7"
            :showWordLimit="true"
            @blur="endChangeName"
          ></u-input>
          <u-icon
            name="edit-pen"
            size="22"
            color="#8389BE"
            custom-style="margin-top: 5rpx;"
            @click="changeUserName"
          ></u-icon>
        </view>
        <u-text :text="`ID: ${userInfoData.id}`" color="#A0A7BA" size="13"></u-text>
      </view>
    </view>

    <!-- 上部 -->
    <view class="user__top">
      <view class="user__top__item" @click="goToSettings(6)">
        <u-icon name="/static/user/friends.png" size="46"></u-icon>
        <view class="user__top__item__friends">好友</view>
      </view>
      <view class="user__top__item" style="padding-top: 44rpx" @click="goToSettings(1)">
        <u-icon
          name="/static/user/settings.png"
          size="32"
          custom-style="margin-top: 10rpx;"
        ></u-icon>
        <view class="user__top__item__settings" style="padding-top: 18rpx">设置</view>
      </view>
      <view class="user__top__item" @click="goToSettings(4)">
        <u-icon
          name="/static/user/recycleBin.png"
          size="28"
          custom-style="margin-bottom: 40rpx;"
        ></u-icon>
        <view class="user__top__item__recycle" style="padding-top: 15rpx">回收站</view>
      </view>
      <view class="user__top__item" style="padding-top: 43rpx" @click="goToSettings(7)">
        <u-icon
          name="/static/user/myQrCode.png"
          size="26"
          custom-style="margin-top: 26rpx;"
        ></u-icon>
        <view class="user__top__item__qrcode" style="padding-top: 18rpx">二维码</view>
      </view>
    </view>

    <!-- 下部 -->
    <view class="user__settings">
      <view class="user__settings__item" @click="goToSettings(0)">
        <view class="user__settings__item__left">
          <u-icon name="reload" size="24" custom-style="margin-right: 22rpx;"></u-icon>
          <u-text text="版本更新" size="15"></u-text>
        </view>
        <u-icon name="arrow-right" color="#0F0F0F"></u-icon>
        <u-divider line-color="#EBEFFF"></u-divider>
      </view>
      <view class="user__settings__item" @click="goToSettings(2)">
        <view class="user__settings__item__left">
          <u-icon name="email" size="24" custom-style="margin-right: 22rpx;"></u-icon>
          <u-text text="意见反馈" size="15"></u-text>
        </view>
        <u-icon name="arrow-right" color="#0F0F0F"></u-icon>
        <u-divider line-color="#EBEFFF"></u-divider>
      </view>
      <view class="user__settings__item" @click="goToSettings(5)">
        <view class="user__settings__item__left">
          <u-icon name="bag" size="24" custom-style="margin-right: 22rpx;"></u-icon>
          <u-text text="物品修改记录" size="15"></u-text>
        </view>
      </view>
      <view class="user__settings__item" @click="logOut()">
        <view class="user__settings__item__left">
          <u-icon
            name="https://www.szlab.xyz/item/image/2025/03/08/cZbZbcceacebaknfHtsomf.png"
            size="20"
            custom-style="margin-right: 28rpx;"
          ></u-icon>
          <u-text text="退出登录" size="15"></u-text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import { onShow } from '@dcloudio/uni-app'
import type { UserInfo } from '@/types/user'
import { getTemporaryTokenAPI } from '@/network/apis/faceBack'
import { AvatarSDk, avatarUrl } from '@/utils/SDK'

const user = useUserStore()
const { fetchUserInfo, changeAvatar, changeName } = user
const { userInfo } = storeToRefs(user)
const searchStore = useSearchStore()
const { currentTagList, currentSearchInputData } = storeToRefs(searchStore)

const userInfoData = reactive<UserInfo>({
  id: userInfo.value.id,
  userId: userInfo.value.userId,
  phone: userInfo.value.phone,
  name: userInfo.value.name,
  avatar: userInfo.value.avatar,
  qrCode: userInfo.value.qrCode
})

watch(userInfo, (val) => {
  ;({
    id: userInfoData.id,
    name: userInfoData.name,
    avatar: userInfoData.avatar,
    qrCode: userInfoData.qrCode
  } = val)
})

// 退出登录
const logOut = () => {
  uni.showModal({
    title: '确定退出？',
    content: '确定退出此账号吗？',
    success: (res) => {
      if (res.confirm) {
        // 获取本地 userId 数组
        const userIdArr = JSON.parse(uni.getStorageSync('userId'))
        // 删除当前 userId
        const newUserIdArr = userIdArr.filter((item: number) => item !== userInfo.value.userId)
        // 如果当前 userId 数组为空，则删除 storage 中的 userId 数组
        if (newUserIdArr.length === 0) {
          uni.removeStorageSync('userId')
        } else {
          // 不为空则更新本地 userId 数组
          uni.setStorageSync('userId', JSON.stringify(newUserIdArr))
        }
        // 删除本地缓存的 token 和 uuid
        uni.removeStorageSync('token')
        uni.removeStorageSync('uuid')
        // 提示
        uni.showToast({
          title: '退出登录成功',
          icon: 'success'
        })
        // 跳转到登录页
        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/login/login'
          })
        }, 1500)
      }
    }
  })
}

onShow(() => {
  // 获取用户信息
  fetchUserInfo()
  // 从搜索页返回，清空搜索、筛选条件
  currentSearchInputData.value.inputData = {
    name: ''
  }
  currentTagList.value.tagsList.forEach((item) => {
    item.isChecked = false
  })
})

// 切换头像
const chooseAvatar = () => {
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sizeType: ['compressed'],
    success: async (res) => {
      uni.showLoading({
        title: '头像上传中'
      })
      // 大小限制
      if (res.tempFiles[0].size > 1572864) {
        uni.showToast({
          title: '图片大小不能超过1.5M',
          icon: 'none'
        })
        return
      }
      //获取临时token
      const token = await getTemporaryTokenAPI()
      const avatarRes = await AvatarSDk('user/avatar', token, res.tempFiles[0].tempFilePath)
      //发送请求
      await changeAvatar(avatarUrl.value)
      uni.showToast({
        title: '头像修改成功',
        icon: 'success'
      })
    }
  })
}

// 修改用户名
const isChangingName = ref(false)
const changeUserName = () => {
  isChangingName.value = true
}

// 结束修改用户名
const endChangeName = async () => {
  isChangingName.value = false
  await changeName(userInfoData.name)
  uni.showToast({
    title: '用户名修改成功',
    icon: 'success'
  })
}

// 点击跳转
const goToSettings = (index: number) => {
  switch (index) {
    // 版本更新
    case 0:
      uni.navigateTo({
        url: '/pages/user/update/update'
      })
      break
    // 设置
    case 1:
      uni.navigateTo({
        url: '/pages/user/settings/index'
      })
      break
    // 意见反馈
    case 2:
      uni.navigateTo({
        url: '/pages/user/feedback/feedback'
      })
      break
    // 最近删除
    case 4:
      uni.navigateTo({
        url: '/pages/user/deleted/deleted'
      })
      break
    // 物品修改记录
    case 5:
      uni.navigateTo({
        url: '/pages/user/history/history'
      })
      break
    // 好友列表
    case 6:
      uni.navigateTo({
        url: '/pages/user/friends/friends'
      })
      break
    case 7:
      uni.navigateTo({
        url: '/pages/user/settings/showQrCode'
      })
      break
    default:
      uni.showToast({
        title: '该功能暂未开放',
        icon: 'error'
      })
      break
  }
}
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: $uni-bg-color-gradient;

  &__info {
    display: flex;
    align-items: center;
    width: 80%;
    height: 200rpx;
    margin-top: 38rpx;

    &__avatar {
      width: 170rpx;
      height: 170rpx;
      border-radius: 50%;
    }

    &__main {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      height: 60%;
      margin-left: 40rpx;

      &__name {
        display: flex;
        align-items: center;
        gap: 2px;
      }
    }
  }

  &__top {
    display: flex;
    width: 90%;
    height: 200rpx;
    border-radius: 18px;
    margin-top: 30rpx;
    background-color: #fff;
    box-shadow: $uni-box-shadow;

    &__item {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 25%;
      height: 100rpx;
      padding: 40rpx;
      font-size: 26rpx;
      font-weight: bold;
      color: #999999;

      &__friends {
        margin-top: 10rpx;
        margin-left: 10rpx;
      }

      &__settings {
        margin-top: 8rpx;
      }

      &__recycle {
        position: absolute;
        top: 112rpx;
        left: 40rpx;
      }

      &__qrcode {
        margin-top: 10rpx;
      }
    }
  }

  &__qrcode {
    width: 400rpx;
    padding-top: 30rpx;

    &__img {
      width: 300rpx;
      height: 300rpx;
      margin: 10rpx 50rpx 20rpx 50rpx;
    }
  }

  &__settings {
    width: 80%;
    height: 450rpx;
    border-radius: 18px;
    margin-top: 60rpx;
    padding: 30rpx 40rpx;
    background-color: #fff;
    box-shadow: $uni-box-shadow;

    &__item {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 100rpx;
      margin-bottom: 22rpx;

      &__left {
        display: flex;
      }
    }
  }
}
:deep(.u-divider) {
  position: absolute;
  bottom: -44rpx;
  width: 100%;
}
:deep(.u-input) {
  background: transparent !important;
}
:deep(.u-input__content) {
  background: transparent !important;
}
:deep(.u-input__content__field-wrapper__field) {
  width: 300rpx !important;
  height: 80rpx !important;
  background: transparent !important;
}
</style>
