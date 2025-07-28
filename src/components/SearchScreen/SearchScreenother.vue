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
          <span>筛选物品变更信息</span>
        </view>
        <view class="search-screen__popup__title">
          <view
            @click="selectItem(0)"
            :class="
              showControl.showLocation
                ? 'search-screen__popup__title--active'
                : 'search-screen__popup__title--inactive'
            "
          >
            <span>位置</span>
          </view>
          <view
            @click="selectItem(1)"
            :class="
              showControl.showPrivacy
                ? 'search-screen__popup__title--active'
                : 'search-screen__popup__title--inactive'
            "
          >
            <span>隐私物品</span>
          </view>
          <view
            @click="selectItem(2)"
            :class="
              showControl.showTag
                ? 'search-screen__popup__title--active'
                : 'search-screen__popup__title--inactive'
            "
          >
            <span>标签</span>
          </view>
        </view>
        <view class="search-screen__popup__title">
          <view
            @click="selectItem(3)"
            :class="
              showControl.showDate
                ? 'search-screen__popup__title--active'
                : 'search-screen__popup__title--inactive'
            "
          >
            <span>日期</span>
          </view>
          <view
            @click="selectItem(4)"
            :class="
              showControl.showManager
                ? 'search-screen__popup__title--active'
                : 'search-screen__popup__title--inactive'
            "
          >
            <span>管理人</span>
          </view>
          <view
            @click="selectItem(5)"
            :class="
              showControl.showRelatedItems
                ? 'search-screen__popup__title--active'
                : 'search-screen__popup__title--inactive'
            "
          >
            <span>关联物品</span>
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
              @click="handleConfirm"
            ></u-button>
          </view>
        </view>
        <!-- 日期的二级弹窗 -->
        <u-popup
          :show="showDatePopup"
          mode="bottom"
          :round="10"
          overlayOpacity="0.6"
          @close="closeDatePopup"
        >
          <view class="secondary-popup">
            <!-- 日期 -->
            <view class="popup-header"> 选择日期 </view>
            <u-picker
              :defaultIndex="defaultDate"
              @confirm="handleDateConfirm"
              @change="changeDate"
              :immediateChange="true"
              @cancel="closeDatePopup"
              :show="true"
              :columns="dateList"
            />

            <view class="search-screen__popup__submit">
              <view class="search-screen__popup__submit__content">
                <!-- <u-button
                  text="取消"
                  custom-style="
                width: '140px',
                height: '40px',
                border: none;
                border-radius: 30px 0 0 30px;
                background-color: #d9d9d9;
                color: #fff;
                  "
                  @click="closeDatePopup"
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
                  @click="handleDateConfirm"
                ></u-button> -->
              </view>
            </view>
          </view>
        </u-popup>
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
import { ref, reactive, inject, Ref } from 'vue'
import { useSearchStore } from '@/stores/search'
// import { useHistoryStore } from '@/stores/history'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import type { ShowControl, ItemLogSearchDTO } from '@/types/history'
import { filterHistory } from '@/network/apis/history'

const isFiltering = inject<Ref<number>>('isFiltering')
if (!isFiltering) {
  throw new Error('isFiltering is not provided')
}
const searchStore = useSearchStore()
// const historyStore = useHistoryStore()
const { currentSearchList } = storeToRefs(searchStore)
// 筛选参数
const filterParams = reactive<ItemLogSearchDTO>({
  name: null,
  types: [],
  startDate: null
  // endDate: null
})

//弹窗控制
//一级弹窗
const showPopup = ref(false)
const showDatePopup = ref(false) // 仅日期弹窗
const selectedDate = ref(new Date().getTime()) // 选择的日期
const isSubmitting = ref(false)

// 是否为最近删除页
// const isDeleted = inject<boolean>('isDetele', false)

const selectItem = (index: number) => {
  const type = index + 1
  switch (index) {
    case 0:
      // resetShowControl()
      showControl.showLocation = !showControl.showLocation
      break
    case 1:
      // resetShowControl()
      showControl.showPrivacy = !showControl.showPrivacy
      break
    case 2:
      // resetShowControl()
      showControl.showTag = !showControl.showTag
      break
    case 3:
      // resetShowControl()
      if (showControl.showDate) {
        showControl.showDate = !showControl.showDate
        filterParams.startDate = null
      } else {
        showControl.showDate = true
        openDatePopup()
      }
      break
    case 4:
      // resetShowControl()
      showControl.showManager = !showControl.showManager
      break
    case 5:
      // resetShowControl()
      showControl.showRelatedItems = !showControl.showRelatedItems
      break
    default:
      resetShowControl()
  }
  // 更新types数组
  updateFilterTypes()
}

// 更新筛选类型数组
const updateFilterTypes = () => {
  filterParams.types = []
  if (showControl.showLocation) filterParams.types.push(1)
  if (showControl.showPrivacy) filterParams.types.push(2)
  if (showControl.showTag) filterParams.types.push(3)
  if (showControl.showDate) filterParams.types.push(4)
  if (showControl.showManager) filterParams.types.push(5)
  if (showControl.showRelatedItems) filterParams.types.push(6)
  console.log('当前筛选条件:', filterParams.types)
}

