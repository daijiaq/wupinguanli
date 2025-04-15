<template>
  <view class="login-input">
    <u-form :rules="rules" :model="loginForm" ref="loginFormRef">
      <u-form-item prop="account">
        <view class="login-input__label">手机号码</view>
        <u-input
          v-model="loginForm.account"
          placeholder="填写你的手机号码"
          maxlength="11"
          clearable
          customStyle="
            padding: 0 30rpx 0 30rpx;
            margin-bottom: 16rpx;
            border-radius: 8px;
            background-color: #f7f8f9;
            letter-spacing: 2rpx;
          "
        ></u-input>
      </u-form-item>
      <u-form-item prop="password">
        <view class="login-input__label">密码</view>
        <u-input
          v-model="loginForm.password"
          placeholder="填写你的密码"
          password
          clearable
          customStyle="
            padding: 0 30rpx 0 30rpx;
            border-radius: 8px;
            background-color: #f7f8f9;
            letter-spacing: 2rpx;
          "
        ></u-input>
      </u-form-item>
    </u-form>
    <u-button
      class="login-input__submit"
      text="登录/注册"
      customStyle="
        width: 80vw;
        height: 110rpx;
        margin-top: 100rpx;
        border-radius: 8px;
        background-color: #3988ff;
        color: #fff;
        font-weight: bold;
        letter-spacing: 2rpx;
      "
      :loading="isLoading"
      loadingText="登录中"
      @click="loginSubmit"
    ></u-button>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { loginByPassword } from '@/network/apis/auth'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const loginFormRef = ref()

const isLoading = ref(false)
// 表单数据
const loginForm = reactive({
  account: '',
  password: '',
  identity: 0
})

// 手机号校验规则
// validator 参数应该用组件库定义好的类型，但 uview-plus 没有使用 ts 定义
const validatePhone = (rule: any, value: any, callback: (error?: string | Error) => void) => {
  // 去除空格
  const phone = value.replace(/\s/g, '')
  const regs = /^1[3456789]\d{9}$/
  if (!regs.test(phone)) callback(new Error('手机号输入不合法'))
  else callback()
}

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
  account: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      min: 11,
      max: 11,
      message: '请输入正确的手机号',
      trigger: 'blur'
    },
    {
      validator: validatePhone,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      validator: validatePassword,
      message: '密码的长度为8-16位，组成至少要包括大小写字母、数字及标点符号的其中两项',
      trigger: 'blur'
    }
  ]
}

// userId 数组
const userIdArr = ref<number[]>([])
userIdArr.value = JSON.parse(uni.getStorageSync('userId') || '[]')

// 提交登录表单
const loginSubmit = () => {
  loginFormRef.value.validate().then(async () => {
    try {
      isLoading.value = true
      const { token, id, userId } = await loginByPassword(loginForm)
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
      isLoading.value = false
      uni.setStorageSync('token', token)
      uni.setStorageSync('uuid', id)
      // 登录时添加 userId 到数组中
      userIdArr.value.push(userId)
      // userId 数组去重
      userIdArr.value = Array.from(new Set(userIdArr.value))
      uni.setStorageSync('userId', JSON.stringify(userIdArr.value))

      auth.toLogin = false
      auth.logined = true

      setTimeout(() => {
        uni.switchTab({
          url: '/pages/home/home'
        })
      }, 1500)
    } catch {
      auth.toLogin = true
      auth.logined = false
      isLoading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.login-input {
  position: relative;
  top: 650rpx;
  left: 50%;
  width: 80vw;
  transform: translate(-50%, -50%);

  &__label {
    margin-left: 10rpx;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: #000;
  }
}
:deep(.u-input__content) {
  height: 100rpx;
}
</style>
