import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import {
  // getAllMessages,
  getDots,
  chooseMessage,
  getSystemMessage,
  getFriend,
  getShareItem
} from '@/network/apis/message'
import type { MessageList, SystemMessage, ItemMessageList } from '@/types/message'
import type { Pages } from '@/utils/typings'

export const useMessageStore = defineStore('message', () => {
  // 好友申请消息列表
  const currentMessageList: MessageList = reactive({
    currentPage: 1,
    total: 10,
    // type: 2,
    content: '',
    unreadMsgNum: [],
    messageList: []
  })

  // 分享物品列表
  const itemShareList: ItemMessageList = reactive({
    currentPage: 1,
    total: 10,
    // type: 2,
    content: '',
    unreadMsgNum: [],
    messageList: []
  })

  // 系统消息
  const systemMessage = ref<Pages<SystemMessage>>({
    current: 0,
    pages: 0,
    size: 0,
    total: 0,
    records: []
  })
  // 系统消息列表
  const systemMessageList = ref<SystemMessage[]>([
    {
      // adminName: '',
      // browse: 0,
      content: '',
      noticeId: 0,
      publishTime: '',
      title: '',
      // typeId: 0,
      type: 0
    }
  ])
  // 请求新的好友申请列表（新）
  const fetchNewMessageList = async (limit?: number) => {
    const data = await getFriend(
      {
        offset: currentMessageList.currentPage,
        limit
      },
      currentMessageList.content
    )
    // 更新 store 数据
    currentMessageList.currentPage++
    currentMessageList.total = data.pages
    currentMessageList.messageList = data.records
  }

  // 请求新的物品分享列表（新）
  const fetchItemShareList = async (shareType: number, limit?: number) => {
    const data = await getShareItem(
      {
        offset: itemShareList.currentPage,
        limit
      },
      itemShareList.content,
      shareType
    )
    // 更新 store 数据
    itemShareList.currentPage++
    itemShareList.total = data.pages
    itemShareList.messageList = data.records
  }
  // 系统通知是否有未读通知
  const systemHasUnreadMsg = ref(false)
  // 好友申请是否有未读通知
  const friendHasUnreadMsg = ref(false)
  // 物品分享是否有未读通知
  const itemShareUnreadMsg = ref(false)

  // 判断是否有未读通知
  async function fetchAllDots() {
    // 发送请求，获取未读通知数组
    systemHasUnreadMsg.value = false
    friendHasUnreadMsg.value = false
    itemShareUnreadMsg.value = false
    const dots = await getDots()
    // 遍历
    for (let i = 0; i < dots.length; i++) {
      if (dots[i] === 1) {
        if (i === 0) systemHasUnreadMsg.value = true
        else if (i === 2) friendHasUnreadMsg.value = true
        else if (i === 3) itemShareUnreadMsg.value = true
      }
    }
    console.log(friendHasUnreadMsg.value)
  }

  // 选择通知
  async function selectMessage(noticeId: number, choice: number): Promise<void> {
    await chooseMessage(noticeId, choice)
  }

  // 获取系统通知
  async function fetchSystemMessage(offset: number, limit?: number) {
    const res = await getSystemMessage({ offset, limit })
    systemMessage.value = res
    systemMessageList.value = res.records
  }

  // 触底刷新系统通知
  async function fetchMoreSystemMessage() {
    const res = await getSystemMessage({ offset: systemMessage.value.current })
    systemMessage.value = res
    systemMessage.value.current = systemMessage.value.current + 1
    systemMessageList.value.push(...res.records)
  }

  return {
    systemHasUnreadMsg,
    friendHasUnreadMsg,
    itemShareUnreadMsg,
    currentMessageList,
    systemMessageList,
    systemMessage,
    itemShareList,
    fetchNewMessageList,
    fetchMoreSystemMessage,
    fetchAllDots,
    selectMessage,
    fetchSystemMessage,
    fetchItemShareList
  }
})
