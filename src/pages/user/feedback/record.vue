<template>
  <view>
    <u-navbar
      bgColor="transparent"
      placeholder
      title="意见反馈"
      titleStyle="font-weight:bold"
      autoBack
      leftIcon="arrow-left"
    >
    </u-navbar>
  </view>
  <view class="records">
    <view class="record-item-wrapper" v-for="(title, index) in titles" :key="index">
      <view class="record-item" v-if="types?.charAt(index) === '1'">
        <view class="record-title">
          <text class="title">{{ title }}</text>
          <up-icon
            :name="isShowList[index] ? 'arrow-down' : 'arrow-right'"
            label=""
            @click="isShowList[index] = !isShowList[index]"
          ></up-icon>
        </view>
        <view class="record-content-wrapper">
          <scroll-view
            class="record-content"
            v-if="isShowList[index]"
            scroll-y
            @scrolltolower="() => loadMore(index)"
            :style="{ height: boxHeights[index] }"
          >
            <view
              class="record-content-item"
              v-for="item in feedbackMap[index]"
              :key="item.id"
              @click="goToDetail(item)"
            >
              <view> {{ item.content }} </view>
              <view class="feedback-time">{{ item.feedTime?.slice(0, 10) }}</view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { fetchFeedbackListAPI, fetchFeedbackTypeAPI } from '@/network/apis/faceBack'
import { FeedbackRequest, FeedbackResponse, FeedbackVO, FeedbackTypeResponse } from '@/types/user.d'
import { onMounted, ref } from 'vue'
// const list = ref<FeedbackVO[]>([])
const types = ref<string>('000000')
const feedbackMap = ref<{ [key: number]: FeedbackVO[] }>({}) // 存储每个 type 的列表
const offsetMap = ref<{ [key: number]: number }>({})
const isShowList = ref([false, false, false, false, false, false])
const titles = [
  '无法打开小程序',
  '小程序闪退',
  '页面加载慢',
  '其他异常',
  '产品开发建议',
  '意见反馈'
]
const boxHeights = ref<string[]>([])
// 获取某种类型的反馈数据
async function getFeedbackListByType(type: number, offset: number) {
  try {
    const res = await fetchFeedbackListAPI({
      type,
      offset,
      limit: 5
    })
    return Array.isArray(res) ? res : [res]
  } catch (error) {
    console.error(`获取类型${type}反馈失败:`, error)
    return []
  }
}
// 获取反馈类型
async function getFeedbackType() {
  try {
    const res = await fetchFeedbackTypeAPI()
    console.log('获取反馈类型成功:', res)
    return res
  } catch (error) {
    console.error('获取反馈类型失败:', error)
  }
}
// 点击反馈记录跳转到详细页
function goToDetail(item: FeedbackVO) {
  const queryStr = encodeURIComponent(JSON.stringify(item)) // 避免中文或特殊字符乱码
  uni.navigateTo({
    url: `/pages/user/feedback/recordDetail?data=${queryStr}`
  })
}
// 局部刷新列表
async function loadMore(index: number) {
  const offset = offsetMap.value[index] || 1
  const nextOffset = offset + 1
  const newList = await getFeedbackListByType(index + 1, nextOffset)

  if (newList.length) {
    feedbackMap.value[index] = [...(feedbackMap.value[index] || []), ...newList]
    offsetMap.value[index] = nextOffset
  } else {
    console.log(`类型 ${index + 1} 没有更多数据了,总页数${offsetMap.value[index]}`)
  }
  console.log(`触发加载更多,index: ${index}`)
}

onMounted(async () => {
  const res = await getFeedbackType()
  types.value = res?.types || '000000'

  const promises = []
  // 初始化 feedbackMap
  for (let i = 0; i < types.value.length; i++) {
    if (types.value.charAt(i) === '1') {
      promises.push(
        getFeedbackListByType(i + 1, 1).then((list) => {
          feedbackMap.value[i] = list
        })
      )
    }
  }

  // 初始化 offsetMap
  for (let i = 0; i < types.value.length; i++) {
    if (types.value.charAt(i) === '1') {
      offsetMap.value[i] = 1
    }
  }
  await Promise.all(promises)
  for (let i = 0; i < types.value.length; i++) {
    const len = feedbackMap.value[i]?.length || 0
    len >= 5 ? (boxHeights.value[i] = '450rpx') : (boxHeights.value[i] = `${len * 90}rpx`)
  }
  console.log('盒子高度初始化成功:', boxHeights.value)
  console.log('所有类型数据获取完成:', feedbackMap.value)
})
</script>

<style lang="scss" scoped>
%center {
  width: 80%;
  margin: 30rpx auto;
}

.records {
  @extend %center;
  .record-item {
    width: 100%;
    min-height: 100rpx;
    // max-height: 360rpx;
    margin: 50rpx auto;
    text-align: left;
    overflow: hidden;
    border-bottom: 1px solid rgb(217, 217, 217);

    .record-title {
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .title {
        font-size: 16px;
        line-height: 60rpx;
        font-weight: bold;
      }
    }
    .record-content-wrapper {
      .record-content {
        // height: 400rpx;
        overflow: scroll;
        .record-content-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80rpx;
          font-size: 14px;
          line-height: 40rpx;
          margin: 10rpx 0;
          border-bottom: 0.5px solid rgb(230, 238, 255);
          &:last-child {
            border-bottom: none;
          }
          .feedback-time {
            font-size: 10px;
          }
        }
      }
    }
  }
}
</style>
