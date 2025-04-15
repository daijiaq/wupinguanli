<template>
  <view class="tags">
    <u-navbar height="55px" bgColor="#f6f6f6" title="管理标签" :autoBack="true" />
    <view v-show="!showNew">
      <Tag
        @deleteTag="setId(item.id)"
        @changeColor="changeColor(item.id, item.name, item.color)"
        v-for="(item, index) in useTagStore().tagsInfo.tagData"
        :key="index"
        :tag="item"
        @focus="focus"
        @blur="blur"
        :showColor="true"
      >
      </Tag>
    </view>
    <view v-show="!showNew" @click="showNew = true" class="tags-plus">
      <u-icon size="70rpx" color="#fff" name="plus" />
    </view>
    <view v-if="showNew" class="tags__new">
      <view class="tags__new-label"> 名称 </view>
      <view class="tags__new-input">
        <u-input v-model="name" fontSize="35rpx" border="none" placeholder="请输入标签名称" />
      </view>
      <view class="tags__new-label"> 颜色 </view>
      <view class="tags__new-colors">
        <view @click="color = '#000000'" class="tags__new-colors-unit">
          <view class="tags__new-colors-unit-ball" />
          黑色
          <view v-show="color === '#000000'" class="tags__new-colors-unit-tick">
            <u-icon size="25rpx" name="checkmark" color="#fff"></u-icon>
          </view>
        </view>
        <view @click="color = '#ff9813'" class="tags__new-colors-unit">
          <view style="background-color: #ff9813" class="tags__new-colors-unit-ball" />
          橙色
          <view v-show="color === '#ff9813'" class="tags__new-colors-unit-tick">
            <u-icon size="25rpx" name="checkmark" color="#fff"></u-icon>
          </view>
        </view>
        <view @click="color = '#3988ff'" class="tags__new-colors-unit">
          <view style="background-color: #3988ff" class="tags__new-colors-unit-ball" />
          蓝色
          <view v-show="color === '#3988ff'" class="tags__new-colors-unit-tick">
            <u-icon size="25rpx" name="checkmark" color="#fff"></u-icon>
          </view>
        </view>
        <view @click="color = '#ff6464'" class="tags__new-colors-unit">
          <view style="background-color: #ff6464" class="tags__new-colors-unit-ball" />
          红色
          <view v-show="color === '#ff6464'" class="tags__new-colors-unit-tick">
            <u-icon size="25rpx" name="checkmark" color="#fff"></u-icon>
          </view>
        </view>
        <view @click="color = '#8439ff'" class="tags__new-colors-unit">
          <view style="background-color: #8439ff" class="tags__new-colors-unit-ball" />
          紫色
          <view v-show="color === '#8439ff'" class="tags__new-colors-unit-tick">
            <u-icon size="25rpx" name="checkmark" color="#fff"></u-icon>
          </view>
        </view>
        <view @click="color = '#ffe600'" class="tags__new-colors-unit">
          <view style="background-color: #ffe600" class="tags__new-colors-unit-ball" />
          黄色
          <view v-show="color === '#ffe600'" class="tags__new-colors-unit-tick">
            <u-icon size="25rpx" name="checkmark" color="#fff"></u-icon>
          </view>
        </view>
        <view @click="color = '#b3f09d'" class="tags__new-colors-unit">
          <view style="background-color: #b3f09d" class="tags__new-colors-unit-ball" />
          绿色
          <view v-show="color === '#b3f09d'" class="tags__new-colors-unit-tick">
            <u-icon size="25rpx" name="checkmark" color="#fff"></u-icon>
          </view>
        </view>
      </view>
      <view class="tags__new-submit">
        <u-button @click="showNew = false" text="返回"></u-button>
        <u-line color="rgba(255,255,255,0)" direction="col" margin="0 10rpx" />
        <u-button @click="submit" type="primary" text="确认"></u-button>
      </view>
    </view>
    <u-modal
      @cancel="showDelete = false"
      @confirm="confirmDelete()"
      :showCancelButton="true"
      :show="showDelete"
      width="600rpx"
    >
      确认删除?
    </u-modal>
    <u-modal
      @cancel="cancelChangeName"
      @confirm="confirmChangeName"
      :showCancelButton="true"
      :show="showChangeName"
      width="600rpx"
    >
      确认修改标签名?
    </u-modal>
    <u-modal
      @cancel="showChangeColor = false"
      @confirm="confirmChangeColor"
      :showCancelButton="true"
      :show="showChangeColor"
      width="600rpx"
    >
      确认修改颜色?
    </u-modal>
    <u-popup mode="bottom" :show="colorPopup">
      <view>
        <view class="tags__new-colors">
          <view @click="colorClick('#000000')" class="tags__new-colors-unit">
            <view class="tags__new-colors-unit-ball" />
            黑色
          </view>
          <view @click="colorClick('#ff9813')" class="tags__new-colors-unit">
            <view style="background-color: #ff9813" class="tags__new-colors-unit-ball" />
            橙色
          </view>
          <view @click="colorClick('#3988ff')" class="tags__new-colors-unit">
            <view style="background-color: #3988ff" class="tags__new-colors-unit-ball" />
            蓝色
          </view>
          <view @click="colorClick('#ff6464')" class="tags__new-colors-unit">
            <view style="background-color: #ff6464" class="tags__new-colors-unit-ball" />
            红色
          </view>
          <view @click="colorClick('#8439ff')" class="tags__new-colors-unit">
            <view style="background-color: #8439ff" class="tags__new-colors-unit-ball" />
            紫色
          </view>
          <view @click="colorClick('#ffe600')" class="tags__new-colors-unit">
            <view style="background-color: #ffe600" class="tags__new-colors-unit-ball" />
            黄色
          </view>
          <view @click="colorClick('#b3f09d')" class="tags__new-colors-unit">
            <view style="background-color: #b3f09d" class="tags__new-colors-unit-ball" />
            绿色
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 引入store
import { useTagStore } from '@/stores/tag'
import { useFormStore } from '@/stores/form'

