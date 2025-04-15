import service from '..'
import type { PagingParams } from '@/utils/typings'
import type { ResponseItemList, ResponseTagList } from '@/types/search'
import type { ScreenItemsParams, SearchInputParams } from '@/types/search'

// 获取所有物品
// 搜索的所有接口都要加个 deleted 参数，1 表示已删除列表中找，0 表示空间中找
export function getAllItems(
  { offset, limit = 10 }: PagingParams,
  deleted: number
): Promise<ResponseItemList> {
  return service({
    url: `/items/search?offset=${offset}&limit=${limit}`,
    method: 'POST',
    data: {
      type: -1,
      highPrice: -1,
      dateType: -1,
      name: '',
      lowPrice: -1,
      labelId: [],
      deleted
    }
  })
}

// 获取所有标签
export function getAllTags({ offset, limit = 100 }: PagingParams): Promise<ResponseTagList> {
  return service({
    url: `/labels?offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

// 筛选后获取物品列表
export function searchByScreen(
  { offset, limit = 10 }: PagingParams,
  { name }: SearchInputParams,
  { type, dateType, highPrice, lowPrice, labelId }: ScreenItemsParams,
  deleted: number
): Promise<ResponseItemList> {
  return service({
    url: `/items/search?offset=${offset}&limit=${limit}`,
    method: 'POST',
    data: {
      name,
      type,
      highPrice,
      dateType,
      lowPrice,
      labelId,
      deleted
    }
  })
}

// 搜索后获取物品列表
export function searchByInput(
  { offset, limit = 10 }: PagingParams,
  { name }: SearchInputParams,
  { type, dateType, highPrice, lowPrice, labelId }: ScreenItemsParams,
  deleted: number
): Promise<ResponseItemList> {
  return service({
    url: `/items/search?offset=${offset}&limit=${limit}`,
    method: 'POST',
    data: {
      name,
      type,
      highPrice,
      dateType,
      lowPrice,
      labelId,
      deleted
    }
  })
}

// 批量删除
export function batchDelete(
  // 0 在空间中删除 | 1 在回收站删除
  type: number,
  itemIds: number[]
): Promise<null> {
  return service({
    url: `/items/delete/${type}`,
    method: 'DELETE',
    timeout: 10000,
    data: itemIds
  })
}
