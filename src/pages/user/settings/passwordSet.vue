<template>
  <view class="settings">
    <u-navbar
      placeholder
      title="修改密码"
      titleStyle="font-weight:bold"
      autoBack
      bgColor="#FAFAFA"
    ></u-navbar>
    <u-form :rules="rules" :model="passwordForm" ref="form">
      <u-form-item prop="oldPassword">
        <view class="settings__item__left">
          <u-text text="请输入原密码" size="15"></u-text>
        </view>
        <u-input
          v-model="passwordForm.oldPassword"
          maxlength="16"
          password
          placeholder="请输入8~16位密码"
          @blur="validateOldPassword"
        />
      </u-form-item>
      <u-form-item prop="newPassword">
        <view class="settings__item__left">
          <u-text text="请输入新密码" size="15"></u-text>
        </view>
        <u-input
          v-model="passwordForm.newPassword"
          maxlength="16"
          password
          placeholder="请输入8~16位密码"
        />
      </u-form-item>
      <u-form-item prop="reEnterNewPassword">
        <view class="settings__item__left">
          <u-text text="请再次输入新密码" size="15"></u-text>
        </view>
        <u-input
          v-model="passwordForm.reEnterNewPassword"
          password
          maxlength="16"
          placeholder="请确认密码"
        />
      </u-form-item>
    </u-form>
    <view class="settings__forget" @click="forgetPassword">忘记密码？</view>
    <button class="settings__confirm" @click="confirmNewPassword">确认</button>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { validateUserPassword, updateUserPassword } from '@/network/apis/settings'

const user = useUserStore()

const form = ref()
// 输入密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  reEnterNewPassword: ''
})

// 密码输入校验
const validatePassword = (rule: any, value: any, callback: any) => {
  // 去除空格
  const password = value.replace(/\s/g, '')
  const regs = /^(?![A-Za-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/
  if (!regs.test(password))
    callback(new Error('密码的长度为8-16位，组成至少要包括大小写字母、数字及标点符号的其中两项'))
  else callback()
}

const rules = {
  oldPassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      validator: validatePassword,
      message: '密码的长度为8-16位,组成至少要包括大小写字母、数字及标点符号的其中两项',
      trigger: 'blur'
    }
  ],
  newPassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      validator: validatePassword,
      message: '密码的长度为8-16位,组成至少要包括大小写字母、数字及标点符号的其中两项',
      trigger: 'blur'
    }
  ],
  reEnterNewPassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      validator: validatePassword,
      message: '密码的长度为8-16位,组成至少要包括大小写字母、数字及标点符号的其中两项',
      trigger: 'blur'
    }
  ]
}

// 失去焦点时验证旧密码
const validateOldPassword = async () => {
  form.value.validateField('oldPassword').then(async () => {
    try {
      // await checkPassword(passwordForm.oldPassword)
    } catch {
      console.log('密码错误')
    }
  })
}

// 忘记密码
const forgetPassword = () => {
  console.log('忘记密码')
}

// 确认提交
const confirmNewPassword = () => {
  // 表单验证
  form.value.validate().then(async () => {
    try {
      uni.showLoading({
        title: '修改中'
      })
      // 验证旧密码
      try {
        await validateUserPassword(passwordForm.oldPassword)
      } catch (error) {
        uni.hideLoading()
        return uni.showToast({
          title: '原密码错误',
          icon: 'error',
          duration: 2000
        })
      }
      // await validateUserPassword(passwordForm.oldPassword)

      // 验证两次新密码输入是否一致
      if (passwordForm.newPassword !== passwordForm.reEnterNewPassword) {
        uni.showToast({
          title: '两次密码输入不一致',
          icon: 'none'
        })
        return
      }
      // 修改密码
      await updateUserPassword(passwordForm.oldPassword, passwordForm.newPassword)
      // 修改对应 password 新加
      uni.setStorageSync('password', passwordForm.newPassword)
      const data = uni.getStorageSync('passwordId')
      if (data) user.passwordMap = new Map(JSON.parse(data))
      const userId = uni.getStorageSync('uuid')
      user.passwordMap.set(userId, passwordForm.newPassword)
      // console.log(user.passwordMap)
      uni.setStorageSync('passwordId', JSON.stringify([...user.passwordMap]))
      uni.showToast({
        title: '修改成功',
        icon: 'success'
      })

      // 修改成功后返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } catch {
      console.log('修改失败')
    }
  })
}
</script>

<style lang="scss" scoped>
.settings {
  &__item {
    &__left {
      display: flex;
      margin-bottom: 28rpx;
    }
  }

  &__forget {
    position: absolute;
    left: 10%;
    bottom: 48%;
    font-size: 27rpx;
    font-weight: bold;
    color: #165dff;
  }

  &__confirm {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    bottom: 250rpx;
    transform: translateX(-50%);
    width: 230rpx;
    height: 85rpx;
    font-size: 30rpx;
    color: #fff;
    border-radius: 7px;
    background-color: $uni-theme-color;
    z-index: 999;
  }
}

:deep(.u-form) {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding-top: 40rpx;
  background-color: #fafafa;
}
:deep(.u-form-item) {
  position: relative;
  width: 85%;
  height: 130rpx;
  margin-bottom: 60rpx;
}
:deep(.u-form-item__body__right__message) {
  padding-left: 160rpx;
}
:deep(.u-input) {
  background: #fff !important;
  border: none !important;
}
:deep(.u-input__content) {
  background: #fff !important;
}
:deep(.u-input__content__field-wrapper__field) {
  width: 300rpx !important;
  height: 65rpx !important;
  background: #fff !important;
}
</style>
