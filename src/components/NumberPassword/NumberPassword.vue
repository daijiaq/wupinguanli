<template>
  <view class="acqui_verification_code" @click="handleContainerClick">
    <view class="verification_code_continor">
      <view
        v-for="(item, index) in latticeNum"
        :key="index"
        class="verification_code_item"
        :class="{ verification_code_item_active: isItemActive(index) }"
        :style="latticeSty(index)"
        @click.stop="focusInputAtIndex(index)"
      >
        <template v-if="inputValues[index]">
          <view v-if="ciphertextSty == 1" class="point"></view>
          <template v-else>
            {{ ciphertextSty == 2 ? '*' : inputValues[index] }}
          </template>
        </template>
        <!-- 显示光标 -->
        <view v-if="shouldShowCursor(index)" class="cursor"></view>
      </view>
    </view>
    <div class="input-info">
      <input
        ref="hiddenInput"
        :type="inputType"
        v-model="inputValues"
        :focus="isFocusLocal"
        :maxlength="latticeNum"
        @input="inputVal"
        @blur="blur"
        @focus="focus"
        class="input-info__main"
      />
    </div>
  </view>
</template>

<script lang="ts">
export default {
  props: {
    // 输入框框框的个数
    latticeNum: {
      type: Number,
      default: 4
    },
    // 输入框框框大小
    latticeSize: {
      type: Number,
      default: 100
    },
    // 未选中样式
    borderStyle: {
      type: String,
      default: 'background-color: #fff;'
    },
    // 选中的样式
    borderCheckStyle: {
      type: String,
      default: 'background-color: #fff; border: 1px solid #8CBAFF !important;'
    },
    // input类型
    inputType: {
      type: String,
      default: 'number'
    },
    // 失去焦点后是否继续显示，当前所对焦的输入框（样式）
    blurShow: {
      type: Boolean,
      default: false
    },
    // 密文样式  1 圆点样式    2 星号 *  样式   默认为0   无密文
    ciphertextSty: {
      type: Number,
      default: 1
    },
    // 是否允许修改/填写某一个框框的值
    updateOne: {
      type: Boolean,
      default: false
    },
    // 是否获取焦点
    isFocus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      inputValues: '', //输入的值,
      blurShowLocal: true,
      isInputFocused: false, // 追踪输入框是否聚焦
      currentFocusIndex: 0 // 当前焦点所在的索引
    }
  },
  // 监控 show，显示时自动获取焦点
  computed: {
    isFocusLocal() {
      return this.isFocus && this.isInputFocused
    }
  },
  mounted() {
    this.blurShowLocal = this.blurShow
    // 组件挂载后立即聚焦
    this.$nextTick(() => {
      this.focusInput()
    })
  },
  watch: {
    isFocus(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.focusInput()
        })
      }
    },
    inputValues(newVal) {
      // 当输入值改变时，更新焦点位置到下一个空位
      this.currentFocusIndex = Math.min(newVal.length, this.latticeNum - 1)
    }
  },
  methods: {
    latticeSty(index: any) {
      let str = `width:${this.latticeSize}rpx;height:${this.latticeSize}rpx;`
      if (this.isItemActive(index)) {
        str += this.borderCheckStyle
      } else {
        str += this.borderStyle
      }
      return str
    },
    // 判断当前项是否活跃
    isItemActive(index: any) {
      return this.blurShowLocal && this.isInputFocused && this.currentFocusIndex === index
    },
    // 判断是否显示光标
    shouldShowCursor(index: any) {
      return (
        this.isInputFocused &&
        this.currentFocusIndex === index &&
        !this.inputValues[index] &&
        this.blurShowLocal
      )
    },
    // 处理容器点击事件
    handleContainerClick() {
      // 点击容器时，焦点定位到第一个空位
      const emptyIndex = this.inputValues.length
      this.currentFocusIndex = Math.min(emptyIndex, this.latticeNum - 1)
      this.focusInput()
    },
    // 点击特定位置的密码框
    focusInputAtIndex(index: number) {
      // 如果点击的是已填充的位置，则定位到下一个空位
      if (this.inputValues[index]) {
        const emptyIndex = this.inputValues.length
        this.currentFocusIndex = Math.min(emptyIndex, this.latticeNum - 1)
      } else {
        // 如果点击的是空位，则直接定位到该位置
        this.currentFocusIndex = index
      }
      this.focusInput()
    },
    // 聚焦输入框
    focusInput() {
      this.$nextTick(() => {
        const input = this.$refs.hiddenInput as HTMLInputElement
        if (input) {
          this.isInputFocused = true
          input.focus()
          // 确保焦点设置成功，如果失败则重试
          setTimeout(() => {
            if (input && document.activeElement !== input) {
              input.focus()
            }
          }, 100)
        }
      })
    },
    // 获取输入框的值
    getValue() {
      return this.inputValues
    },
    /**
     * 输入框值改变
     */
    inputVal() {
      this.$emit('inputVerificationChange', this.inputValues)
    },
    // 设置验证码的值
    /**
     * verificationCodeValue
     */
    setVerificationCode(verificationCodeValue: any) {
      if (!verificationCodeValue) return
      this.inputValues = verificationCodeValue
    },
    /**
     * 清空验证码的值
     */
    cleanVal() {
      this.inputValues = ''
      this.currentFocusIndex = 0
      // 清空后重新聚焦
      this.$nextTick(() => {
        this.focusInput()
      })
    },
    blur() {
      this.isInputFocused = false
      !this.blurShow ? (this.blurShowLocal = false) : ''
    },
    focus() {
      this.isInputFocused = true
      !this.blurShow ? (this.blurShowLocal = true) : ''
    }
  }
}
</script>

<style lang="less">
.acqui_verification_code {
  position: relative;

  .verification_code_continor {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    gap: 20rpx; /* 使用gap替代margin-left，更好的兼容性 */

    .verification_code_item {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2rpx solid #e0e0e0;
      border-radius: 8rpx;
      background-color: #fff;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;

      &.verification_code_item_active {
        border-color: #8cbaff;
        box-shadow: 0 0 8rpx rgba(140, 186, 255, 0.3);
      }
    }

    .point {
      width: 15rpx;
      height: 15rpx;
      background-color: #333;
      border-radius: 50%;
    }

    .cursor {
      position: absolute;
      width: 2rpx;
      height: 40rpx;
      background-color: #8cbaff;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%,
      50% {
        opacity: 1;
      }
      51%,
      100% {
        opacity: 0;
      }
    }
  }

  .input-info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;

    &__main {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 100%;
      opacity: 0;
      pointer-events: auto;
      z-index: 999;
      /* 确保输入框不完全移出视野，保持可聚焦 */
    }
  }
}
</style>
