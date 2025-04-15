<template>
  <!-- 多选状态的弹出框 -->
  <view
    v-if="checkboxOperate"
    class="checkbox-opertation animate__animated"
    :class="{ animate__fadeInUp: checkboxOperate, animate__bounceOutDown: !checkboxOperate }"
  >
    <view v-if="isNeedEdit">
      <u-icon size="60rpx" name="edit-pen-fill" color="#3988ff" @click="toEdit"></u-icon>
      <u-text size="30rpx" color="#88898c" align="center" text="编辑" />
    </view>
    <view v-if="isNeedMove">
      <view class="iconfont" style="font-size: 60rpx; color: #3988ff" @click="move">
        &#xe6c4;
      </view>
      <u-text size="30rpx" color="#88898c" align="center" text="移动" />
    </view>
    <view>
      <u-icon size="50rpx" name="trash" color="#898a8d" @click="chooseToDelete"></u-icon>
      <u-text size="30rpx" color="#88898c" align="center" text="删除" />
    </view>
    <view v-if="isDeleted">
      <u-icon size="50rpx" name="reload" color="#898a8d" @click="chooseToRestore"></u-icon>
      <u-text size="30rpx" color="#88898c" align="center" text="恢复" />
    </view>
    <view>
      <u-icon size="50rpx" name="close" color="#898a8d" @click="cancelBtn"></u-icon>
      <u-text size="30rpx" color="#88898c" align="center" text="取消" />
    </view>
  </view>
  <!-- 多选删除确认框 -->
  <u-modal
    :show="showDeleteModal"
    :title="isDeleted ? '删除后将无法恢复！' : '确认删除？'"
    showCancelButton
    width="500rpx"
    @cancel="showDeleteModal = false"
    @confirm="deleteItem"
  ></u-modal>
  <!-- 多选恢复确认框 -->
  <u-modal
    :show="showRestoreModal"
    title="确认恢复？"
    showCancelButton
    width="500rpx"
    @cancel="showRestoreModal = false"
    @confirm="recoveringItem"
  ></u-modal>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/stores/search'
import { useFormStore } from '@/stores/form'
import { storeToRefs } from 'pinia'
import { ref, watch, inject } from 'vue'

const useForm = useFormStore()
const searchStore = useSearchStore()
const { currentSearchList } = storeToRefs(searchStore)

// 是否显示编辑按钮
const isNeedEdit = inject<boolean>('isNeedEdit', true)
// 是否显示移动按钮
const isNeedMove = inject<boolean>('isNeedMove', false)
// 是否是删除页面
const isDeleted = inject<boolean>('isDetele', false)

const props = defineProps<{
  // 是否长按
  isLongpressing: boolean
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'cancel'): void
  (e: 'delete', type: number): void
  (e: 'recover'): void
}>()

const showDeleteModal = ref(false)
const showRestoreModal = ref(false)

// 多选操作
const checkboxOperate = ref(false)
watch(
  () => props.isLongpressing,
  (newVal) => {
    checkboxOperate.value = newVal
  }
)

const toEdit = () => {
  if (currentSearchList.value.itemList.filter((item) => item.isChecked).length) {
    useForm.ids = currentSearchList.value.itemList
      .filter((item) => item.isChecked)
      .map((item) => item.id)

    emits('edit')
    cancelBtn()
  } else {
    uni.showToast({
      title: '未选择物品',
      icon: 'error'
    })
  }
}

const move = () => {
  console.log('移动')
}

// 多选恢复确认
const chooseToRestore = () => {
  if (currentSearchList.value.itemList.filter((item) => item.isChecked).length) {
    showRestoreModal.value = true
  } else {
    uni.showToast({
      title: '未选择物品',
      icon: 'error'
    })
  }
}

// 多选恢复已删除物品
const recoveringItem = () => {
  currentSearchList.value.checkedItemList = currentSearchList.value.itemList
    .filter((item) => item.isChecked)
    .map((item) => item.id)

  uni.showLoading({
    title: '恢复中',
    mask: true
  })

  emits('recover')
  cancelBtn()
}

// 多选删除确认
const chooseToDelete = () => {
  if (currentSearchList.value.itemList.filter((item) => item.isChecked).length) {
    showDeleteModal.value = true
  } else {
    uni.showToast({
      title: '未选择物品',
      icon: 'error'
    })
  }
}

// 多选删除逻辑
const deleteItem = () => {
  currentSearchList.value.checkedItemList = currentSearchList.value.itemList
    .filter((item) => item.isChecked)
    .map((item) => item.id)

  uni.showLoading({
    title: '删除中',
    mask: true
  })

  const type = isDeleted ? 1 : 0

  emits('delete', type)
  cancelBtn()
}

// 取消
const cancelBtn = () => {
  showRestoreModal.value = false
  showDeleteModal.value = false
  checkboxOperate.value = false
  currentSearchList.value.checkedItemList = []
  emits('cancel')
}
</script>

<style lang="scss" scoped>
.checkbox-opertation {
  display: flex;
  justify-content: space-around;
  position: fixed;
  align-items: center;
  bottom: 140rpx;
  left: 42rpx;
  width: 630rpx;
  height: 150rpx;
  padding: 0 20rpx 0 20rpx;
  border-radius: 50rpx;
  background-color: $uni-bg-color-grey;
}
.animate__animated {
  --animate-duration: 500ms;
}
</style>
