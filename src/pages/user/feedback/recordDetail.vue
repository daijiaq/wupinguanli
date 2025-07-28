<template>
  <view class="feedback-detail">
    <view class="navbar">
      <u-navbar
        bgColor="transparent"
        placeholder
        title="意见反馈"
        titleStyle="font-weight:bold"
        autoBack
        leftIcon="arrow-left"
      ></u-navbar>
    </view>
    <view class="title">
      <view>{{ title }}</view>
      <view class="feedTime">{{ feedTime }}</view>
    </view>
    <view class="content">
      <view class="text">{{ content }}</view>
      <view class="images">
        <u-image
          v-for="(url, index) in imageUrls"
          :key="index"
          :src="url"
          width="160rpx"
          height="160rpx"
          radius="30rpx"
        />
      </view>
    </view>
    <view class="return-information" v-if="returnInformation">
      <view class="title">
        <view>开发者回复 - {{ getStateText(state) }}</view>
        <view class="reply-time">{{ replyTime }}</view>
      </view>
      <view class="content">{{ developerReply }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import type { FeedbackVO, State } from '@/types/user.d'

const detailItem = ref<FeedbackVO | null>(null)
const titles = [
  '',
  '无法打开小程序',
  '小程序闪退',
  '页面加载慢',
  '其他异常',
  '产品开发建议',
  '意见反馈'
]
const type = computed(() => detailItem.value?.type || 0)
const title = computed(() => titles[type.value] || '未知类型')
const feedTime = computed(() => {
  const time = detailItem.value?.feedTime || ''
  // 调整时间格式，截取前10位，得到 yyyy-mm-dd 格式
  return time.slice(0, 10)
})
const content = computed(() => detailItem.value?.content ?? '')
const imageUrls = computed(() => detailItem.value?.imageUrls ?? [])
const returnInformation = computed(() => detailItem.value?.returnInformation ?? 'false')
const state = computed(() => (detailItem.value?.state || 'UNREAD') as State)
const developerReply = computed(() => detailItem.value?.developerReply ?? '')
const replyTime = computed(() => {
  const time = detailItem.value?.replyTime || ''
  // 截取前10位，得到 yyyy-mm-dd 格式
  return time.slice(0, 10)
})
function getStateText(state: State) {
  switch (state) {
    case 'UNREAD':
      return '未读'
    case 'READ':
      return '已读'
    default:
      return '已读未回复'
  }
}
onLoad((options) => {
  if (options && options.data) {
    try {
      detailItem.value = JSON.parse(decodeURIComponent(options.data))
      console.log('反馈详情:', detailItem.value)
    } catch (e) {
      console.error('解析参数失败', e)
    }
  }
})
</script>

<style lang="scss" scoped>
.feedback-detail {
  width: 80%;
  margin: 0 auto;
  .title {
    height: 60rpx;
    margin: 60rpx 0;
    .feedTime {
      text-align: right;
      font-size: 10px;
    }
  }
  .content {
    .text {
      height: 150rpx;
      margin-bottom: 60rpx;
    }
    .images {
      display: flex;
      height: 160rpx;
    }
  }
}
</style>
