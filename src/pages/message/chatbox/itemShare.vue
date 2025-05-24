<template>
  <skeleton v-if="isLoad" />
  <view class="chatbox" v-else>
    <u-navbar title="物品分享" autoBack placeholder bgColor="#f5f5f5" titleStyle="font-weight:bold">
    </u-navbar>
    <view class="chatbox__search-input">
      <view class="chatbox__search-input__content">
        <u-search
          placeholderColor="#979797"
          searchIconColor="#565b6d"
          searchIconSize="52rpx"
          v-model="inputBox"
          :showAction="false"
          shape="square"
          height="80rpx"
          bgColor="#F8F9FD"
        ></u-search>
        <view
          class="chatbox__search-input__content__confirm"
          @click="submitSearch"
          :class="{ active: inputBox }"
        >
          <span>搜索</span>
        </view>
      </view>
    </view>
    <view class="chatbox__search-list-item">
      <scroll-view
        :scroll-y="true"
        class="chatbox__search-list-item__content"
        @scrolltolower="getMoreMessage"
      >
        <view
          class="chatbox__search-list-item__content__time"
          v-if="latestMessageList.length !== 0"
        >
          <u-text text="近三天"></u-text>
        </view>
        <text v-if="latestMessageList.length === 0 && frontMessageList.length === 0"
          >暂无物品分享</text
        >
        <view v-for="item in latestMessageList" :key="item.noticeId">
          <item :item="item" :isShare="true" :userId="userId" />
        </view>
        <view class="chatbox__search-list-item__time" v-if="frontMessageList.length !== 0">
          <u-text text="三天前"></u-text>
        </view>
        <view v-for="item in frontMessageList" :key="item.noticeId">
          <item :item="item" :isShare="true" :userId="userId" />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onLoad } from '@dcloudio/uni-app'
import { ref, reactive, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useMessageStore } from '@/stores/message'
// import type { MessageItem } from '@/types/message'
import type { ItemMessageDetail } from '@/types/message'
import item from '@/components/MessageList/MessageItem/MessageItem.vue'
import skeleton from '@/components/MessageList/MessageSkeleton/MessageSkeleton.vue'

// 当前聊天信息
let isLoad = ref(true)
const messageStore = useMessageStore()
// const { currentMessageList } = storeToRefs(messageStore)
const { itemShareList } = storeToRefs(messageStore)

// 获取用户信息
const user = useUserStore()
const { fetchUserInfo } = user
const { userInfo } = storeToRefs(user)
const userId = ref(0)
watch(userInfo, () => {
  userId.value = userInfo.value.userId
})
fetchUserInfo()

onLoad(async () => {
  // 展开骨架屏
  isLoad.value = true
  // 页数置零
  itemShareList.value.currentPage = 1
  console.log(isLoad.value)
  // 获取最新信息
  await messageStore.fetchItemShareList(0, 10)
  // 隐藏骨架屏
  isLoad.value = false
})

// 搜索框信息
const inputBox = ref('')
const isSearch = ref(false)
let frontMessageList = reactive<ItemMessageDetail[]>([])
let latestMessageList = reactive<ItemMessageDetail[]>([])

// 时间判断(将信息区分为三天前、近三天)
watch(
  () => itemShareList.value.messageList[0].noticeId,
  () => {
    // 将原数组的清空，再进行新数据的添加，不能整个替换
    // 三天前
    if (isSearch.value === true) {
      frontMessageList.length = 0
      latestMessageList.length = 0
    }
    frontMessageList.push(
      ...itemShareList.value.messageList.filter(
        (product) => Date.now() - Date.parse(product.noticeTime) >= 86400000 * 3
      )
    )

    // 近三天
    latestMessageList.push(
      ...itemShareList.value.messageList.filter(
        (product) => Date.now() - Date.parse(product.noticeTime) < 86400000 * 3
      )
    )

    isSearch.value = false
  }
)

// 滚动到底部发送请求获取更多数据
const getMoreMessage = async () => {
  if (itemShareList.value.currentPage <= itemShareList.value.total) {
    await messageStore.fetchItemShareList(0, 10)
  }
}

// 获取筛选后的聊天信息
const submitSearch = async () => {
  // 前端筛选
  // currentMessageList.value.messageList = currentMessageList.value.messageList.filter(
  //   (item) => item.item.name.indexOf(inputBox.value) !== -1
  // )
  // console.log(currentMessageList.value.messageList)
  isSearch.value = true
  itemShareList.value.currentPage = 1
  itemShareList.value.content = inputBox.value
  inputBox.value = ''
  uni.showLoading({
    title: '搜索中'
  })
  await messageStore.fetchItemShareList(0, 10)
  uni.showToast({
    title: '搜索成功'
  })
}
</script>

<style lang="scss" scoped>
.chatbox {
  &__search-input {
    display: flex;
    width: 92vw;
    padding: 0 10rpx 0 40rpx;
    margin: 15rpx 0 30rpx 0;

    &__content {
      position: relative;
      display: flex;
      align-items: center;
      width: 92vw;
      height: 80rpx;

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
        z-index: 2;
      }
    }
  }

  &__search-list-item {
    margin: 0rpx 40rpx;

    &__content {
      height: 1200rpx;

      &__time {
        display: flex;
        justify-content: center;
        font-size: 26rpx;
        color: $uni-text-color-grey;
      }
    }
  }
}

// 搜索框有内容时动态添加
.active {
  background-color: #3988ff;
}
</style>
