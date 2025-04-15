<template>
  <view class="search-screen">
    <view class="search-screen__button" @click="openPopup">
      <view class="iconfont search-screen__button__icon">&#xe609;</view>
      <view class="iconfont search-screen__button__text">筛选</view>
    </view>

    <u-popup
      :show="showPopup"
      mode="bottom"
      :round="10"
      overlayOpacity="0.6"
      @close="closePopupEvent"
    >
      <view class="search-screen__popup">
        <view class="search-screen__popup__head-title">
          <span>筛选</span>
        </view>
        <view class="search-screen__popup__title">
          <view
            @click="selectItem(0)"
            :class="showControl.showProperties ? 'search-screen__popup__title--active' : ''"
          >
            <span>属性</span>
          </view>
          <view
            @click="selectItem(1)"
            :class="showControl.showTags ? 'search-screen__popup__title--active' : ''"
          >
            <span>标签</span>
          </view>
          <view
            @click="selectItem(2)"
            :class="showControl.showPrice ? 'search-screen__popup__title--active' : ''"
          >
            <span>金额</span>
          </view>
          <view
            @click="selectItem(3)"
            :class="showControl.showDate ? 'search-screen__popup__title--active' : ''"
          >
            <span>入库日期</span>
          </view>
        </view>
        <view class="search-screen__popup__properties" v-if="showControl.showProperties">
          <view class="search-screen__popup__properties__list">
            <SortButton
              title="物品"
              width="200"
              marginBottom="18"
              :is-active="isItemSelected"
              @on-click="sortByProperties(0)"
            />
            <SortButton
              title="空间"
              width="200"
              :is-active="isSpaceSelected"
              @on-click="sortByProperties(1)"
            />
          </view>
        </view>

        <view class="search-screen__popup__tags" v-if="showControl.showTags">
          <view class="search-screen__popup__tags__list">
            <view
              class="search-screen__popup__tags__list__item"
              v-for="(item, index) in currentTagList.tagsList"
              :key="index"
            >
              <SortButton
                width="100%"
                :title="item.name"
                :is-active="item.isChecked"
                @on-click="selectTag(index)"
              />
            </view>
          </view>
        </view>

        <view v-show="showControl.showPrice">
          <u-form :rules="rules" :model="priceRange" ref="priceForm">
            <u-form-item prop="lowPrice">
              <u-input
                v-model="priceRange.lowPrice"
                placeholder="自定最低价"
                custom-style="
                  width: 130px;
                  height: 30px;
                "
              ></u-input>
            </u-form-item>
            <u-form-item>
              <u-line color="#cecece" length="16px" margin="18px 10px"></u-line>
            </u-form-item>
            <u-form-item prop="highPrice">
              <u-input
                v-model="priceRange.highPrice"
                placeholder="自定最高价"
                custom-style="
                  width: 130px;
                  height: 30px;
                "
              ></u-input>
            </u-form-item>
          </u-form>
        </view>

        <view class="search-screen__popup__date" v-if="showControl.showDate">
          <view>
            <SortButton
              title="按最近入库日期显示"
              width="230"
              marginBottom="18"
              :is-active="sortInReverseTime"
              @on-click="selectDate(0)"
            />
            <SortButton
              title="按最远入库日期显示"
              width="230"
              :is-active="sortInTime"
              @on-click="selectDate(1)"
            />
          </view>
        </view>

        <view class="search-screen__popup__submit">
          <view class="search-screen__popup__submit__content">
            <u-button
              text="取消"
              custom-style="
                width: '140px',
                height: '40px',
                border: none;
                border-radius: 30px 0 0 30px;
                background-color: #d9d9d9;
                color: #fff;
              "
              @click="cancelScreen"
            ></u-button>
            <u-button
              text="确认"
              custom-style="
								width: '140px',
								height: '40px',
								border: none;
								border-radius: 0 30px 30px 0;
								background-color: #3988ff;
								color: #fff;
							"
              :loading="isSubmitting"
              loadingText=" 提交中"
              @click="submitScreen"
            ></u-button>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  options: { styleIsolation: 'shared' }
})
</script>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import { useSearchStore } from '@/stores/search'
import { onLoad } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import type { ShowControl } from '@/types/search'

const searchStore = useSearchStore()
const { currentTagList, currentScreenData } = storeToRefs(searchStore)
const { fetchScreenSearchList, fetchTagList } = searchStore
const showPopup = ref(false)
const priceForm = ref()
const isSubmitting = ref(false)

// 是否为最近删除页
const isDeleted = inject<boolean>('isDetele', false)

const emits = defineEmits<{
  (e: 'screenEmpty'): void
}>()

// 筛选标题是否选择
const showControl = reactive<ShowControl>({
  showProperties: true,
  showPrice: false,
  showTags: false,
  showDate: false
})

const resetShowControl = () => {
  showControl.showProperties = false
  showControl.showPrice = false
  showControl.showTags = false
  showControl.showDate = false
}

const selectItem = (index: number) => {
  switch (index) {
    case 0:
      resetShowControl()
      showControl.showProperties = !showControl.showProperties
      break
    case 1:
      resetShowControl()
      showControl.showTags = !showControl.showTags
      break
    case 2:
      resetShowControl()
      showControl.showPrice = !showControl.showPrice
      break
    case 3:
      resetShowControl()
      showControl.showDate = !showControl.showDate
      break
    default:
      resetShowControl()
  }
}

