<template>
  <view class="history">
    <u-navbar
      bgColor="transparent"
      placeholder
      title="互动记录"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>
    <view class="history__search-input">
      <view class="history__search-input__content">
        <u-search
          placeholder="搜索互动记录"
          placeholderColor="#979797"
          searchIconColor="#565b6d"
          searchIconSize="52rpx"
          v-model="inputBox"
          :showAction="false"
          shape="square"
          height="80rpx"
          bgColor="#F8F9FD"
        ></u-search>
        <view class="history__search-input__content__confirm" @click="submitSearch">
          <span>搜索</span>
        </view>
      </view>
      <!-- <view class="history__search-input__sift">
        <u-text
          @click="showSift = true"
          color="#bcbcbd"
          prefixIcon="pushpin"
          lines="1"
          size="28rpx"
          text="&nbsp;筛选"
          iconStyle="font-size:28rpx; color: #3988ff"
        />
      </view> -->
    </view>
    <view class="history__part">
      <u-row v-for="(item, index) in history" :key="index" customStyle="padding-bottom: 20rpx;">
        <u-col span="9">
          <view class="history__part__item">
            <text>{{ item.content }}</text>
          </view>
        </u-col>
        <u-col span="3">
          <u-text align="center" size="23rpx" color="#808080" :text="item.logTime"></u-text>
        </u-col>
      </u-row>
    </view>
    <u-popup :safeAreaInsetBottom="false" round="20rpx" mode="bottom" :show="showSift">
      <view class="history__sift">
        <view v-if="!showDate" class="history__sift__title">
          <u-text size="34rpx" align="center" bold text="筛选互动记录"></u-text>
        </view>
        <view
          @click="currentSift = 1"
          :style="currentSift === 1 ? 'background-color: #c4dcff;' : ''"
          class="history__sift__item"
        >
          <u-text :color="currentSift === 1 ? '#4a92ff;' : ''" align="center" text="位置"></u-text>
        </view>
        <view
          @click="currentSift = 2"
          :style="currentSift === 2 ? 'background-color: #c4dcff;' : ''"
          class="history__sift__item"
        >
          <u-text
            :color="currentSift === 2 ? '#4a92ff;' : ''"
            align="center"
            text="隐私物品"
          ></u-text>
        </view>
        <view
          @click="currentSift = 3"
          :style="currentSift === 3 ? 'background-color: #c4dcff;' : ''"
          class="history__sift__item"
        >
          <u-text :color="currentSift === 3 ? '#4a92ff;' : ''" align="center" text="标签"></u-text>
        </view>
        <view
          @click="currentSift = 4"
          :style="currentSift === 4 ? 'background-color: #c4dcff;' : ''"
          class="history__sift__item"
        >
          <u-text :color="currentSift === 4 ? '#4a92ff;' : ''" align="center" text="日期"></u-text>
        </view>
        <view
          @click="currentSift = 5"
          :style="currentSift === 5 ? 'background-color: #c4dcff;' : ''"
          class="history__sift__item"
        >
          <u-text
            :color="currentSift === 5 ? '#4a92ff;' : ''"
            align="center"
            text="管理人"
          ></u-text>
        </view>
        <view
          @click="currentSift = 6"
          :style="currentSift === 6 ? 'background-color: #c4dcff;' : ''"
          class="history__sift__item"
        >
          <u-text
            :color="currentSift === 6 ? '#4a92ff;' : ''"
            align="center"
            text="关联物品"
          ></u-text>
        </view>
        <view class="history__sift__operate">
          <view class="history__sift__operate-cancel">
            <u-text
              @click="showSift = false"
              color="#898a8d"
              lines="1"
              size="34rpx"
              text="&nbsp;取消"
              align="center"
            />
          </view>
          <view class="history__sift__operate-confirm">
            <u-text
              @click="confirmSift"
              color="#fff"
              lines="1"
              size="34rpx"
              text="&nbsp;确定"
              align="center"
            />
          </view>
        </view>
      </view>
    </u-popup>
    <u-picker
      title="筛选日期"
      :defaultIndex="defaultDate"
      @confirm="setDate"
      @change="changeDate"
      :immediateChange="true"
      @cancel="showDate = false"
      :show="showDate"
      :columns="dateList"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 引入store
import { useFriendStore } from '@/stores/friend'
import { onLoad } from '@dcloudio/uni-app'
import type { Log } from '@/types/friend'
const friendStore = useFriendStore()
const { getFriendLogs } = friendStore

