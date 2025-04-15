import service from '..'
import { uploadFileService } from '../index'
import type { UserInfo } from '@/types/user'
import type { ResponseHistoryList } from '@/types/search'
import type { PagingParams } from '@/utils/typings'

// 获取用户信息
export function getUserInfo(): Promise<UserInfo> {
  return service({
    url: '/users',
    method: 'GET'
  })
}

// 修改用户头像
export function changeUserAvatar(filePath: string): Promise<UserInfo> {
  return service({
    url: `/users/avatar?avatar=${filePath}`,
    method: 'POST'
  })
}
// 修改用户头像
// export function changeUserAvatar(filePath: string): Promise<UserInfo> {
//   return uploadFileService({
//     url: `/users/avatar?${filePath}`,
//     name: 'avatar'
//   })
// }

// 修改用户名
export function changeUserName(name: string): Promise<UserInfo> {
  return service({
    url: `/users/name?name=${name}`,
    method: 'PUT'
  })
}

// 恢复删除物品
export function reloadDeletedItems(itemIds: number[]): Promise<null> {
  return service({
    url: `/items/restore`,
    method: 'PUT',
    data: itemIds
  })
}

// 获取历史记录
export function getAllHistory(
  { offset, limit = 10 }: PagingParams,
  name: string
): Promise<ResponseHistoryList> {
  return service({
    url: `/items/logs?name=${name}&offset=${offset}&limit=${limit}`
  })
}
