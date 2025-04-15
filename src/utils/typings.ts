export interface Pages<T> {
  /**
   * 当前页
   */
  current: number
  /**
   * 总共页
   */
  pages: number
  /**
   * 每页显示数量
   */
  size: number
  /**
   * 总共数量
   */
  total: number
  /**
   * 列表数组
   */
  records: T[]
}

export interface FullUserInfo {
  /**
   * 个人简介
   */
  brief: string
  /**
   * 头像
   */
  avatar: string
  /**
   * 用户id
   */
  id: string
  /**
   * 手机号
   */
  phone: string
  /**
   * 性别，0 保密，1 男，2 女
   */
  sex: 0 | 1 | 2
  /**
   * 用户名
   */
  name: string
  /**
   * 状态，0 黑名单，1 正常
   */
  state: 0 | 1
  /**
   * 二维码
   */
  qrCode: string
}

export interface FullItemInfo {
  /**
   * 物品属性，0表示空间，1表示物品
   */
  type: 0 | 1
  /**
   * 物品 id
   */
  id: string
  /**
   * 物品名称
   */
  name: string
  /**
   * 隐私，0 表示公开，1 表示私密
   */
  privacy: 0 | 1
  /**
   * 预览图
   */
  previewImg: string
  /**
   * 物品数量
   */
  quantity: number
  /**
   * 物品金额
   */
  price: number
  /**
   * 物品状态
   */
  state: string
  /**
   * 物品标签
   */
  tags: string[]
  /**
   * 入库日期时间戳
   */
  storageTime: number
  /**
   * 关联物品
   */
  relatedItems: string[]
  /**
   * 从属空间
   */
  dependentSpace: string
  /**
   * 管理人
   */
  manager: string[]
  /**
   * 物品备注
   */
  notes: string
}

// 获取列表的分页参数
export interface PagingParams {
  /**
   * 当前页数
   */
  offset: number
  /**
   * 每页个数
   */
  limit?: number
}

export interface Tag {
  /**
   * ID
   */
  id: number
  /**
   * 名字
   */
  name: string
  /**
   * 颜色
   */
  color: string
}

export interface T1 {
  /**
   * ID
   */
  id: number
  /**
   * 名字
   */
  name: string
}
