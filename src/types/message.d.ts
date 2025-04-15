import { Pages } from '@/utils/typings'
export interface MessageList {
  /**
   * 当前所在页
   */
  currentPage: number
  /**
   * 总页数
   */
  total: number
  /**
   * 消息类型(0系统1管理2好友3分享)
   */
  type: number
  /**
   * 搜索内容
   */
  content: string
  /**
   * 未读消息数量
   */
  unreadMsgNum: number[]
  /**
   * 消息框数组
   */
  messageList: MessageItem[]
}

export interface MessageItem {
  /**
   * 消息id
   */
  id: number
  /**
   * 0未读，1已读
   */
  state: string
  /**
   * 0未选，1接受，2拒绝
   */
  choice: number
  /**
   * 内容（没有则为 null）
   */
  content: string
  /**
   * 通知时间
   */
  datetime: string
  /**
   * -1系统消息，0自己发出去的，1别人发给自己的
   */
  label: number
  /**
   * 好友通知信息
   */
  friend: FriendMessageDetail
  /**
   * 管理通知信息
   */
  item: ItemMessageDetail
}

// 好友申请
export interface FriendMessageDetail {
  /**
   * 好友 id
   */
  id: string
  /**
   * 当前用户 id
   */
  userId: number
  /**
   * 好友名字
   */
  name: string
  /**
   * 好友备注
   */
  notes: string
  /**
   * 好友头像
   */
  avatar: string
  /**
   * 二维码
   */
  qrCode: string
}

// 物品申请
export interface ItemMessageDetail {
  /**
   * 物品 id
   */
  id: number
  /**
   * 物品封面
   */
  cover: string
  /**
   * 物品名字
   */
  name: string
  /**
   * 隐私设置(0非隐私1隐私)
   */
  privacy: number
}

// 添加通知
export interface AddMessage {
  /**
   * 接收者 id
   */
  userId: number
  /**
   * 通知类型
   */
  type: number
  /**
   * 物品 id（无则传0）
   */
  itemId: number
  /**
   * 内容
   */
  content: string
}

// 响应的通知列表
export type ResponseMessageList = Pages<MessageItem>

// 系统通知
export interface SystemMessage {
  /**
   * 发布通知的管理员名称
   */
  adminName: string
  /**
   * 浏览量
   */
  browse: number
  /**
   * 系统通知主体内容
   */
  content: string
  noticeId: number
  /**
   * 通知发布时间
   */
  publishTime: string
  /**
   * 系统通知标题
   */
  title: string
  /**
   * 通知类型id
   */
  typeId: number
  /**
   * 通知类型名称
   */
  typeName: string
}
