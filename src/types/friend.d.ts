import type { T1 } from '@/utils/typings'

//分组
export interface GroupsInfo {
  /**
   * 当前所在页
   */
  current: number
  /**
   * 每页个数
   */
  size: number
  /**
   * 总页数
   */
  pages: number
  /**
   * 总数
   */
  total: number
  /**
   * 分组数组
   */
  groupsData: T1[]
}

// 获取好友接口返回的数据类型
export interface GetFriend {
  /**
   * uuid好友id
   */
  id: number
  /**
   * 好友备注
   */
  notes: string
  /**
   * 好友名字
   */
  name: string
  /**
   * 用户ID
   */
  userId: number
  /**
   * 好友头像
   */
  avatar: string
  /**
   * 好友二维码
   */
  qrCode: string
  /**
   * 好友状态
   */
  checked?: boolean
}
export interface Group {
  /**
   * 分组ID
   */
  id: number
  /**
   * 分组名
   */
  name: string
  /**
   * 朋友数组
   */
  friendVO: GetFriend[]
  // friendVO: Friend[]
}

// 根据id搜索陌生人返回的数据类型
export interface Friend {
  /**
   * ID
   */
  id: number
  /**
   * 好友备注
   */
  notes: string
  /**
   * 好友名字
   */
  name: string
  /**
   * 好友头像
   */
  avatar: string
  /**
   * 好友二维码
   */
  qrCode: string
  /**
   * 邮箱
   */
  email: string
  /**
   * 手机
   */
  phone: string
  /**
   * 是否为好友
   */
  buddy: boolean
  /**
   * 如果是好友，该好友分组的基本信息
   */
  groupBaseInfo: GroupBaseInfo
}

export interface GroupBaseInfo {
  /**
   * 分组ID
   */
  groupId: number
  /**
   * 分组名称
   */
  groupName: string
}

export interface Log {
  buddyLogId: number
  content: string
  logTime: string
}

// 判断是否为好友接口类型
export interface IFriendRelationship {
  /**
   * 是否为好友 0为否 1为是
   */
  buddy: number
}

// 分页获取分组
export interface PageGroup {
  /**
   * 当前所在页
   */
  current: number
  /**
   * 每页个数
   */
  size: number
  /**
   * 总页数
   */
  pages: number
  /**
   * 总数
   */
  total: number
  /**
   * 分组数组
   */
  records: GroupVO[]
}

export interface GroupVO {
  /**
   * 分组id
   */
  id: number
  /**
   * 分组名
   */
  name: string
  /**
   * 顺序号
   */
  sortedNum: number
  /**
   * 分组人数
   */
  groupNum: number
}

// 根据分页分组获取好友/根据名字模糊匹配好友
export interface getGroupFriendType {
  /**
   * 当前所在页
   */
  current: number
  /**
   * 每页个数
   */
  size: number
  /**
   * 总页数
   */
  pages: number
  /**
   * 总数
   */
  total: number
  /**
   * 分组数组
   */
  records: BuddyVO[]
}

export interface BuddyVO {
  /**
   * 好友id
   */
  id: number
  /**
   * 好友备注
   */
  notes: string
  /**
   * 好友名字
   */
  name: string
  /**
   * 好友分组id
   */
  groupId: number
  /**
   * 好友头像
   */
  avatar: string
  /**
   * 好友二维码
   */
  qrCode: string
  /**
   * 好友状态
   */
  checked?: boolean
}
