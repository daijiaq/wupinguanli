<template>
  <view class="formInputItem">
    <u-row>
      <u-col span="2" customStyle="position: relative;">
        <u-text color="#353535" :bold="true" :text="name" />
        <slot name="icon" />
      </u-col>
      <u-col :span="span">
        <u-input
          v-if="display"
          :placeholder="placeHolder"
          border="none"
          :maxlength="maxLength"
          :disabled="disabled"
          :disabledColor="'#fff'"
          :type="type"
          v-model="tempInput"
          @blur="changeInput"
        />
        <template v-if="disabled && !display">
          <u-link
            v-if="tempInput !== '' && tempInput !== null"
            text="点击复制"
            :href="tempInput"
          ></u-link>
          <p v-else>暂无链接</p>
        </template>
      </u-col>
      <u-col v-if="unitName" span="2">
        <u-text text="元"></u-text>
      </u-col>
    </u-row>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = withDefaults(
  defineProps<{
    // 是否显示输入框
    display?: boolean
    // 单位名称
    unitName?: string
    // 输入内容
    input: string | number
    // 最大长度
    maxLength: number
    // 是否禁用
    disabled: boolean
    // 默认内容
    placeHolder: string
    // 名字
    name: string
    // 类型
    type: string
    // 输入框长度
    span?: number
  }>(),
  {
    display: true,
    input: '',
    maxLength: 0,
    disabled: false,
    unitName: '',
    placeHolder: '',
    name: '',
    type: '',
    span: 10
  }
)
//输入内容
const tempInput = ref(props.input)
const emits = defineEmits<{
  //更新输入内容
  (e: 'update:input', input: string | number): void
  (e: 'onLossFocus', input: string | number): void
}>()
const changeInput = (): void => {
  emits('update:input', tempInput.value)
  emits('onLossFocus', tempInput.value)
}

watch(
  () => props.input,
  (val) => {
    tempInput.value = val
  }
)
</script>

<style scoped lang="scss">
.formInputItem {
  margin-bottom: 10px;
}
</style>
