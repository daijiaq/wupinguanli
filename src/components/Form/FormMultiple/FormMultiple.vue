<template>
  <view class="formMultiple">
    <FormTag
      @click="checkboxClick(index)"
      :tag="item"
      v-for="(item, index) in props.tags"
      :key="index"
      :checked="tagBox[index]"
      :shape="'square'"
    />
  </view>
</template>

<script setup lang="ts">
import FormTag from '@/components/Form/FormTag/FormTag.vue'
import type { Label } from '@/types/form'
const props = defineProps<{
  // 标签数组
  tags: Label[]
  // 标签选取状态数组
  tagBox: boolean[]
}>()
const emits = defineEmits<{
  //点击事件回调
  (e: 'checkboxClick', name: number): void
}>()
const checkboxClick = (name: number) => {
  emits('checkboxClick', name)
}
</script>

<style lang="scss" scoped>
.formMultiple {
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
}
</style>
