import type { T1 } from '@/utils/typings'

// 空间物品表单数据通用类型
interface Form {
  /**
   * 是否是隐藏物品(0非隐藏，1隐藏)
   */
  hide: string
  /**
   * 备注
   */
  comment: string
  /**
   * 日期
   */
  date: string
  /**
   * 名字
   */
  name: string
  /**
   * 价值
   */
  price: number
  /**
   * 隐私设置(0非隐私1隐私)
   */
  privacy: number
  /**
   * 状态
   */
  state: string
  /**
   * 属性(0房屋1空间2物品)
   */
  type: number
  /**
   * 备注图片数组
   */
  figures: Image[]
  /**
   * 图片数组
   */
  images: Image[]
  /**
   * 标签数组
   */
  labels: Label[]
  /**
   * 密码
   */
  password?: string
}

//图片数据
interface Image {
  /**
   * ID
   */
  id?: number
  /**
   * 图片链接
   */
  url: string
}

// 标签
export interface Label extends T1 {
  /**
   * 颜色
   */
  color: string
}

// 空间表单
export interface RoomForm extends Form {
  /**
   * 地址
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

// 物品表单
export interface ItemForm extends Form {
  /**
   * 父空间名
   */
  fatherName: string
  /**
   * 路径数组
   */
  path: T1[]
  /**
   * 链接
   */
  url: string
  /**
   * 数量
   */
  count: number
  /**
   * 关联物品
   */
  items: RelateItem[]
}

// 关联物品
export interface RelateItem extends T1 {
  /**
   * 图片
   */
  cover: string
}

// 历史记录类型
export interface Log {
  /**
   * 名字
   */
  id: number
  /**
   * 名字
   */
  username: string
  /**
   * 具体内容
   */
  content: string
  /**
   * 日期
   */
  date: number
}

// 批量修改
export interface BatchUpdate {
  /**
   * 状态
   */
  state: string
  /**
   * 数量
   */
  count: number
  /**
   * 价格
   */
  price: number
  /**
   * 名字
   */
  name: string
  /**
   * 入库日期
   */
  date: string
  /**
   * 隐私设置(0非隐私1隐私)
   */
  privacy: number
  /**
   * 入库日期
   */
  password?: string
}

// 标签信息
export interface LogsInfo {
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
   * 标签数据
   */
  logsData: Log[]
}
