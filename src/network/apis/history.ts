import service from '..'
import type { PagingParams } from '@/utils/typings'

export interface HistoryLogResponse {
  total: number
  current: number
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

export interface HistoryLogItem {
  itemId: number
  itemName: string
  itemCover: string
  modifierName: string
  modifyTime: string
  content: string
  hide: number
  privacy: number
}

interface ItemLogSearchDTO {
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
  [property: string]: any
}

// 筛选物品修改记录
// @param params 分页参数
// @param filterParams 筛选参数
// @returns Promise<FilterHistoryResult>
export async function filterHistory(
  params: PagingParams,
  filterParams: ItemLogSearchDTO
): Promise<HistoryLogResponse> {
  const { offset, limit = 10 } = params
  const response = await service<HistoryLogResponse>({
    url: `/items/search/itemLog?offset=${offset}&limit=${limit}`,
    method: 'POST',
    data: JSON.stringify({
      name: filterParams.name || null,
      types: filterParams.types || null,
      startDate: filterParams.startDate || null
      // endDate: filterParams.endDate || null
    })
  })
  // 添加日志，打印原始响应数据
  console.log('原始响应数据:', response)
  return response
}
