<template>
  <view>
    <u-navbar
      bgColor="transparent"
      placeholder
      title="设置"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>
    <view class="settings">
      <view class="settings__item" @click="goToAccount()">
        <view class="settings__item__left">
          <u-text text="账号安全" size="15"></u-text>
        </view>
        <u-icon name="arrow-right" color="#0F0F0F"></u-icon>
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
      <!-- <view class="settings__item">
        <view class="settings__item__left">
          <u-text text="默认接受所有共享管理申请" size="15"></u-text>
        </view>
        <u-switch
          v-model="settingsData.allowManagement"
          :activeValue="1"
          :inactiveValue="0"
        ></u-switch>
        <u-divider line-color="#d9d9d9"></u-divider>
      </view> -->
      <view class="settings__item">
        <view class="settings__item__left">
          <u-text text="直接删除物品不放入回收站" size="15"></u-text>
        </view>
        <u-switch :activeValue="1" :inactiveValue="0"></u-switch>
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
      <view class="settings__item">
        <view class="settings__item__left">
          <u-text text="wifi下自动更新" size="15"></u-text>
        </view>
        <u-switch :activeValue="1" :inactiveValue="0"></u-switch>
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
      <view class="settings__item">
        <view class="settings__item__left">
          <u-text text="设置私密物品不可见" size="15"></u-text>
        </view>
        <u-switch
          v-model="settingsData.privacyItemInvisible"
          :activeValue="1"
          :inactiveValue="0"
          @change="setPrivacyDisplay"
        ></u-switch>
        <view
          class="settings__item__change-pwd"
          @click="changePrivacyDisplay"
          :style="{ color: settingsData.privacyItemInvisible ? '#3988ff' : '#d9d9d9' }"
          >修改密码</view
        >
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
      <view class="settings__item">
        <view class="settings__item__left">
          <u-text text="私密物品使用通用密码" size="15"></u-text>
        </view>
        <u-switch
          v-model="settingsData.unifiedPasswordUsed"
          :activeValue="1"
          :inactiveValue="0"
          @change="setUnifiedPassword"
        ></u-switch>
        <view
          class="settings__item__change-pwd"
          @click="changeUnifiedPassword"
          :style="{ color: settingsData.unifiedPasswordUsed ? '#3988ff' : '#d9d9d9' }"
          >修改密码</view
        >
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
      <view class="settings__item">
        <view class="settings__item__left">
          <u-text text="开启隐藏空间" size="15"></u-text>
        </view>
        <u-switch
          v-model="settingsData.privacyDisplay"
          :activeValue="1"
          :inactiveValue="0"
          @change="setPrivacyDisplayRoom"
        ></u-switch>
        <view
          class="settings__item__change-pwd"
          @click="changePrivacyDisplayRoom"
          :style="{ color: settingsData.privacyDisplay ? '#3988ff' : '#d9d9d9' }"
          >修改密码</view
        >
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
      <view class="settings__item">
        <view class="settings__item__left">
          <u-text text="清除缓存" size="15"></u-text>
        </view>
        <u-divider line-color="#d9d9d9"></u-divider>
        <u-icon name="arrow-right" color="#0F0F0F"></u-icon>
      </view>
      <view class="settings__item">
        <view class="settings__item__left">
          <u-text text="版本信息" size="15"></u-text>
        </view>
        <u-switch :activeValue="1" :inactiveValue="0"></u-switch>
        <u-divider line-color="#d9d9d9"></u-divider>
      </view>
    </view>
    <PasswordPopup
      :popup="popup"
      @close="popup = false"
      @confirmGesture="confirmGesture"
      @confirmNumber="confirmNumber"
    />
    <PasswordPopup
      :popup="clearPopup"
      @close="clearPopup = false"
      @confirmGesture="confirmClearPassword"
      @confirmNumber="confirmClearPassword"
      isValidate
    />
    <PasswordPopup
      :popup="changePasswordPopup"
      @close="changePasswordPopup = false"
      @confirmGesture="confirmChangePassword"
      @confirmNumber="confirmChangePassword"
      isValidate
    />
  </view>
</template>

