<template>
  <view class="acqui_verification_code">
    <view class="verification_code_continor" @click="handleContainerClick">
      <view
        v-for="(item, index) in latticeNum"
        :key="index"
        class="verification_code_item"
        :style="latticeSty(index)"
      >
        <template v-if="inputValues[index]">
          <view v-if="ciphertextSty == 1" class="point"></view>
          <template v-else>
            {{ ciphertextSty == 2 ? '*' : inputValues[index] }}
          </template>
        </template>
      </view>
    </view>
    <div class="input-info">
      <input
        :type="inputType"
        v-model="inputValues"
        :focus="isFocusLocal"
        :maxlength="latticeNum"
        @input="inputVal"
        @blur="blur"
        @focus="focus"
        class="input-info__main"
        adjust-position="false"
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
      inputValues: '',
      blurShowLocal: true,
      isFocusInternal: false,
      isFocusing: false
    }
  },
  watch: {
    isFocus(val: boolean) {
      this.isFocusInternal = false
      wx.nextTick(() => {
        this.isFocusInternal = val
      })
    }
  },
  // 监控 show，显示时自动获取焦点
  computed: {
    isFocusLocal() {
      return this.isFocusInternal
    }
  },
  mounted() {
    this.blurShowLocal = this.blurShow
    // 初始化时设置焦点
    if (this.isFocus) {
      this.$nextTick(() => {
        this.isFocusInternal = true
      })
    }
  },
  methods: {
    latticeSty(index: any) {
      let str =
        this.blurShowLocal &&
        (this.inputValues.length === index ||
          (this.inputValues.length === this.latticeNum && index === this.latticeNum - 1))
          ? this.borderCheckStyle
          : this.borderStyle
      str += `;width:${this.latticeSize}rpx;height:${this.latticeSize}rpx`
      return str
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
    },
    blur() {
      !this.blurShow ? (this.blurShowLocal = false) : ''
    },
    focus() {
      !this.blurShow ? (this.blurShowLocal = true) : ''
    },
    handleContainerClick() {
      if (typeof wx !== 'undefined' && wx.nextTick) {
        wx.nextTick(() => {
          this.isFocusInternal = false // 先取消焦点
          wx.nextTick(() => {
            this.isFocusInternal = true // 再重新聚焦
          })
        })
      }
    }
  }
}
</script>

<style lang="less">
.acqui_verification_code {
  position: relative;

  .verification_code_continor {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .verification_code_item {
      flex: 1;
      min-width: 0;
      position: relative;
      max-width: 60px;
      margin: 0 1%;

      /* 内容样式 */
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;

      /* 密文样式 */
      .point {
        width: 16rpx;
        height: 16rpx;
        background-color: #333;
        border-radius: 50%;
      }

      /* 平板专属适配 */
      @media (min-width: 1024px) {
        max-width: 50rpx;
        max-height: 55rpx;
        font-size: 32rpx;
        margin: 0 0.8%;
      }
    }
  }

  .input-info {
    position: absolute;
    top: -9999px;
    left: -9999px;
    width: 1px;
    height: 1px;
    opacity: 0;
    z-index: 10;
    overflow: hidden;

    &__main {
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: transparent;
      caret-color: transparent;
      text-shadow: none;
      -webkit-text-fill-color: transparent;
      font-size: 0;
      line-height: 0;
    }
  }
}
</style>
