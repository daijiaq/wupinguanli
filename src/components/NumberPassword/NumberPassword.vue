<template>
  <view class="acqui_verification_code">
    <view class="verification_code_continor">
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
      blurShowLocal: true
    }
  },
  // 监控 show，显示时自动获取焦点
  computed: {
    isFocusLocal() {
      return this.isFocus
    }
  },
  mounted() {
    this.blurShowLocal = this.blurShow
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

    .verification_code_item {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      display: flex;
    }

    .verification_code_item:not(:first-child) {
      margin-left: 20rpx;
    }
    .point {
      width: 15rpx;
      height: 15rpx;
      background-color: #333;
      border-radius: 200px;
    }
  }

  .input-info {
    width: 100%;
    height: 100%;
    z-index: 8;
    display: flex;
    justify-content: center;
    overflow: hidden;

    &__main {
      position: absolute;
      width: 80%;
      height: 100%;
      left: -100%;
    }
  }
}
</style>
