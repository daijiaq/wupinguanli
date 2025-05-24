import service from '..'
import type { Pages, PagingParams } from '@/utils/typings'
import type {
  AddMessage,
  FirstMsg,
  // ResponseMessageList,
  ResponseFriendMsgList,
  ResponseItemMsgList,
  SystemMessage,
  NoticeFirstVO
} from '@/types/message'

// // 获取所有通知 旧接口一次性获取除了系统通知外的其他类型通知
// export function getAllMessages(
//   { offset, limit = 10 }: PagingParams,
//   type: number,
//   content: string
// ): Promise<ResponseMessageList> {
//   return service({
//     url: `/notices/${type}?offset=${offset}&limit=${limit}&content=${content}`,
//     method: 'GET'
//   })
// }

//分页获取好友申请的接口
export function getFriend(
  { offset, limit = 10 }: PagingParams,
  content: string
): Promise<ResponseFriendMsgList> {
  return service({
    url: `/notices/buddyApplication?offset=${offset}&limit=${limit}&content=${content}`,
    method: 'GET'
  })
}

// 分页获取分享物品的接口
export function getShareItem(
  { offset, limit = 10 }: PagingParams,
  content: string,
  shareType: number
): Promise<ResponseItemMsgList> {
  return service({
    url: `/notices/getShareNoticeVO?offset=${offset}&limit=${limit}&content=${content}&shareType=${shareType}`,
    method: 'GET'
  })
}

// 添加通知
export function addMessage({ userId, type, itemId, content }: AddMessage): Promise<null> {
  return service({
    url: `/notices`,
    method: 'POST',
    data: {
      userId,
      type,
      itemId,
      content
    }
  })
}

// 拒绝通知
export function refuseMessage(noticeId: string): Promise<null> {
  return service({
    url: `/notices/${noticeId}`,
    method: 'PUT'
  })
}

// 选择通知
export function chooseMessage(noticeId: number, choice: number): Promise<null> {
  return service({
    url: `/notices/${noticeId}/${choice}`,
    method: 'PUT'
  })
}

// 获取红点，返回一个数组，索引0123分别代表四种通知
export function getDots(): Promise<number[]> {
  return service({
    url: `/notices/dots`
  })
}

// 清空红点
export function clearDots(noticeId: number[]): Promise<null> {
  return service({
    url: `/notices/empty/dots`,
    method: 'PUT',
    data: noticeId
  })
}

// 获取通知详情
// export function getSystemMessage(
//   { offset, limit = 10 }: PagingParams,
//   content = '',
//   noticeType = 0
// ): Promise<Pages<SystemMessage>> {
//   return service({
//     url: `/notices/sys?offset=${offset}&limit=${limit}&content=${content}&noticeType=${noticeType}`,
//     method: 'GET'
//   })
// }

// 新接口获取系统通知
export function getSystemMessage({
  offset,
  limit = 10
}: PagingParams): Promise<Pages<SystemMessage>> {
  return service({
    url: `/notices/simpleSys?offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

//获取每种类型最新一条通知
export function getFirstMsg(): Promise<NoticeFirstVO[]> {
  return service({
    url: `/notices/allFirst`,
    method: 'GET'
  })
}