// 筛选属性
const isItemSelected = ref(false)
const isSpaceSelected = ref(false)
const sortByProperties = (index: number) => {
  if (index) {
    isSpaceSelected.value = !isSpaceSelected.value
    isItemSelected.value = false
  } else {
    isItemSelected.value = !isItemSelected.value
    isSpaceSelected.value = false
  }
}

// 筛选标签
const selectTag = (index: number) => {
  currentTagList.value.tagsList[index].isChecked = !currentTagList.value.tagsList[index].isChecked
}

// 筛选金额
const priceRange = reactive({
  lowPrice: '',
  highPrice: ''
})

const rules = {
  lowPrice: [
    {
      pattern: /^[0-9]*$/g,
      message: '请输入数字',
      trigger: ['change', 'blur']
    }
  ],
  highPrice: [
    {
      pattern: /^[0-9]*$/g,
      message: '请输入数字',
      trigger: ['change', 'blur']
    }
  ]
}

// 筛选入库日期
const sortInTime = ref(false)
const sortInReverseTime = ref(false)
const selectDate = (index: number) => {
  if (index) {
    sortInTime.value = !sortInTime.value
    sortInReverseTime.value = false
  } else {
    sortInReverseTime.value = !sortInReverseTime.value
    sortInTime.value = false
  }
}

const closePopupEvent = () => {
  showPopup.value = false
}

const openPopup = () => {
  showPopup.value = !showPopup.value
  fetchTagList()
}

const cancelScreen = () => {
  isSubmitting.value = false
  closePopupEvent()
  resetAllScreen()
}

const submitScreen = () => {
  priceForm.value
    .validate()
    .then(async () => {
      try {
        isSubmitting.value = true
        updateScreenData()
        // 判断当前是否为最近删除页，1 表示在已删除的数据中筛选，0 表示在未删除的数据中筛选
        isDeleted ? await fetchScreenSearchList(1) : await fetchScreenSearchList(0)
        isSubmitting.value = false
        uni.showToast({
          title: '筛选成功',
          icon: 'success'
        })
        resetAllScreen()
        emits('screenEmpty')
        closePopupEvent()
      } catch {}
    })
    .catch(() => {
      uni.showToast({
        title: '请输入正确的金额',
        icon: 'none'
      })
    })
}

// 重置筛选选项
const resetAllScreen = () => {
  isItemSelected.value = false
  isSpaceSelected.value = false
  priceRange.lowPrice = ''
  priceRange.highPrice = ''
  sortInTime.value = false
  sortInReverseTime.value = false
  currentTagList.value.tagsList.forEach((item) => {
    item.isChecked = false
  })
  resetShowControl()
  showControl.showProperties = true
}

// 更新筛选数据
const updateScreenData = () => {
  // 页数重置默认
  currentScreenData.value.offset = 0

  // 筛选属性
  if (isSpaceSelected.value) {
    // 选择空间
    currentScreenData.value.screenData.type = 1
  } else if (isItemSelected.value) {
    // 选择物品
    currentScreenData.value.screenData.type = 2
  } else {
    // 恢复默认
    currentScreenData.value.screenData.type = -1
  }

  // 筛选标签
  currentScreenData.value.screenData.labelId = currentTagList.value.tagsList
    .filter((item) => item.isChecked)
    .map((item) => item.id)

  // 筛选金额
  if (priceRange.lowPrice !== '') {
    // 选择金额
    currentScreenData.value.screenData.lowPrice = Number(priceRange.lowPrice)
  }
  if (priceRange.highPrice !== '') {
    currentScreenData.value.screenData.highPrice = Number(priceRange.highPrice)
  }
  if (priceRange.lowPrice === '' && priceRange.highPrice === '') {
    // 恢复默认
    currentScreenData.value.screenData.lowPrice = -1
  }

  // 筛选时间
  if (sortInTime.value) {
    // 按时间排序
    currentScreenData.value.screenData.dateType = 0
  } else if (sortInReverseTime.value) {
    // 按时间倒序排序
    currentScreenData.value.screenData.dateType = 1
  } else {
    // 恢复默认
    currentScreenData.value.screenData.dateType = -1
  }
}

onLoad(() => {
  resetAllScreen()
  updateScreenData()
})
</script>

<style lang="scss" scoped>
.search-screen {
  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140rpx;
    height: 80rpx;
    border-radius: 10px;
    margin: 6rpx 0 30rpx 0;
    background-color: #f8f9fd;

    &__icon {
      font-weight: bold;
      font-size: 44rpx;
      color: $uni-theme-color;
    }

    &__text {
      color: #898a8d;
      font-size: 28rpx;
    }
  }

  &__popup {
    padding: 20px;

    &__head-title {
      display: flex;
      justify-content: center;
      font-size: 22px;
      font-weight: bold;
    }

    &__title {
      display: flex;
      justify-content: space-between;
      padding: 30px 18px 18px 18px;

      &--active {
        transform: scale(1.2);
        font-weight: bold;
      }
    }

    &__properties {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 140px;

      &__list {
        gap: 1px;
      }
    }

    &__tags {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 14px;
      height: 140px;

      &__list {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        max-height: 320rpx;
        gap: 10px;
        overflow-y: auto;

        &__item {
          width: 30%;
        }
      }
    }

    &__date {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 140px;
    }

    &__submit {
      display: flex;
      justify-content: center;
      margin: 18px 0 16px 0;

      &__content {
        display: flex;
        width: 280px;
      }
    }
  }
}

:deep(.u-form) {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
}

:deep(.u-form-item) {
  height: 80px;
}
</style>
