<script setup lang="ts">
import { useMessageStore } from '@/stores/message'
import { onLoad } from '@dcloudio/uni-app'
import { formatDate } from '@/utils/util'
const userStore = useMessageStore()
const { fetchSystemMessage, fetchMoreSystemMessage } = userStore

// 触底加载
const loadMore = async () => {
  if (userStore.systemMessage.current > userStore.systemMessage.pages) {
    return
  } else {
    await fetchMoreSystemMessage()
  }
}

onLoad(async () => {
  await fetchSystemMessage(0)
})
</script>
<template>
  <u-navbar
    title="系统消息"
    bgColor="#f7f7f7"
    autoBack
    placeholder
    titleStyle="font-weight: bold"
  ></u-navbar>
  <scroll-view @scrolltolower="loadMore" :scroll-y="true" class="scroll-view" show-scrollbar>
    <view class="feedback" v-for="item in userStore.systemMessageList" :key="item.noticeId">
      <view class="feedback__content">
        <text class="feedback__content__text">{{ item.title }}</text>
        <view class="feedback__content__detail">
          <view class="feedback__content__detail__time">
            {{ formatDate(item.publishTime) }}
          </view>
          <view class="feedback__content__detail__result">
            <template>
              {{ item.typeName }} &nbsp;&nbsp; <text>{{ item.content }} </text>
            </template>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.feedback {
  background-color: #fcfcfe;
  margin: 10px 20px 10px 20px;
  border: 1px solid #f8f8f9;
  border-radius: 20rpx;

  &__content {
    display: flex;
    margin: 10px 20px 10px 20px;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    white-space: nowrap;

    &__text {
      font-size: 20px;
      font-weight: bold;
    }

    &__detail {
      &__time {
        color: #a7a7a8;
        font-size: 13px;
        padding-bottom: 10px;
      }

      &__result {
        color: #a7a7a8;
        font-size: 14px;
        padding-bottom: 15px;

        text {
          color: #565656;
        }

        &__update {
          padding-top: 10px;
          margin-left: 65px;
          color: #007aff;
          font-weight: bold;
          text-decoration: underline;
        }
      }
    }
  }
}
.scroll-view {
  height: 1500rpx;
}
</style>
<style lang="scss">
page {
  background-color: #f7f7f7;
  /* 设置背景色为灰色 */
}
</style>
