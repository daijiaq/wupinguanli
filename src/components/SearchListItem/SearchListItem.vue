<template>
  <view
    class="search-list-item"
    @longpress="showOperate"
    @click="onClick(searchItemData.id, searchItemData.type, searchItemData.privacy)"
    :style="searchItemData.isChecked ? 'background-color: rgb(236, 244, 255);' : ''"
  >
    <view class="search-list-item__content">
      <view class="search-list-item__content__img-wrapper">
        <view class="search-list-item__content__img-wrapper__img">
          <image
            :src="searchItemData.cover"
            lazy-load
            :showError="false"
            style="width: 68px; height: 68px; border-radius: 4px"
          ></image>
        </view>
        <view class="search-list-item__content__img-wrapper__property">
          <view class="search-list-item__content__img-wrapper__property__icon iconfont">
            {{
              !searchItemData.type
                ? '&#xf13c;'
                : searchItemData.type === 1
                ? '&#xec54;'
                : '&#xe634;'
            }}
          </view>
        </view>
      </view>

      <view class="search-list-item__content__info-wrapper">
        <view class="search-list-item__content__info-wrapper__info">
          <view class="search-list-item__content__info-wrapper__info__text">
            {{ searchItemData.name }}
          </view>
          <view class="search-list-item__content__info-wrapper__info__icon iconfont">&#xe605;</view>
          <view
            v-if="searchItemData.privacy"
            class="search-list-item__content__info-wrapper__info__icon iconfont"
          >
            &#xe601;
          </view>
        </view>

        <!-- 多选 -->
        <view v-if="checkingStatus" class="search-list-item__content__info-wrapper__checkbox">
          <u-icon
            v-if="checkingStatus && !searchItemData.isChecked"
            name="checkmark-circle"
            color="#3988ff"
          ></u-icon>
          <u-icon
            v-if="searchItemData.isChecked"
            name="checkmark-circle-fill"
            color="#3988ff"
          ></u-icon>
        </view>

        <view class="search-list-item__content__info-wrapper__detail">
          <!-- 物品路径 -->
          <u-text
            v-if="!isHistory"
            :text="searchItemData.path"
            color="#898A8D"
            custom-style="max-height: 40px"
          ></u-text>
          <!-- 在历史记录页则显示历史修改信息 -->
          <view v-if="isHistory" class="search-list-item__content__info-wrapper__detail__history">
            <u-icon name="clock" size="27rpx" custom-style="padding-top: 7rpx;"></u-icon>
            <u-text
              size="27rpx"
              :text="`&nbsp;&nbsp;${searchItemData.log?.username} &nbsp;${searchItemData.log?.content}`"
              color="#565656"
            ></u-text>
          </view>
          <view v-if="isHistory" class="search-list-item__content__info-wrapper__detail__date">
            {{ searchItemData.log?.date }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, watch, inject } from 'vue'
import type { ItemList, ItemPath, ExtendItemListPath } from '@/types/search'

// 是否为历史搜索页
const isHistory = inject<boolean>('isHistory', false)

const props = defineProps<{
  // 当前物品
  itemData: ItemList
  // 是否处于多选模式
  isChecking: boolean
}>()

const emits = defineEmits<{
  // 长按
  (e: 'longpress'): void
  // 点击
  (e: 'onClick'): void
  // 设置跳转参数
  (e: 'setID', id: number, type: number, privacy: number): void
  // 新增多选
  (e: 'addCheckboxVal', val: number): void
  // 移除多选
  (e: 'romoveCheckboxVal', val: number): void
}>()

// 是否处于多选模式
const checkingStatus = ref(props.isChecking)

// 监听是否处于多选模式
watch(
  () => props.isChecking,
  (val) => {
    checkingStatus.value = val
  }
)

watch(props.itemData, (val) => {
  val.cover
    ? (searchItemData.cover = val.cover)
    : (searchItemData.cover = 'https://www.szlab.xyz/item/image/2025/03/08/ZeeZdZdcdbcdeZtksBsdlomf.png')
  ;({
    id: searchItemData.id,
    name: searchItemData.name,
    type: searchItemData.type,
    privacy: searchItemData.privacy,
    log: searchItemData.log
  } = val)
  // 如果返回了物品路径则格式化
  if (val.path) {
    searchItemData.path = formatPath(val.path)
  }
})

watch(
  () => props.itemData.isChecked,
  (val) => {
    // 由于部分数据在筛选前已经加载过，所以上面的 watch 无法监听到变化，这部分数据需要重新监听多选属性
    searchItemData.isChecked = val
    if (val) {
      emits('addCheckboxVal', props.itemData.id)
    } else {
      emits('romoveCheckboxVal', props.itemData.id)
    }
  }
)

// 格式化 path
const formatPath = (path: ItemPath[]) => {
  const arr: string[] = []
  // 倒序遍历
  for (let i = path.length - 1; i >= 0; i--) {
    arr.push(path[i].name)
  }
  return arr.join('->')
}

// 接收 props 数据的响应式变量
const searchItemData = reactive<ExtendItemListPath>({
  id: props.itemData.id,
  name: props.itemData.name,
  type: props.itemData.type,
  privacy: props.itemData.privacy,
  cover: props.itemData.cover ? props.itemData.cover : 'https://www.szlab.xyz/item/image/2025/03/08/ZeeZdZdcdbcdeZtksBsdlomf.png',
  isChecked: props.itemData.isChecked,
  log: props.itemData.log,
  path: props.itemData.path ? formatPath(props.itemData.path) : ''
})

const showOperate = () => {
  emits('longpress')
}

const onClick = (id: number, type: number, privacy: number) => {
  if (checkingStatus.value) {
    emits('onClick')
  } else {
    emits('setID', id, type, privacy)
  }
}
</script>

<style lang="scss" scoped>
.search-list-item {
  width: 100vw;
  padding: 30rpx 30rpx 0 55rpx;
  height: 168rpx;

  &__content {
    position: relative;
    display: flex;
    width: 86%;
    height: 100%;
    border-bottom: 1px solid #dae1ff;

    &__img-wrapper {
      position: relative;

      &__img {
        margin-right: 38rpx;
        border-radius: 4px;
      }

      &__property {
        position: absolute;
        left: 10rpx;
        top: 8rpx;
        background-color: #fff;
        border-radius: 10rpx;

        &__icon {
          width: 36rpx;
          height: 36rpx;
          color: #4d94ff;
        }
      }
    }

    &__info-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 135rpx;

      &__info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #666;

        &__text {
          max-width: 250rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 26rpx;
          font-size: 32rpx;
          color: $uni-text-color;
        }

        &__icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 42rpx;
          height: 40rpx;
          font-size: 22rpx;
          margin-right: 18rpx;
          border-radius: 4px;
          color: $uni-theme-color;
          background-color: $uni-icon-bg-color;
        }
      }

      &__checkbox {
        position: absolute;
        right: 0;
        top: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20rpx;
        height: 20rpx;
        margin-right: 15rpx;
        color: $uni-theme-color;
      }

      &__detail {
        position: absolute;
        bottom: 0;

        &__history {
          display: flex;
          align-items: flex-start;
          max-width: 420rpx;
          height: 40rpx;
          margin-bottom: 35rpx;
        }

        &__date {
          position: absolute;
          top: 70rpx;
          left: 250rpx;
          width: 300rpx;
          font-size: 22rpx;
          color: #979797;
        }
      }
    }
  }
}
</style>