const tagStore = useTagStore()
const { getAllTags, createTag, deleteTag, updateTag } = tagStore
const formStore = useFormStore()

// 新建标签颜色
const color = ref('#000000')
// 原标签名
let originalName = ''
// 待提交标签名
let submitName = ''
// 待提交标签颜色
let submitColor = ''
// 待提交标签id
let submitId = 0

//当前是否在修改名字
let isChangingName = false
// 删除弹窗
const showDelete = ref(false)
// 修改颜色弹窗显示
const showChangeColor = ref(false)
// 显示新建
const showNew = ref(false)
// 修改标签名弹窗显示
const showChangeName = ref(false)
// 选择颜色弹出层
const colorPopup = ref(false)

// 记录原颜色和当前id
const changeColor = (id: number, name: string, color: string) => {
  console.log(name, 111)
  if (!isChangingName) {
    submitId = id
    submitColor = color
    submitName = name
    colorPopup.value = true
  }
  console.log(submitName, 111, originalName)
}

// 颜色点击事件
const colorClick = (color: string) => {
  console.log(submitName, 111, originalName)
  submitColor = color
  showChangeColor.value = true
  colorPopup.value = false
}

// 确认修改颜色
const confirmChangeColor = async () => {
  showChangeColor.value = false
  console.log(originalName)

  try {
    await updateTag(submitId, submitName, submitColor)
    await getAllTags()
    uni.showToast({
      title: '修改成功',
      icon: 'none'
    })
    formStore.itemData.labels.map((item) => {
      if (item.id === submitId) {
        item.color = submitColor
      }
    })
    formStore.tempItemData.labels.map((item) => {
      if (item.id === submitId) {
        item.color = submitColor
      }
    })
    formStore.form.labels.map((item) => {
      if (item.id === submitId) {
        item.color = submitColor
      }
    })
  } catch {
    uni.showToast({
      title: '修改失败',
      icon: 'none'
    })
  }
}