<script setup lang="ts">
import { onShow, onHide } from '@dcloudio/uni-app'
import { ref, reactive, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { validatePassword } from '@/network/apis/settings'

const settings = useSettingsStore()
const { settingsInfo } = storeToRefs(settings)
const { initSettings, setPasswordStore, updateSettingsStore, clearPasswordStore } = settings

onShow(async () => {
  await initSettings()
  // 初始化
  settingsData.allowManagement = settingsInfo.value.allowManagement
  settingsData.privacyItemInvisible = settingsInfo.value.privacyItemInvisible
  settingsData.unifiedPasswordUsed = settingsInfo.value.unifiedPasswordUsed
  settingsData.privacyDisplay = settingsInfo.value.privacyDisplay
})

// 设置数据
const settingsData = reactive({
  allowManagement: settingsInfo.value.allowManagement,
  privacyItemInvisible: settingsInfo.value.privacyItemInvisible,
  unifiedPasswordUsed: settingsInfo.value.unifiedPasswordUsed,
  privacyDisplay: settingsInfo.value.privacyDisplay
})

//密码弹窗
const popup = ref(false)
const clearPopup = ref(false)
const changePasswordPopup = ref(false)
// 0隐私物品使用的通用密码 1开启隐藏空间密码,2设置私密物品不可见密码
const tempType = ref<0 | 1 | 2>(0)

// 监听设置密码弹窗
watch(
  () => popup.value,
  () => {
    if (!popup.value && !settingsInfo.value.privacyItemInvisible)
      settingsData.privacyItemInvisible = 0
    if (!popup.value && !settingsInfo.value.unifiedPasswordUsed)
      settingsData.unifiedPasswordUsed = 0
  }
)

// 监听清除密码弹窗
watch(
  () => clearPopup.value,
  () => {
    if (!clearPopup.value && settingsInfo.value.privacyItemInvisible)
      settingsData.privacyItemInvisible = 1
    if (!clearPopup.value && settingsInfo.value.unifiedPasswordUsed)
      settingsData.unifiedPasswordUsed = 1
  }
)

// 设置设置私密物品不可见
const setPrivacyDisplay = () => {
  // 开启密码
  if (settingsData.privacyItemInvisible) {
    updateSettingsStore(settingsData.allowManagement, settingsData.privacyItemInvisible)
    popup.value = true
    tempType.value = 2
  } else {
    updateSettingsStore(settingsData.allowManagement, settingsData.privacyItemInvisible)
    // 清空密码
    tempType.value = 2
    clearPopup.value = true
  }
}

// 修改私密物品不可见密码
const changePrivacyDisplay = () => {
  if (settingsData.privacyItemInvisible) {
    changePasswordPopup.value = true
    tempType.value = 2
  }
}

// 设置私密物品使用通用密码
const setUnifiedPassword = () => {
  if (settingsData.unifiedPasswordUsed) {
    popup.value = true
    tempType.value = 0
  } else {
    tempType.value = 0
    clearPopup.value = true
  }
}

// 设置隐藏空间密码
const setPrivacyDisplayRoom = () => {
  if (settingsData.privacyDisplay) {
    popup.value = true
    tempType.value = 1
  } else {
    tempType.value = 1
    clearPopup.value = true
  }
}

// 修改隐藏空间密码
const changePrivacyDisplayRoom = () => {
  if (settingsData.privacyDisplay) {
    changePasswordPopup.value = true
    tempType.value = 1
  }
}

// 修改私密物品使用通用密码
const changeUnifiedPassword = () => {
  if (settingsData.unifiedPasswordUsed) {
    changePasswordPopup.value = true
    tempType.value = 0
  }
}

// 清空密码时输入密码验证的弹窗
const confirmClearPassword = async (password: string) => {
  await validatePassword(password, tempType.value)
  uni.showToast({
    title: '验证成功',
    icon: 'success'
  })
  clearPopup.value = false
  clearPasswordStore(tempType.value)
}

// 开启手势密码
async function confirmGesture(password: string) {
  popup.value = false
  await setPasswordStore(password, tempType.value)
  uni.showToast({
    title: '设置成功',
    icon: 'success'
  })
  if (tempType.value) settingsData.privacyItemInvisible = 1
  else settingsData.unifiedPasswordUsed = 1
}

// 开启数字密码
async function confirmNumber(password: string) {
  popup.value = false
  if (tempType.value) await setPasswordStore(password, tempType.value)
  else await setPasswordStore(password, tempType.value)
  uni.showToast({
    title: '设置成功',
    icon: 'success'
  })
  if (tempType.value) settingsData.privacyItemInvisible = 1
  else settingsData.unifiedPasswordUsed = 1
}

// 修改密码
const confirmChangePassword = async (password: string) => {
  changePasswordPopup.value = false
  try {
    await validatePassword(password, tempType.value)
    uni.showToast({
      title: '验证成功，请设置新密码',
      icon: 'none'
    })
    if (settingsData.privacyItemInvisible) {
      setPrivacyDisplay()
    } else {
      setUnifiedPassword()
    }
  } catch {
    uni.showToast({
      title: '密码错误',
      icon: 'none'
    })
  }
}

// 跳转账号安全设置
const goToAccount = () => {
  uni.navigateTo({
    url: '/pages/user/settings/account'
  })
}

// 界面隐藏时更新设置
onHide(() => {
  updateSettingsStore(settingsData.allowManagement, settingsData.privacyItemInvisible)
})
</script>

<style lang="scss" scoped>
.settings {
  width: 100%;
  height: 700rpx;
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

    &__change-pwd {
      position: absolute;
      top: 100rpx;
      left: 20rpx;
      font-size: 26rpx;
    }
  }
}
:deep(.u-divider) {
  position: absolute;
  left: 0;
  bottom: -55rpx;
  width: 105%;
}
</style>
