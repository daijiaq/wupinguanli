import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getAllMessages, getDots, chooseMessage, getSystemMessage } from '@/network/apis/message'
import type { MessageList, SystemMessage } from '@/types/message'
import type { Pages } from '@/utils/typings'

export const useMessageStore = defineStore('message', () => {
  // 好友申请消息列表
  const currentMessageList: MessageList = reactive({
    currentPage: 1,
    total: 10,
    type: 2,
    content: '',
    unreadMsgNum: [],
    messageList: []
  })

  // 分享物品列表
  const itemShareList: MessageList = reactive({
    currentPage: 1,
    total: 10,
    type: 2,
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
      adminName: '',
      browse: 0,
      content: '',
      noticeId: 0,
      publishTime: '',
      title: '',
      typeId: 0,
      typeName: ''
    }
  ])
  // 请求新的好友申请列表
  const fetchNewMessageList = async (type: number, limit?: number) => {
    const data = await getAllMessages(
      {
        offset: currentMessageList.currentPage,
        limit
      },
      type,
      currentMessageList.content
    )
    // 更新 store 数据
    currentMessageList.currentPage++
    currentMessageList.total = data.pages
    currentMessageList.messageList = data.records

    // // 重新获取未读通知数
    // await fetchAllDots()
  }

  // 请求新的物品分享列表
  const fetchItemShareList = async (type: number, limit?: number) => {
    const data = await getAllMessages(
      {
        offset: itemShareList.currentPage,
        limit
      },
      type,
      itemShareList.content
    )
    // 更新 store 数据
    itemShareList.currentPage++
    itemShareList.total = data.pages
    itemShareList.messageList = data.records

    // // 重新获取未读通知数
    // await fetchAllDots()
  }
  // 是否有未读通知
  const hasUnreadMsg = ref(false)

  // 判断是否有未读通知
  async function fetchAllDots() {
    // 发送请求，获取未读通知数组
    currentMessageList.unreadMsgNum = await getDots()

    // 有未读通知则显示红点
    if (currentMessageList.unreadMsgNum) hasUnreadMsg.value = true
    else hasUnreadMsg.value = false
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