// 设置当前id
const setId = (id: number) => {
  submitId = id
  showDelete.value = true
}

// 确认删除标签
const confirmDelete = async () => {
  showDelete.value = false
  try {
    await deleteTag(submitId)
    await getAllTags()
    // 删去表单中对应标签
    formStore.itemData.labels.map((item, index) => {
      if (item.id === submitId) {
        formStore.itemData.labels.splice(index, 1)
      }
    })
    formStore.tempItemData.labels.map((item, index) => {
      if (item.id === submitId) {
        formStore.tempItemData.labels.splice(index, 1)
      }
    })
    formStore.form.labels.map((item, index) => {
      if (item.id === submitId) {
        formStore.form.labels.splice(index, 1)
      }
    })
  } catch {
    uni.showToast({
      title: '删除失败',
      icon: 'none'
    })
  }
}

// 新建标签名
const name = ref('')
// 创建新标签
const submit = async () => {
  try {
    showNew.value = false
    await createTag(name.value, color.value)
    uni.showToast({
      title: '添加成功',
      icon: 'none'
    })
    await getAllTags()
  } catch {
    uni.showToast({
      title: '添加失败',
      icon: 'none'
    })
  }
}

// 聚焦记录标签名
const focus = (name: string): void => {
  isChangingName = true
  // 防止聚焦事件先于脱焦事件触发
  setTimeout(() => {
    originalName = name
  }, 100)
}

// 脱焦事件
const blur = (id: number, name: string, color: string): void => {
  if (originalName !== name) {
    submitName = name
    submitId = id
    submitColor = color
    showChangeName.value = true
  }
  setTimeout(() => {
    isChangingName = false
  }, 100)
}

// 确认修改标签名
const confirmChangeName = async () => {
  showChangeName.value = false
  try {
    await updateTag(submitId, submitName, submitColor)
    await getAllTags()
    uni.showToast({
      title: '修改成功',
      icon: 'none'
    })
    formStore.itemData.labels.map((item) => {
      if (item.id === submitId) {
        item.name = submitName
      }
    })
    formStore.tempItemData.labels.map((item) => {
      if (item.id === submitId) {
        item.name = submitName
      }
    })
    formStore.form.labels.map((item) => {
      if (item.id === submitId) {
        item.name = submitName
      }
    })
  } catch {
    uni.showToast({
      title: '修改失败',
      icon: 'none'
    })
    cancelChangeName()
  }
}

// 取消修改标签名
const cancelChangeName = () => {
  showChangeName.value = false
  getAllTags()
}
</script>

<style lang="scss">
.tags {
  padding-top: 42rpx;
  box-sizing: border-box;
  margin-top: 150rpx;
  height: calc(100vh - 150rpx);
  overflow: auto;
  background-color: #f6f6f6;

  &-plus {
    position: fixed;
    width: 100rpx;
    height: 100rpx;
    background-color: #3988ff;
    border-radius: 50rpx;
    right: 35rpx;
    bottom: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__new {
    &-label {
      margin-top: 20px;
      padding-left: 40rpx;
      color: #656565;
      font-size: 30rpx;
      margin-bottom: 20rpx;
    }

    &-input {
      padding-left: 50rpx;
      background-color: #fff;
      border-radius: 20rpx;
      height: 100rpx;
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
    }

    &-colors {
      padding: 50rpx 0 50rpx 40rpx;
      background-color: #fff;
      border-radius: 20rpx;

      &-unit {
        height: 80rpx;
        display: flex;
        line-height: 80rpx;
        align-items: center;
        font-size: 35rpx;

        &-ball {
          background-color: #353535;
          width: 40rpx;
          height: 40rpx;
          border-radius: 20rpx;
          margin-right: 30rpx;
        }

        &-tick {
          background-color: #3988ff;
          width: 35rpx;
          height: 35rpx;
          border-radius: 17.5rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          left: 500rpx;
          top: 5rpx;
        }
      }
    }

    &-submit {
      position: fixed;
      display: flex;
      bottom: 50rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 400rpx;
    }
  }
}
</style>
