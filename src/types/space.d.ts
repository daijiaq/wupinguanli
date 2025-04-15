import type { RelateItem, Image, Label } from './form'
import type { T1 } from '@/utils/typings'

// 路径
export interface Path extends T1 {
  /**
   * 父空间ID
   */
  fatherId: number
  /**
   * 层级
   */
  layer: number
}

// 物品详情
export interface DetailData extends T1 {
  /**
   * 隐私权
   */
  privacy: number
  /**
   * 类型
   */
  type: number
  /**
   * 数量
   */
  count: number
  /**
   * 封面
   */
  cover: string
  /**
   * 价格
   */
  price: number
  /**
   * 状态
   */
  state: string
  /**
   * 备注
   */
  comment: string
  /**
   * 二维码
   */
  qrCode: string
  /**
   * 父空间名字
   */
  date: string
  /**
   * 图片链接数组
   */
  images: Image[]
  /**
   * 备注图片链接数组
   */
  figures: Image[]
  /**
   * 父空间名字
   */
  fatherName?: string
  /**
   * 标签数组
   */
  labels: Label[]
  /**
   * 关联物品
   */
  items: RelateItem[]
  /**
   * 所属路径
   */
  path: Path[]
  /**
   * 链接
   */
  url: string
  /**
   * 地址(仅房子有)
   */
  address: string
  /**
   * 纬度
   */
  latitude: number
  /**
   * 经度
   */
  longitude: number
}

// 简短空间数据
export interface BriefData extends T1 {
  /**
   * 地址(房屋才有)
   */
  address?: string
  /**
   * 房间封面
   */
  cover: string
  /**
   * 日期
   */
  date: string
  /**
   * 内部物品封面
   */
  itemCover?: string[]
  /**
   * 隐私设置(0非隐私1隐私)
   */
  privacy: number
  /**
   * 属性(0房屋1空间2物品)
   */
  type: number
}

// 空间信息
export interface SpacesInfo {
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
   * 空间数据
   */
  spaceData: BriefData[]
}

// 扫码前置请求
export interface PreScanInfo {
  /**
   * 是否为隐私物品/是否已经为好友(0非1是)
   */
  state: number
}