// 历史记录日志
const history = ref<Log[]>([])
// 搜索内容
const inputBox = ref('')
// 搜索日志
async function submitSearch() {
  // 获取日志
  history.value = await getFriendLogs(friendStore.friend.userId, inputBox.value)
}

onLoad(async () => {
  // 获取日志
  history.value = await getFriendLogs(friendStore.friend.userId)
})

// 是否显示筛选
const showSift = ref(false)
// 选择筛选方式
const currentSift = ref(0)
// 确认筛选
const confirmSift = () => {
  // 选择日期筛选时弹出日期弹窗
  showDate.value = currentSift.value === 4
}
//是否显示日期
const showDate = ref(false)
//传入时间戳
const time = new Date(Date.now())
//年
const year = ref(time.getFullYear())
//月
const month = ref(time.getMonth() + 1)
//日
const day = ref(time.getDate())
//默认日期(当前日期)
const defaultDate = ref([new Date().getFullYear() - year.value + 9, month.value - 1, day.value - 1])
//修改日期时触发的回调
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
  if (e.value[0] % 4 === 0 && e.value[0] % 100 !== 0 && e.value[1] === 2)
    dateList.value[2] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29
    ]
  else if (e.value[0] % 4 !== 0 && e.value[1] === 2)
    dateList.value[2] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28
    ]
  else if (e.value[1] === 4 || e.value[1] === 6 || e.value[1] === 9 || e.value[1] === 11)
    dateList.value[2] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30
    ]
  else if (e.value[0] === tempDate.getFullYear() && e.value[1] === tempDate.getMonth() + 1) {
    dateList.value[2] = []
    for (let i = 1; i <= tempDate.getDate(); i++) {
      dateList.value[2].push(i)
    }
  } else
    dateList.value[2] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 31
    ]
}
//日期选择数组
const dateList = ref([
  [
    year.value - 9,
    year.value - 8,
    year.value - 7,
    year.value - 6,
    year.value - 5,
    year.value - 4,
    year.value - 3,
    year.value - 2,
    year.value - 1,
    year.value
  ],
  [],
  []
])
for (let i = 1; i <= new Date().getMonth() + 1; i++) {
  dateList.value[1].push(i)
}
for (let i = 1; i <= new Date().getDate(); i++) {
  dateList.value[2].push(i)
}
//设置日期的回调
const setDate = (e: any): void => {
  year.value = e.value[0]
  month.value = e.value[1]
  day.value = e.value[2]
  showDate.value = false
  defaultDate.value[0] = new Date().getFullYear() - year.value
  defaultDate.value[1] = month.value - 1
  defaultDate.value[2] = day.value - 1
}
</script>

<style lang="scss" scoped>
.history {
  padding-left: 40rpx;
  min-height: 100vh;
  background-color: #f2f2f2;
  &__search-input {
    display: flex;
    width: 690rpx;
    padding: 0 20rpx 0 0;
    margin: 6rpx 0 30rpx 0;

    &__content {
      position: relative;
      display: flex;
      align-items: center;
      width: 552rpx;
      height: 80rpx;
      margin-right: 20rpx;

      &__confirm {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: -30rpx;
        width: 100rpx;
        height: 72%;
        border-radius: 10px;
        font-size: 14px;
        color: #fff;
        background-color: #76acfc;
        transform: translateX(-50%);
        z-index: 999;
      }
    }

    &__sift {
      width: 118rpx;
      height: 80rpx;
      padding-left: 20rpx;
      background-color: #f8f9fd;
      border-radius: 20rpx;
      border: 1px #d8e6fe solid;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &__part {
    width: 686rpx;
    box-sizing: border-box;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
    &__item {
      padding-left: 20rpx;
      color: #808080;
      font-size: 27.5rpx;
    }
  }
  &__sift {
    padding: 50rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    &__title {
      width: 100%;
      margin-bottom: 50rpx;
    }
    &__item {
      display: flex;
      width: 180rpx;
      border-radius: 20rpx;
      background-color: #f6f5f5;
      height: 58rpx;
      margin-bottom: 50rpx;
    }
    &__operate {
      width: 508rpx;
      margin: 0 auto;
      height: 76rpx;
      border-radius: 30rpx;
      display: flex;
      overflow: hidden;
      margin: 50rpx;
      &-cancel {
        background-color: #f2f2f2;
        width: 50%;
        display: flex;
      }
      &-confirm {
        background-color: #3988ff;
        display: flex;
        width: 50%;
      }
    }
  }
}

:deep(.u-search__content) {
  border-radius: 10px !important;
}
</style>