// 筛选标题是否选择
const showControl = reactive<ShowControl>({
  showLocation: false,
  showPrivacy: false,
  showTag: false,
  showDate: false,
  showManager: false,
  showRelatedItems: false
})

//重置选中的标题
const resetShowControl = () => {
  showControl.showLocation = false
  showControl.showPrivacy = false
  showControl.showTag = false
  showControl.showDate = false
  showControl.showManager = false
  showControl.showRelatedItems = false
}

// 获取当前激活的标题索引
const getActiveIndex = (): number => {
  if (showControl.showLocation) return 0
  if (showControl.showPrivacy) return 1
  if (showControl.showTag) return 2
  if (showControl.showDate) return 3
  if (showControl.showManager) return 4
  if (showControl.showRelatedItems) return 5
  return -1 // 没有选中任何项
}

//关闭一级弹窗
const closePopupEvent = () => {
  showPopup.value = false
}

//打开一级弹窗
const openPopup = () => {
  showPopup.value = !showPopup.value
}

const handleConfirm = () => {
  console.log(111)
  submitScreen()
}

const closeDatePopup = () => {
  showDatePopup.value = false
}

//日期选择相关逻辑
//日期选择数组
const dateList = ref([
  [
    new Date().getFullYear() - 9,
    new Date().getFullYear() - 8,
    new Date().getFullYear() - 7,
    new Date().getFullYear() - 6,
    new Date().getFullYear() - 5,
    new Date().getFullYear() - 4,
    new Date().getFullYear() - 3,
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 1,
    new Date().getFullYear()
  ],
  [],
  []
])

