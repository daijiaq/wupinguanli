<template>
  <view class="formPhoto">
    <!-- 没有图片时显示居中的上传区域 -->
    <view v-if="!tempPhoto[0]" class="formPhoto__empty">
      <u-upload
        @afterRead="photoAfterRead"
        accept="image"
        multiple
        :width="size"
        :height="size"
        :disabled="disabled"
        :deletable="false"
        maxSize="1572864"
        @oversize="oversize"
      />
    </view>

    <!-- 有图片时显示轮播图 -->
    <view v-else class="formPhoto__content">
      <view class="formPhoto__swiper">
        <u-swiper
          :list="tempPhoto"
          :height="size"
          :autoplay="tempPhoto.length > 1"
          :indicator="tempPhoto.length > 1"
          indicatorMode="line"
          :current="index"
          @change="swiperChange"
        />
        <view v-if="!disabled" class="formPhoto__swiper-icon">
          <u-icon @click="deleteCurrentPhoto" size="30rpx" name="close"></u-icon>
        </view>
        <!-- 右下角圆形添加按钮 -->
        <view v-if="!disabled" class="formPhoto__add-btn">
          <u-upload
            @afterRead="photoAfterRead"
            accept="image"
            multiple
            :disabled="disabled"
            :deletable="false"
            maxSize="1572864"
            @oversize="oversize"
            width="50rpx"
            height="50rpx"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Image } from '@/types/form'
const props = defineProps<{
  // 大小
  size: string
  // 是否禁用
  disabled?: boolean
  // 图片列表
  photoList: Image[]
}>()
//图片列表内容
const tempPhoto = ref(props.photoList)
const emits = defineEmits<{
  //更新图片列表
  (e: 'update:photoList', photoList: Image[]): void
}>()
const index = ref(0)
watch(
  () => tempPhoto.value,
  () => {
    emits('update:photoList', tempPhoto.value)
  }
)

watch(
  () => props.photoList,
  (val) => {
    tempPhoto.value = val
  }
)

//新增图片的回调
const photoAfterRead = (event: any): void => {
  for (let index = 0; index < event.file.length; index++) {
    tempPhoto.value.push({
      url: event.file[index].url
    })
  }
  console.log(props.photoList)
}
//删除图片的回调
const deletePhoto = (index: number): void => {
  if (!props.disabled) tempPhoto.value.splice(index, 1)
}

// 删除当前显示的图片
const deleteCurrentPhoto = (): void => {
  if (!props.disabled && tempPhoto.value.length > 0) {
    tempPhoto.value.splice(index.value, 1)
    // 如果删除后当前索引超出范围，重置为0
    if (index.value >= tempPhoto.value.length) {
      index.value = 0
    }
  }
}

// swiper 变化回调
const swiperChange = (e: any): void => {
  index.value = e.current
}

// 图片超过大小
const oversize = () => {
  uni.showToast({
    title: '图片大小不能超过1.5M',
    icon: 'none'
  })
}
</script>

<style scoped lang="css">
/* .formPhoto {
  width: 100%;

  // 没有图片时的居中显示
  &__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 30rpx;
  }

  // 有图片时的内容区域
  &__content {
    position: relative;
    margin-top: 30rpx;
    width: 100%;
  }

  &__swiper {
    width: 100%;
    position: relative;
    &-icon {
      position: absolute;
      right: 10rpx;
      top: 10rpx;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      width: 50rpx;
      height: 50rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }
  }

  // 右下角圆形添加按钮
  &__add-btn {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;

    :deep(.u-upload) {
      border-radius: 50%;
      overflow: hidden;
      display: none;
    }

    :deep(.u-upload__wrap) {
      display: none;
    }

    :deep(.u-upload__button) {
      border-radius: 50%;
      background-color: transparent;
      border: none;
      display: none;
    }
  }
} */

.formPhoto {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
}
.formPhoto__content {
  width: 100%;
}

.formPhoto__swiper {
  width: 100%;
  position: relative;
}
.formPhoto__swiper-icon {
  position: absolute;
  right: 10rpx;
  top: 10rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 50rpx;
  height: 50rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.formPhoto__add-btn {
  position: absolute;
  right: 15rpx;
  bottom: 15rpx;
  width: 50rpx;
  height: 50rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.formPhoto__add-btn /deep/ .u-upload {
  border-radius: 50%;
  overflow: hidden;
  width: 50rpx !important;
  height: 50rpx !important;
}

.formPhoto__add-btn /deep/ .u-upload__button {
  border-radius: 50%;
  background-color: transparent;
  border: none;
  width: 50rpx !important;
  height: 50rpx !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
</style>
