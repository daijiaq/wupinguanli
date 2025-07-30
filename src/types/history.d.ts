import { Pages } from '@/utils/typings'
// 用于请求的基本搜索列表
export interface SearchList {
  /**
   * 当前所在页
   */
  offset: number
  /**
   * 每页个数
   */
  limit: number
  /**
   * 总页数
   */
  total: number
  /**
   * 物品数组
   */
  itemList: ItemList[]
}

// 用于请求的完整搜索列表
export interface CompleteSearchList extends SearchList {
  /**
   * 多选物品的 id 数组
   */
  checkedItemList: number[]
}

// 进行物品操作请求的参数：
// 响应的基本物品信息数组
export interface ItemList {
  itemId: number
  itemName: string
  itemCover: string
  modifierName: string
  modifyTime: string
  content: string
  hide: number
  privacy: number
}

// 每个路径对象
export interface ItemPath {
  /**
   * 路径 id
   */
  id: number
  /**
   * 路径名
   */
  name: string
}

// 历史记录 log 的类型
export interface HistoryLog {
  /**
   * logId
   */
  id: number
  /**
   * 修改者用户名
   */
  username: string
  /**
   * 修改内容
   */
  content: string
  /**
   * 修改日期
   */
  date: string
}

// 响应的搜索数组及最近删除列表
export type ResponseItemList = Pages<Omit<ItemList, 'log'>>

// 响应的历史记录列表
export type ResponseHistoryList = Pages<Omit<ItemList, 'path'>>

// 展现在界面的物品数组（path 格式化成 string）
type ItemListPath = Omit<ItemList, 'path'>
export interface ExtendItemListPath extends ItemListPath {
  /**
   * 物品路径
   */
  path: string
}

// 筛选弹窗的展示控制
export interface ShowControl {
  /**
   * 是否展开位置列表
   */
  showLocation: boolean
  /**
   * 是否展开隐私物品列表
   */
  showPrivacy: boolean
  /**
   * 是否展开标签列表
   */
  showTag: boolean
  /**
   * 是否展开日期列表
   */
  showDate: boolean
  /**
   * 是否展开管理人列表
   */
  showManager: boolean
  /**
   * 是否展开关联物品列表
   */
  showRelatedItems: boolean
}

// 筛选请求的参数
type CurrentScreen = Omit<SearchList, 'itemList'>
export interface ExtendCurrentScreen extends CurrentScreen {
  /**
   * 筛选的数据
   */
  screenData: ItemLogSearchDTO
}

// 搜索筛选的参数
export interface ScreenItemsParams {
  /**
   * 类型
   */
  type: number
  /**
   * 最低价格
   */
  lowPrice: number
  /**
   * 最高价格
   */
  highPrice: number
  /**
   * 日期排序类型
   */
  dateType: number
  /**
   * 标签数组
   */
  labelId: number[]
}

// 输入框搜索请求的参数
type CurrentSearchInput = Omit<SearchList, 'itemList'>
export interface ExtendCurrentSearchInput extends CurrentSearchInput {
  /**
   * 输入框的数据
   */
  inputData: SearchInputParams
}

// 输入框内容的参数
export interface SearchInputParams {
  /**
   * 物品名称
   */
  name: string
}

/**
 * 物品修改记录筛选请求参数
 */
export interface ItemLogSearchDTO {
  /**
   * 查询的日志结束时间
   */
  // endDate?: null | string
  /**
   * 物品名称(支持模糊匹配)
   */
  name?: null | string
  /**
   * 查询的日志开始时间
   */
  startDate?: null | string
  /**
   * 筛选的日志类型
   * 0: 全部日志
   * 1：位置日志
   * 2：隐私日志
   * 3：标签日志
   * 4：日期日志
   * 5:管理人日志
   * 6：关联物品日志
   */
  types?: number[] | null
  // [property: string]: any
}

/**
 * 物品修改记录VO
 */
export interface ItemUpdateLogVo {
  /**
   * 修改内容
   */
  content?: string | null
  /**
   * 物品封面
   */
  itemCover?: string | null
  /**
   * 物品ID
   */
  itemId?: number | null
  /**
   * 物品名称
   */
  itemName?: string | null
  /**
   * 修改人
   */
  modifierName?: string | null
  /**
   * 修改时间
   */
  modifyTime?: string | null
}

/**
 * 分页结果
 */
export interface BasePageItemUpdateLogVo {
  /**
   * 当前页
   */
  current?: number | null
  /**
   * 总页数
   */
  pages?: number | null
  /**
   * 分页对象数据
   */
  records?: ItemUpdateLogVo[] | null
  /**
   * 每页显示数量
   */
  size?: number | null
  /**
   * 数量总数
   */
  total?: number | null
}

/**
 * 接口响应结构
 */
export interface ApiResponse<T> {
  /**
   * Http状态码
   */
  code?: number | null
  /**
   * 返回的数据对象
   */
  data?: T
  /**
   * 返回的状态信息
   */
  msg?: string | null
}

//日志类型枚举
export enum LogType {
  ALL = 0,
  LOCATION = 1,
  PRIVACY = 2,
  TAG = 3,
  DATE = 4,
  MANAGER = 5,
  RELATED_ITEMS = 6
}

/**
 * 物品修改记录接口响应结构
 */
export interface HistoryLogResponse {
  code: number
  msg: string
  data: {
    current: number
    size: number
    total: number
    pages: number
    records: HistoryLogItem[]
  }
}

/**
 * 单条修改记录
 */
export interface HistoryLogItem {
  itemId: number
  itemName: string
  itemCover: string
  modifierName: string
  modifyTime: string
  content: string
}
