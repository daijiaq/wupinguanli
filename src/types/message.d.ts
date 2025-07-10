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
  // type: number
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
  // messageList: MessageItem[]
  messageList: FriendMsgDetail[]
}

export interface ItemMessageList {
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
  // type: number
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
  // messageList: MessageItem[]
  messageList: ItemMessageDetail[]
}

// 旧获取除系统通知之外的其他类型通知的接口的数据返回类型 /notices/{type}
// export interface MessageItem {
//   /**
//    * 消息id
//    */
//   id: number
//   /**
//    * 0未读，1已读
//    */
//   state: string
//   /**
//    * 0未选，1接受，2拒绝
//    */
//   choice: number
//   /**
//    * 内容（没有则为 null）
//    */
//   content: string
//   /**
//    * 通知时间
//    */
//   datetime: string
//   /**
//    * -1系统消息，0自己发出去的，1别人发给自己的
//    */
//   label: number
//   /**
//    * 好友通知信息
//    */
//   friend: FriendMessageDetail
//   /**
//    * 管理通知信息
//    */
//   item: ItemMessageDetail
// }

//获取好友申请（新）
export interface FriendMsgDetail {
  /**
   * 通知id
   */
  noticeId: number
  /**
   * 申请时间
   */
  noticeTime: string
  /**
   *0自己发出去的1别人发给我的
   */
  label: number
  /**
   * 选择(0未选1接受2忽略)
   */
  choice: number
  /**
   * 状态(0未读1已读)
   */
  state: string
  /**
   * 申请人或物品主人的id(在获取好友申请中相当于好友id)
   */
  relateId: number
  /**
   * 申请人或物品主人的名字(在获取好友申请中相当于好友名字)
   */
  relateName: string
  /**
   * 申请人或物品主人的头像(在获取好友申请中相当于好友头像)
   */
  relateAvatar: string
  /**
   * 好友备注
   */
  relateNotes: string
  /**
   * 申请来源
   */
  source: string
}

// // 好友申请（旧）
// export interface FriendMessageDetail {
//   /**
//    * 好友 id
//    */
//   id: string
//   /**
//    * 当前用户 id
//    */
//   userId: number
//   /**
//    * 好友名字
//    */
//   name: string
//   /**
//    * 好友备注
//    */
//   notes: string
//   /**
//    * 好友头像
//    */
//   avatar: string
//   /**
//    * 二维码
//    */
//   qrCode: string
// }

// 物品申请(旧)
// export interface ItemMessageDetail {
//   /**
//    * 物品 id
//    */
//   id: number
//   /**
//    * 物品封面
//    */
//   cover: string
//   /**
//    * 物品名字
//    */
//   name: string
//   /**
//    * 隐私设置(0非隐私1隐私)
//    */
//   privacy: number
// }

// 物品分享（新）
export interface ItemMessageDetail {
  /**
   * 选择(0未选1接受2忽略)
   */
  choice: number
  /**
   * 0自己发出去的1别人发给我的
   */
  label: number
  /**
   * 通知id
   */
  noticeId: number
  /**
   * 申请时间
   */
  noticeTime: string
  /**
   * 申请人或物品主人的头像(在获取好友申请中相当于好友头像)
   */
  relateAvatar: string
  /**
   * 申请人或物品主人的id(在获取好友申请中相当于好友id)
   */
  relateId: number
  /**
   * 申请人或物品主人的名字(在获取好友申请中相当于好友名字)
   */
  relateName: string
  /**
   * 状态(0未读1已读)
   */
  state: number
  /**
   * 被分享的好友id
   */
  sharedBuddyId: number
  /**
   * 被分享的好友id
   */
  sharedBuddyName: string
  /**
   * 被分享的好友头像
   */
  sharedBuddyAvatar: string
  /**
   * 被分享的好友是否已经添加
   */
  buddy: boolean
  /**
   * 隐私设置(0非隐私1隐私2隐私及内层隐私)，1隐私是查看该物品的详情要输密码，而点进内层不需要 2隐私及内层隐私就是查看该物品详情和点进内层都需要密码
   */
  privacy?: number
  /**
   * 属性(0房屋1空间2物品3暂存区)
   */
  attribute?: number
  /**
   * 物品id(0为无)
   */
  itemId: number
  /**
   * 物品名称
   */
  itemName?: string
  /**
   * 物品图片
   */
  itemImage?: string
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
// export type ResponseMessageList = Pages<MessageItem>
// 响应的好友申请列表
export type ResponseFriendMsgList = Pages<FriendMsgDetail>
// 响应的物品分享列表
export type ResponseItemMsgList = Pages<ItemMessageDetail>

// 系统通知
export interface SystemMessage {
  /**
   * 发布通知的管理员名称
   */
  // adminName: string
  /**
   * 浏览量
   */
  // browse: number
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
  // typeId: number
  /**
   * 通知类型
   */
  type: number
}

// 首先定义单个通知对象的接口
export interface NoticeFirstVO {
  /**
   * 通知id
   */
  id: number
  /**
   * 通知内容
   */
  content: string
  /**
   * 类型(0系统1管理2好友3分享)
   */
  type: number
  /**
   * 状态(0未读1已读2忽略)
   */
  state: number
}

// 各类型最新一条通知
export interface FirstMsg {
  code: number
  msg: string
  data: NoticeFirstVO[]
}
