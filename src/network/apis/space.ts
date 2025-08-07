import service from '..'
import type { PagingParams, Pages, T1 } from '@/utils/typings'
import type {
  BriefData,
  Path,
  DetailData,
  PreScanInfo,
  scanItemRes,
  BasePageItemSearchVO
} from '@/types/space'

// 查看空间列表
export function getFirstFloorRoomsAPI({
  offset,
  limit = 10
}: PagingParams): Promise<Pages<BriefData>> {
  return service<Pages<BriefData>>({
    url: `/items/rooms?offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

// 查看某个空间中的物品
export function getRoomItemsAPI(
  // 要查询的空间 id
  itemId: number,
  { offset, limit = 10 }: PagingParams
): Promise<Pages<BriefData>> {
  return service<Pages<BriefData>>({
    url: `/items/${itemId}/items?offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

// 查看空间详情
export function getDetailRoomAPI(id: number, password: string): Promise<DetailData> {
  return service<DetailData>({
    url: `/items/rooms/${id}?password=${encodeURIComponent(password)}`,
    method: 'GET'
  })
}

// 查看物品详情
export function getDetailItemAPI(id: number, password: string): Promise<DetailData> {
  return service<DetailData>({
    url: `/items/${id}?password=${encodeURIComponent(password)}`,
    method: 'GET'
  })
}

// 分享物品
export function viewShareItemAPI(
  itemId: number,
  userId: number,
  password: string
): Promise<DetailData> {
  return service<DetailData>({
    url: `/items/${itemId}/${userId}?password=${encodeURIComponent(password)}`,
    method: 'GET'
  })
}

// 获取所有路径
export function getAllPathsAPI(): Promise<Path[][]> {
  return service<Path[][]>({
    url: `/items/path`,
    timeout: 10000,
    method: 'GET'
  })
}

// 移动物品
export function batchMoveItemsAPI(fatherId: number, ids: number[], path: T1[]): Promise<null> {
  return service<null>({
    url: `/items/${fatherId}/move`,
    method: 'PUT',
    data: {
      ids,
      path
    }
  })
}

// 新增物品共同管理
export function addManagementAPI(ownerId: number, itemId: number): Promise<null> {
  return service<null>({
    url: `/items/management/${ownerId}/${itemId}`,
    method: 'POST'
  })
}

// 扫码前置请求
export function preScanRequestAPI(
  itemId: number,
  userId: number,
  type: number,
  privacy: number,
  hide: number
): Promise<PreScanInfo> {
  return service<PreScanInfo>({
    url: `/items/scan`,
    method: 'POST',
    data: {
      itemId,
      userId,
      type,
      privacy,
      hide
    }
  })
}

// 扫码处查看物品概况
export function scanItemAPI(itemId: number, userId: number): Promise<scanItemRes> {
  return service<scanItemRes>({
    url: `/items/qrcode/${userId}/${itemId}`,
    method: 'GET'
  })
}

// 扫码处获取内部物品列表
export function scanInnerItemApi(
  userId: number,
  itemId: number,
  current: number,
  size: number
): Promise<BasePageItemSearchVO> {
  return service<BasePageItemSearchVO>({
    url: `/items/qrcode/list?userId=${userId}&itemId=${itemId}&current=${current}&size=${size}`,
    method: 'GET'
  })
}
