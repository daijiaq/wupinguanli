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
import { ref, reactive, watch, computed, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { useMessageStore } from '@/stores/message'
import { clearDots } from '@/network/apis/message'
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
  itemShareList.value.content = ''
  await messageStore.fetchItemShareList(0, 10)
  // 隐藏骨架屏
  isLoad.value = false
  // 清除红点(进入页面就相当于已读)
  await clearDots(3)

  // 页面加载完成后，检查是否需要加载更多数据
  await nextTick()
  checkNeedLoadMoreByHeight()
})

// 搜索框信息
const inputBox = ref('')
const isSearch = ref(false)
let frontMessageList = reactive<ItemMessageDetail[]>([])
let latestMessageList = reactive<ItemMessageDetail[]>([])

// 时间判断(将信息区分为三天前、近三天)
watch(
  () => itemShareList.value.messageList,
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
    console.log(latestMessageList, frontMessageList)
    isSearch.value = false
  }
)

// 滚动到底部发送请求获取更多数据
const getMoreMessage = async () => {
  if (itemShareList.value.currentPage <= itemShareList.value.total) {
    await messageStore.fetchItemShareList(0, 10)
  }
}

// 检查是否需要自动加载更多数据
const checkNeedLoadMore = () => {
  const totalDisplayedItems = latestMessageList.length + frontMessageList.length
  const containerHeight = 1200 // 容器高度，对应CSS中的height: 1200rpx
  const estimatedItemHeight = 200 // 估算每个item的高度
  const maxVisibleItems = Math.ceil(containerHeight / estimatedItemHeight)

  // 如果当前显示的项目数量少于容器能显示的最大数量，且还有更多页，则自动加载
  if (
    totalDisplayedItems < maxVisibleItems &&
    itemShareList.value.currentPage <= itemShareList.value.total
  ) {
    return true
  }
  return false
}

// 更精确的检测方法：使用实际DOM高度
const checkNeedLoadMoreByHeight = () => {
  // 获取scroll-view的实际高度
  const query = uni.createSelectorQuery()
  query.select('.chatbox__search-list-item__content').boundingClientRect()
  query.exec((res) => {
    if (res && res[0]) {
      const containerHeight = res[0].height
      const totalDisplayedItems = latestMessageList.length + frontMessageList.length
      const estimatedItemHeight = 200 // 估算每个item的高度
      const maxVisibleItems = Math.ceil(containerHeight / estimatedItemHeight)

      // 如果当前显示的项目数量少于容器能显示的最大数量，且还有更多页，则自动加载
      if (
        totalDisplayedItems < maxVisibleItems &&
        itemShareList.value.currentPage <= itemShareList.value.total
      ) {
        console.log('基于实际高度检测：需要加载更多数据')
        messageStore.fetchItemShareList(0, 10)
      }
    }
  })
}

// 自动加载更多数据的函数
const autoLoadMore = async () => {
  if (checkNeedLoadMore()) {
    console.log('自动加载更多数据')
    await messageStore.fetchItemShareList(0, 10)
  }
}

const isNoMore = computed(() => {
  // 简化逻辑：只要还有更多页就继续加载
  // 因为过滤是在前端进行的，后端分页参数仍然有效
  const hasMorePages = itemShareList.value.currentPage <= itemShareList.value.total
  console.log('hasMorePages:', hasMorePages)
  return !hasMorePages
})

// 监听数据变化，自动加载更多
watch(
  () => [latestMessageList.length, frontMessageList.length],
  async () => {
    // 延迟执行，确保DOM更新完成
    await nextTick()
    // 使用更精确的高度检测方法
    checkNeedLoadMoreByHeight()
  }
)

// 获取筛选后的聊天信息
const submitSearch = async () => {
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

  // 搜索完成后，检查是否需要加载更多数据
  await nextTick()
  checkNeedLoadMoreByHeight()
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
