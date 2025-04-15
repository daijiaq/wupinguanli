import type { Label } from './form'

// 空间信息
export interface TagsInfo {
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
  tagData: Label[]
}
//自动标签
export interface AutoTag {
  [dataKey: string]: {
    /**
     * 种类1
     */
    category_1: string
    /**
     * 种类2
     */
    category_2: string
    /**
     * 标签
     */
    label: string
  }
}
