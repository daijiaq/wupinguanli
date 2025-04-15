import service from '..'
import type { PagingParams } from '@/utils/typings'

// 查看空间列表
export function getAllTagsAPI({ offset, limit = 100 }: PagingParams): Promise<any> {
  return service({
    url: `/labels?offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

// 添加标签
export function createTagAPI(name: string, color: string): Promise<any> {
  return service({
    url: '/labels',
    method: 'POST',
    data: {
      name,
      color
    }
  })
}

// 删除标签
export function deleteTagAPI(id: number): Promise<any> {
  return service({
    url: `/labels/${id}`,
    method: 'DELETE'
  })
}

// 更改标签
export function updateTagAPI(id: number, name: string, color: string): Promise<any> {
  return service({
    url: `/labels/${id}`,
    method: 'PUT',
    data: {
      id,
      name,
      color
    }
  })
}
