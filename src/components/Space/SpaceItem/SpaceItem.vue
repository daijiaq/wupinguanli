<template>
  <view
    @click.stop="toSpace(item.id, item.type, item.name, item.privacy)"
    @longpress="showOperate"
    :style="bgColor"
    class="spaceItem"
  >
    <image
      class="spaceItem-img"
      :src="
        item.cover
          ? item.cover
          : item.type === 0
          ? 'https://www.szlab.xyz/item/image/2025/03/08/ZecZbZbeeZcccdeZtksKnnlomf.png'
          : 'https://www.szlab.xyz/item/image/2025/03/08/ZeeZdZdcdbcdeZtksBsdlomf.png'
      "
      lazy-load
    />
    <view class="spaceItem-type">
      <view class="spaceItem-type__icon iconfont">
        {{ !item.type ? '&#xf13c;' : item.type === 1 ? '&#xec54;' : '&#xe634;' }}
      </view>
    </view>
    <view v-if="item.privacy" class="spaceItem-lock">
      <u-icon size="40rpx" color="#4d94ff" name="lock"></u-icon>
    </view>
    <view class="spaceItem__information">
      <view class="spaceItem__information-name">
        {{ item.name }}
      </view>
      <!-- <view class="spaceItem__information-administrator">
        <u-icon size="40rpx" color="#4c92fb" name="account"></u-icon>
      </view> -->
      <!-- <view class="spaceItem__information-avatar">
        <u-avatar-group size="40rpx" :urls="item.administrator"></u-avatar-group>
      </view> -->
      <view
        @click.stop="tryJumpPageDetail(item.id, item.type, item.privacy)"
        class="spaceItem__information-list"
      >
        <u-icon color="#5096fe" size="40rpx" name="list"></u-icon>
      </view>
      <view class="spaceItem__information-time">
        <u-icon size="25rpx" :name="item.type ? 'clock' : 'map'"></u-icon>
        <u-text
          margin="0 0 0 10rpx"
          size="25rpx"
          color="#979797"
          :text="item.type ? item.date : item.address"
          lines="1"
        />
      </view>
    </view>
    <view class="spaceItem__content">
      <u-avatar
        v-for="(item2, index2) in item.itemCover"
        :key="index2"
        :src="item2"
        default-url="https://www.szlab.xyz/item/image/2025/03/08/ZeeZdZdcdbcdeZtksBsdlomf.png"
        customStyle="margin-right:20rpx"
        size="50rpx"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/form'
import { useSpaceStore } from '@/stores/space'
import type { BriefData } from '@/types/space'
import { storeToRefs } from 'pinia'

//表单数据
const formStore = useFormStore()
const spaceStore = useSpaceStore()
const { spaces } = spaceStore
const { spacesInfo } = storeToRefs(spaceStore)

const props = defineProps<{
  //表单数据类型
  item: BriefData
  //是否显示操作菜单
  show?: boolean
  //背景颜色
  bgColor?: string
}>()

const emits = defineEmits<{
  //点击事件
  (e: 'click'): void
  //长按事件
  (e: 'longpress'): void
  //设置ID
  (e: 'tryJumpPageDetail', id: number, type: number, privacy: number): Promise<void>
}>()

//进入下一层
const toSpace = (id: number, type: number, name: string, privacy: number): void => {
  if (!props.show && (type === 0 || type === 1)) {
    spacesInfo.value.current = 0
    spacesInfo.value.total = 0
    spacesInfo.value.spaceData = []
    //修改当前表单数据
    formStore.currentId = id
    formStore.currentName = name
    spaces[formStore.currentFloor - 1] = {
      fatherId: formStore.currentFloor === 1 ? 0 : spaces[formStore.currentFloor - 2].id,
      id: id,
      name: name,
      layer: formStore.currentFloor
    }
    //跳转
    uni.navigateTo({
      url: `/pages/home/spaces/spaces`
    })
  } else if (!props.show) {
    emits('tryJumpPageDetail', id, type, privacy)
  }
  //触发点击事件
  emits('click')
}

async function tryJumpPageDetail(id: number, type: number, privacy: number): Promise<void> {
  emits('tryJumpPageDetail', id, type, privacy)
}

//长按回调
const showOperate = () => {
  emits('longpress')
}
</script>

<style scoped lang="scss">
.spaceItem {
  box-shadow: 0 5px 5px #e3ebfe;
  box-sizing: border-box;
  position: relative;
  width: 650rpx;
  margin: 0 auto;
  margin-top: 30rpx;
  border: #eeeef0 solid 2px;
  border-radius: 30rpx;
  height: 200rpx;
  padding: 25rpx;
  background-color: #fff;

  &-img {
    width: 150rpx;
    height: 150rpx;
    border-radius: 20rpx;
  }

  &-type {
    position: absolute;
    left: 35rpx;
    top: 35rpx;
    background-color: #fff;
    border-radius: 10rpx;
    &__icon {
      margin-top: 5rpx;
      width: 36rpx;
      height: 36rpx;
      color: #4d94ff;
    }
  }

  &-lock {
    position: absolute;
    left: 80rpx;
    top: 35rpx;
    background-color: #fff;
    border-radius: 10rpx;
  }

  &__information {
    position: absolute;
    right: 25rpx;
    top: 25rpx;
    width: 430rpx;
    height: 40rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &-name {
      line-height: 40rpx;
      white-space: nowrap;
      overflow: hidden;
      width: 200rpx;
      text-overflow: ellipsis;
      font-weight: 1000;
      display: inline-block;
      margin-right: 10rpx;
    }

    // &-administrator {
    //   display: inline-block;
    //   background-color: #d8d7db;
    //   border-radius: 10rpx;
    //   margin-right: 10rpx;
    // }

    // &-avatar {
    //   display: inline-block;
    // }

    &-list {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10rpx;
      width: 50rpx;
      height: 50rpx;
      background-color: #f2f2f2;
      position: absolute;
      right: 30rpx;
      top: -5rpx;
    }

    &-time {
      position: absolute;
      left: 10rpx;
      top: 50rpx;
      display: flex;
      align-items: center;
    }
  }

  &__content {
    width: 400rpx;
    overflow: hidden;
    display: inline-flex;
    margin-left: 20rpx;
    justify-content: flex-start;
  }
}
</style>
