import service from '..'
import type { PagingParams, Pages, T1 } from '@/utils/typings'
import type {
  Group,
  GetFriend,
  Log,
  IFriendRelationship,
  Friend,
  PageGroup,
  getGroupFriendType
} from '@/types/friend'

// 获取好友分组
export function getAllGroupsAPI({ offset, limit = 10 }: PagingParams): Promise<PageGroup> {
  return service({
    url: `/groups?offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

// 添加分组
export function createGroupAPI(name: string): Promise<T1> {
  return service({
    url: `/groups`,
    method: 'POST',
    data: name
  })
}

// 删除分组
export function deleteGroupAPI(id: number): Promise<null> {
  return service({
    url: `/groups/${id}`,
    method: 'DELETE'
  })
}

// 修改分组
export function updateGroupAPI(id: number, name: string): Promise<T1> {
  return service({
    url: `/groups/${id}?name=${name}`,
    method: 'PUT'
  })
}

// 同意好友申请添加好友（新接口）
export function addFriendAPI(noticeId: number, groupId: number, notes: string) {
  return service({
    url: `/friends/agree`,
    method: 'POST',
    data: {
      noticeId,
      groupId,
      notes
    }
  })
}

// 获取所有好友(这个接口就是刚进好友页面一次性拉取所有分组和分组里面的好友 这个接口不用了)
export function getAllFriendsAPI(): Promise<Group[]> {
  return service({
    url: `/friends`,
    method: 'GET'
  })
}

// 新接口搜索用户
export function searchUserAPI(id: number): Promise<Friend> {
  return service({
    url: `/friends/search/buddy/${id}`,
    method: 'GET'
  })
}

// 移动好友分组
export function moveFriendAPI(groupId: number, ids: number[]): Promise<null> {
  return service({
    url: `/friends/move/${groupId}`,
    method: 'PUT',
    data: ids
  })
}

// 修改好友备注
export function updateFriendNoteAPI(id: number, notes: string): Promise<null> {
  return service({
    url: `/friends/${id}?notes=${notes}`,
    method: 'PUT'
  })
}

// 批量删除好友
export function batchDeleteFriendsAPI(ids: number[]): Promise<null> {
  return service({
    url: '/friends',
    method: 'DELETE',
    data: ids
  })
}

// 删除单个好友
export function deleteFriendAPI(id: number): Promise<null> {
  return service({
    url: `/friends/${id}`,
    method: 'DELETE'
  })
}
/**
 * 获取好友日志
 * @param id 好友id
 * @param content 搜索内容
 */
export function getFriendLogsAPI(id: number, content: string): Promise<Log[]> {
  return service({
    url: `/friends/logs/${id}?content=${content}`,
    method: 'GET'
  })
}

/**
 * 获取好友信息
 * @param userId 用户id
 */
export function getUserInfoAPI(userId: number): Promise<Friend> {
  return service({
    method: 'GET',
    url: `/users/${userId}`
  })
}

/**
 * 发送好友申请通知接口（新接口）
 */
export function sendApplicationAPI(
  userId: number,
  notes: string,
  validMessage: string,
  source: string
): Promise<Friend[]> {
  return service({
    url: '/notices/addBuddy',
    method: 'POST',
    data: {
      userId,
      groupId: 0,
      notes,
      validMessage,
      source
    }
  })
}

/**
 * 分享物品[好像是旧接口 后面可能要改成新的]
 */
export function shareItemAPI(ItemId: number, userId: number): Promise<Friend[]> {
  return service({
    method: 'POST',
    url: `/notices`,
    data: {
      userId,
      type: 3,
      content: null,
      itemId: ItemId
    }
  })
}

/**
 * 查询是否为好友
 * @param userId 用户id
 */
export function determineWhetherFriend(userId: number): Promise<IFriendRelationship> {
  return service({
    method: 'GET',
    url: `/friends/${userId}`
  })
}

/**
 * 根据分组分页获取好友接口
 */
export function getGroupFriend(
  groupId: number,
  offset = 1,
  limit = 3
): Promise<getGroupFriendType> {
  return service({
    method: 'GET',
    url: `/friends/group?groupId=${groupId}&offset=${offset}&limit=${limit}`
  })
}

// 根据名字模糊匹配好友
export function searchFriendsByName(
  buddyName: string,
  offset = 1,
  limit = 10
): Promise<getGroupFriendType> {
  return service({
    method: 'GET',
    url: `/friends/searchByName?buddyName=${buddyName}&offset=${offset}&limit=${limit}`
  })
}
