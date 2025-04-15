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

// 标签参数：
// 用于请求的标签列表
export interface TagList {
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
   * 标签数组
   */
  tagsList: TagItem[]
}

// 标签每一项
export interface TagItem {
  /**
   * id
   */
  id: number
  /**
   * 标签名
   */
  name: string
  /**
   * 颜色
   */
  color: string
  /**
   * 是否选中
   */
  isChecked?: boolean
}

// 响应的标签列表
export type ResponseTagList = Pages<TagItem>

// 进行物品操作请求的参数：
// 响应的基本物品信息数组
export interface ItemList {
  /**
   * 物品 id
   */
  id: number
  /**
   * 类型，0表示空间，1表示空间，2表示物品
   */
  type: number
  /**
   * 隐私，0 表示公开，1 表示私密
   */
  privacy: 0 | 1
  /**
   * 名称
   */
  name: string
  /**
   * 封面图
   */
  cover: string
  /**
   * 请求到的路径数组
   */
  path?: ItemPath[]
  /**
   * 历史记录信息
   */
  log?: HistoryLog
  /**
   * 是否选中
   */
  isChecked?: boolean
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
   * 是否展开属性列表
   */
  showProperties: boolean
  /**
   * 是否展开金额列表
   */
  showPrice: boolean
  /**
   * 是否展开标签列表
   */
  showTags: boolean
  /**
   * 是否展开日期列表
   */
  showDate: boolean
}

// 筛选请求的参数
type CurrentScreen = Omit<SearchList, 'itemList'>
export interface ExtendCurrentScreen extends CurrentScreen {
  /**
   * 筛选的数据
   */
  screenData: ScreenItemsParams
}

// 筛选的参数
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
