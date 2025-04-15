<template>
  <view class="password-popup">
    <u-popup
      :show="isShow"
      mode="center"
      round="16"
      @close="close"
      custom-style="width: 300px; background-color: #F6F5F5;"
    >
      <view v-if="isNumber" class="password-popup__title">
        {{ isValidate ? '请输入密码' : !setNumberTime ? '请输入数字密码' : '请确认数字密码' }}
      </view>
      <view v-if="isGesture" class="password-popup__title">
        {{ isValidate ? '请输入密码' : !setGestureTime ? '请绘制手势密码' : '请确认手势密码' }}
      </view>
      <u-tabs :list="passwordTypeList" @click="tabClick" :scrollable="false"></u-tabs>
      <!-- 数字密码 -->
      <view v-if="isNumber" class="password-popup__number">
        <NumberPassword
          ref="numberPasswordBox"
          @inputVerificationChange="inputVerificationChange"
          :isFocus="isFocus"
        />
      </view>
      <!-- 手势密码 -->
      <GesturePassword
        v-if="isGesture"
        :isClosePopup="isClosePopup"
        @change="change"
        @start="start"
      />
      <view v-show="isGesture && lineError" class="password-popup__error">
        手势密码最少经过四个点
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onUpdated } from 'vue'
import { onShow } from '@dcloudio/uni-app'
const props = defineProps<{
  // 是否弹出
  popup: boolean
  // 输入密码
  isValidate: boolean
}>()

const emits = defineEmits<{
  // 关闭
  (e: 'close'): void
  // 确认手势密码
  (e: 'confirmGesture', password: number): void
  // 确认数字密码
  (e: 'confirmNumber', password: string): void
}>()
// 弹出框是否显示
const isShow = ref(false)
// 是否是数字密码
const isNumber = ref(true)
// 数字密码的输入框
const numberPasswordBox = ref()
// 是否是手势密码
const isGesture = ref(false)
// 0 第一次设置手势密码，1 确认手势密码
const setGestureTime = ref(0)
// 0 第一次设置数字密码，1 确认数字密码
const setNumberTime = ref(0)
// 是否关闭弹窗，用来告知子组件
const isClosePopup = ref(true)

// 手势密码的值
const gesturePassword = ref<number>(0)
// 数字密码的值
const numberPassword = ref<string>('')

// 密码类型
const passwordTypeList = ref([
  {
    name: '数字密码'
  },
  {
    name: '手势密码'
  }
])

// 监听 popup 的 show 变化，更新子组件的 focus 状态
const isFocus = ref(false)
onUpdated(() => {
  isFocus.value = props.popup
})

// 手势密码错误提示
const lineError = ref(false)

// 监听弹出框的显示状态
watch(
  () => props.popup,
  (newVal) => {
    if (newVal) {
      isClosePopup.value = false
    } else {
      isClosePopup.value = true
    }
    isShow.value = newVal
  }
)

// 切换 tab
const tabClick = (item: any) => {
  if (item.index) {
    isGesture.value = true
    isNumber.value = false
  } else {
    // 向手势弹窗组件传递信息，解锁屏幕滚动
    isGesture.value = false
    isNumber.value = true
  }
}

// 手势密码
// 手势密码开始输入
const start = () => {
  lineError.value = false
}

// 手势密码输入后执行
const change = (data: any) => {
  // 密码长度小于 4
  if (data.length < 4) {
    lineError.value = true
    return
  }
  gesturePassword.value = data.join('')
  // 设置手势密码
  if (!props.isValidate) {
    !setGestureTime.value ? firstSetGesture() : secondSetGesture()
  } else {
    // 验证手势密码
    validateGesturePassword()
  }
}

// 验证手势密码
const validateGesturePassword = () => {
  emits('confirmGesture', gesturePassword.value)
}

// 第一次输入手势密码
const firstSetGesture = () => {
  uni.setStorageSync('gesture', gesturePassword.value)
  gesturePassword.value = 0
  setGestureTime.value = 1
}

// 第二次输入确认手势密码
const secondSetGesture = () => {
  const isPass = uni.getStorageSync('gesture')
  if (gesturePassword.value === isPass) {
    uni.showToast({
      title: '设置成功',
      icon: 'success'
    })
    emits('confirmGesture', gesturePassword.value)
    close()
  } else {
    uni.showToast({
      title: '两次密码不一致',
      icon: 'error'
    })
  }
}

// 数字密码
// 验证数字密码
const validateNumberPassword = () => {
  emits('confirmNumber', numberPassword.value)
}

// 设置数字密码
const setNumberPassword = () => {
  if (numberPasswordBox.value.getValue().length !== 4) {
    uni.showToast({
      title: '请输入四位数字密码',
      icon: 'error'
    })
    return
  }
  if (!setNumberTime.value) {
    uni.setStorageSync('number', numberPassword.value)
    numberPassword.value = ''
    setNumberTime.value = 1
  } else {
    const isPass = uni.getStorageSync('number')
    if (numberPassword.value === isPass) {
      uni.showToast({
        title: '设置成功',
        icon: 'success'
      })
      emits('confirmNumber', numberPassword.value)
      close()
    } else {
      uni.showToast({
        title: '两次密码不一致',
        icon: 'error'
      })
    }
  }
}

// 数字密码输入框改变时执行
const inputVerificationChange = (inputValues: string) => {
  if (inputValues.length === 4) {
    numberPassword.value = inputValues
    props.isValidate ? validateNumberPassword() : setNumberPassword()
    numberPasswordBox.value.cleanVal()
  }
}

// 关闭弹出框
const close = () => {
  // 关闭弹出框
  isShow.value = false
  // 重置手势密码设置次数
  setGestureTime.value = 0
  // 重置数字密码设置次数
  setNumberTime.value = 0
  // 清除手势密码缓存
  uni.removeStorageSync('gesture')
  // 清除数字密码缓存
  uni.removeStorageSync('number')
  // 清空数字密码输入框的值
  numberPasswordBox.value.cleanVal()
  emits('close')
}
</script>

<style lang="scss">
.password-popup {
  position: relative;

  &__title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 60rpx 0 30rpx 0;
  }

  &__number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 150px;
    overflow: hidden;
  }

  &__error {
    position: absolute;
    bottom: 40rpx;
    left: 50%;
    height: 50rpx;
    font-size: 26rpx;
    color: red;
    transform: translate(-50%, 0);
  }
}
</style>