// 修改日期时的回调（处理闰年、月份天数等）
const changeDate = (e: any) => {
  const tempDate = new Date()
  if (e.value[0] === tempDate.getFullYear()) {
    dateList.value[1] = []
    for (let i = 1; i <= tempDate.getMonth() + 1; i++) {
      dateList.value[1].push(i)
    }
  } else {
    dateList.value[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }

  // 处理不同月份的天数
  if (e.value[0] % 4 === 0 && e.value[0] % 100 !== 0 && e.value[1] === 2) {
    dateList.value[2] = Array.from({ length: 29 }, (_, i) => i + 1)
  } else if (e.value[0] % 4 !== 0 && e.value[1] === 2) {
    dateList.value[2] = Array.from({ length: 28 }, (_, i) => i + 1)
  } else if (e.value[1] === 4 || e.value[1] === 6 || e.value[1] === 9 || e.value[1] === 11) {
    dateList.value[2] = Array.from({ length: 30 }, (_, i) => i + 1)
  } else if (e.value[0] === tempDate.getFullYear() && e.value[1] === tempDate.getMonth() + 1) {
    dateList.value[2] = Array.from({ length: tempDate.getDate() }, (_, i) => i + 1)
  } else {
    dateList.value[2] = Array.from({ length: 31 }, (_, i) => i + 1)
  }
}

// 确认选择日期
// const setDate = (e: any): void => {
//   selectedDate.value = new Date(e.value[0], e.value[1] - 1, e.value[2]).getTime()
// }

//确认日期
const handleDateConfirm = (e?: any) => {
  console.log('确认日期')
  let selectedDateValue: Date

  if (e && e.value) {
    // 从picker确认事件获取日期
    selectedDateValue = new Date(e.value[0], e.value[1] - 1, e.value[2])
  } else {
    // 从确认按钮获取当前选择的日期
    const selectedValues = [
      dateList.value[0][defaultDate.value[0]],
      dateList.value[1][defaultDate.value[1]],
      dateList.value[2][defaultDate.value[2]]
    ]
    selectedDateValue = new Date(selectedValues[0], selectedValues[1] - 1, selectedValues[2])
  }

  // 格式化日期为 YYYY-MM-DD
  const formattedDate = formatDate(selectedDateValue)

  // 更新筛选参数
  filterParams.startDate = formattedDate
  // filterParams.endDate = formattedDate

  // 关闭日期弹窗
  showDatePopup.value = false

  // 可以在这里直接提交筛选，或者只是关闭弹窗让用户在一级弹窗确认
  // submitScreen();
}

// 日期格式化函数
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 初始化月份和日期
for (let i = 1; i <= new Date().getMonth() + 1; i++) {
  dateList.value[1].push(i)
}
for (let i = 1; i <= new Date().getDate(); i++) {
  dateList.value[2].push(i)
}

const defaultDate = ref([9, new Date().getMonth(), new Date().getDate() - 1])

// 打开日期弹窗
const openDatePopup = () => {
  // 设置默认日期为今天
  selectedDate.value = new Date().getTime()
  showDatePopup.value = true
}

//更改日期格式
// function currentTime(timestamp: number): string {
//   var now = new Date(timestamp)
//   var zeroFill = function (value: number) {
//     if (value < 10) {
//       return '0' + String(value)
//     }
//     return value
//   }

//   var year = now.getFullYear()
//   //年
//   var month = zeroFill(now.getMonth() + 1)
//   //月
//   var day = zeroFill(now.getDate())

//   return `${year}-${month}-${day}`
// }

const cancelScreen = () => {
  isSubmitting.value = false
  isFiltering.value = 0
  //重置筛选参数
  filterParams.types = []
  filterParams.startDate = null
  closePopupEvent()
  resetAllScreen()
}
const emits = defineEmits(['filterParams'])
const submitScreen = async () => {
  console.log('currentSearchList.value', currentSearchList.value)
  try {
    isSubmitting.value = true
    isFiltering.value = 1
    currentSearchList.value.itemList = []
    // 重置分页参数
    currentSearchList.value.offset = 0
    currentSearchList.value.total = 0
    searchStore.currentScreenData.offset = 0
    console.log('currentSearchList.value.itemList', currentSearchList.value)
    isSubmitting.value = true
    //根据选择的筛选类型设置types参数
    // const activIndex = getActiveIndex()
    // if (activIndex >= 0 && activIndex <= 5) {
    //   filterParams.types = [activIndex + 1]
    // } else {
    //   filterParams.types = [0]
    // }
    // console.log('筛选参数:', filterParams)

    //调用筛选接口
    const res = await filterHistory(
      {
        offset: 1,
        limit: 10
      },
      filterParams
    )
    emits('filterParams', filterParams)
    // 更新列表数据
    console.log('处理后的数据:', res)
    const response = JSON.parse(JSON.stringify(res))
    // currentSearchList.value.itemList = response.records
    console.log(currentSearchList.value.itemList)
    console.log('筛选结果:', response)
    console.log('currentSearchList.value.itemList', currentSearchList.value.itemList)
    // currentSearchList.value.itemList = []
    // currentSearchList.value.itemList.splice(0, currentSearchList.value.itemList.length)
    console.log('清空后:', [...currentSearchList.value.itemList])
    currentSearchList.value.itemList = response.records.map((item: any) => ({
      cover: item.itemCover,
      id: item.itemId,
      name: item.itemName,
      privacy: item.privacy,
      log: {
        content: item.content,
        username: item.modifierName,
        date: item.modifyTime,
        ip: null,
        id: null
      },
      //强制保留字段
      isChecked: false,
      type: 2
    }))
    // currentSearchList.value.itemList.push(...currentSearchList.value.itemList)
    console.log('添加后:', [...currentSearchList.value.itemList])
    console.log('筛选结果:', currentSearchList.value.itemList)
    currentSearchList.value.total = response.total
    currentSearchList.value.offset = response.current
    console.log('currentSearchList.value.total', currentSearchList.value.total)
    console.log('currentSearchList.value.offset', currentSearchList.value.offset)
    console.log(isFiltering.value)
    // console.log('SearchListItem.value.itemList', SearchListItem.value.itemList)
    // console.log('currentSearchList.value.total', currentSearchList.value.total)

    // 如果没有数据
    // if (response.records.length === 0) {
    //   emits('screenEmpty')
    // }
    uni.showToast({
      title: '筛选成功',
      icon: 'success'
    })
    closePopupEvent()
  } catch (error) {
    console.error('筛选历史记录失败:', error)
    uni.showToast({
      title: '筛选失败',
      icon: 'none'
    })
  } finally {
    isSubmitting.value = false
    console.log('isFiltering.value', isFiltering.value)
  }
}

// 重置筛选选项
const resetAllScreen = () => {
  showControl.showLocation = false
  showControl.showPrivacy = false
  showControl.showTag = false
  showControl.showDate = false
  showControl.showManager = false
  showControl.showRelatedItems = false
}

// 更新筛选数据
// const updateScreenData = () => {
//   // 页数重置默认
//   currentScreenData.value.offset = 0
// }

//筛选历史记录
// const filterHistory = async (params: PagingParams, filterParams: ItemLogSearchDTO) => {
//   try {
//     const response = await service<HistoryLogResponse>({
//       url: `/items/search/itemLog?offset=${params.offset}&limit=${params.limit}`,
//       method: 'POST',
//       data: {
//         name: filterParams.name || null,
//         types: filterParams.types || null,
//         startDate: filterParams.startDate || null,
//         endDate: filterParams.endDate || null
//       }
//     })

//     //更新列表数据
//     currentSearchList.value.itemList = response.data.records
//     currentSearchList.value.total = response.data.total
//     currentSearchList.value.offset = response.data.current

//     //如果没有数据
//     if (response.data.records.length === 0) {
//       emits('screenEmpty')
//     }
//   } catch (error) {
//     console.error('筛选历史记录失败:', error)
//     uni.showToast({
//       title: '筛选失败',
//       icon: 'none'
//     })
//   }
// }

onShow(() => {
  resetAllScreen()
  console.log(111)
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
        position: relative;
        padding: 8px 16px;
        border-radius: 16px;
        cursor: pointer;
        color: #4a92ff;
        background-color: #c4dbff;
      }

      &--inactive {
        position: relative;
        padding: 8px 16px;
        border-radius: 16px;
        cursor: pointer;
        background-color: #f6f5f5;
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

.Secondpopup-header {
  font-size: 22px;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 40px;
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
