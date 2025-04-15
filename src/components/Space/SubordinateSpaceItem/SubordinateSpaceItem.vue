<template>
  <view v-show="display" class="subordinateSpaceItem">
    <view :style="`padding:${titlePadding}`" class="subordinateSpaceItem__title">
      <view class="subordinateSpaceItem__title__icon">
        <u-icon
          @click="show = !show"
          size="27rpx"
          :name="show ? 'arrow-down-fill' : 'play-right-fill'"
          color="#3988ff"
        ></u-icon>
      </view>
      <u-text :bold="true" :text="`第${props.floor}层`" />
    </view>
    <view v-show="show" :style="`padding:${tagPadding}`" class="subordinateSpaceItem__tag">
      <FormTag
        v-show="
          (currentFloor !== item.layer || !ids.includes(item.id)) &&
          (!parent || parent === item.fatherId) &&
          show
        "
        :tag="item"
        v-for="(item, index) in props.subordinateSpaces"
        @click="radioClick(index, floor)"
        :key="index"
        :checked="id === item.id"
        :shape="'square'"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 引入组件
import FormTag from '@/components/Form/FormTag/FormTag.vue'

// 引入类型
import type { Path } from '@/types/space'
const props = defineProps<{
  // 从属空间
  subordinateSpaces: Path[]
  //层数
  floor: number
  //被选中ID
  id: number
  //父空间
  parent: number
  //标签内边距
  tagPadding: string
  //层级内边距
  titlePadding: string
  // ids
  ids: number[]
  // 当前楼层
  currentFloor: number
}>()

// 是否显示
const show = ref(true)

const emits = defineEmits<{
  //点击事件回调
  (e: 'radioClick', index: number, floor: number): void
}>()
const radioClick = (index: number, floor: number) => {
  emits('radioClick', index, floor)
}

// 比较数组
function compareArray(a1: number[], a2: number[]) {
  if (a1.length > a2.length) return false
  for (var i = 0, n = a1.length; i < n; i++) {
    if (a1[i] !== a2[i]) return false
  }
  return true
}

// 判断该层是否有子空间
const display = computed(() => {
  let childIds = []
  for (let i = 0; i < props.subordinateSpaces.length; i++) {
    if (props.subordinateSpaces[i].fatherId === props.parent) {
      childIds.push(props.subordinateSpaces[i].id)
    }
  }
  return !compareArray(childIds, props.ids)
})
</script>

<style scoped lang="scss">
.subordinateSpaceItem {
  &__title {
    display: flex;

    &__icon {
      margin-top: 9rpx;
      margin-right: 8rpx;
    }
  }

  &__tag {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
