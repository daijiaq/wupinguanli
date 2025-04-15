<template>
  <view
    class="sort-button"
    @click="onClick"
    :style="{
      backgroundColor: isActive ? '#c4dcff' : '',
      width: buttonWidth,
      marginBottom: buttonMarginBottom + 'px'
    }"
  >
    <view>{{ title }}</view>
    <u-icon v-if="isShowIcon" name="arrow-down-fill" color="#3988ff"></u-icon>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  options: { styleIsolation: 'shared' }
})
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  title: string
  width: string
  marginBottom: number
  isActive: boolean
  showIcon?: boolean
}>()

const emits = defineEmits<{
  (e: 'onClick'): void
  (e: 'changeShow', showProperties: boolean): void
}>()
const buttonWidth = ref<number | string>(90)
const buttonMarginBottom = ref(12)
const isShowIcon = ref(false)
const isActive = ref(false)

const onClick = () => {
  emits('onClick')
}

const setWidth = (value: number | string) => {
  value = props.width
  if (value?.includes('%') ?? false) {
    buttonWidth.value = value
  } else {
    buttonWidth.value = (value || 90) + 'px'
  }
}

const iconShow = () => {
  if (props.showIcon) {
    isShowIcon.value = props.showIcon
  }
}

const activeShow = () => {
  isActive.value = props.isActive
}

watch(
  () => props.isActive,
  () => {
    activeShow()
  }
)

// 初始化
const initial = () => {
  iconShow()
  activeShow()
  setWidth(props.width)
  buttonMarginBottom.value = props.marginBottom || 12
}

initial()
</script>

<style lang="scss" scoped>
.sort-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
  border-radius: 10px;
  font-size: 14px;
  background-color: #f8f8fd;
}
</style>
