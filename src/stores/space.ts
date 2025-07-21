import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  Path,
  PreScanInfo,
  SpacesInfo,
  scanItemRes,
  BasePageItemSearchVO
} from '@/types/space'
import type { T1 } from '@/utils/typings'
import {
  getFirstFloorRoomsAPI,
  getRoomItemsAPI,
  getAllPathsAPI,
  batchMoveItemsAPI,
  addManagementAPI,
  preScanRequestAPI,
  scanItemAPI,
  scanInnerItemApi
} from '@/network/apis/space'

export const useSpaceStore = defineStore('space', () => {
  // 空间信息
  const spacesInfo = ref<SpacesInfo>({
    current: 0,
    total: 10,
    pages: 0,
    size: 0,
    spaceData: []
  })

  async function getFirstFloorRooms(): Promise<void> {
    const data = await getFirstFloorRoomsAPI({
      offset: spacesInfo.value.current + 1
    })
    spacesInfo.value.current = data.current
    spacesInfo.value.size = data.size
    spacesInfo.value.total = data.total
    spacesInfo.value.spaceData.push(...data.records)
  }

  // 获取某个空间中的物品
  async function getRoomItems(id: number): Promise<void> {
    const data = await getRoomItemsAPI(id, {
      offset: spacesInfo.value.current + 1
    })
    if (data) {
      spacesInfo.value.current = data.current
      spacesInfo.value.size = data.size
      spacesInfo.value.total = data.total
      spacesInfo.value.spaceData.push(...data.records)
    } else {
      spacesInfo.value.spaceData = []
    }
  }

  //所有路径信息
  const pathsInfo = ref<Path[][]>([[]])

  //当前路径信息
  const spaces = ref<Path[]>([])

  // 获取所有路径
  async function getAllPaths(): Promise<void> {
    pathsInfo.value = await getAllPathsAPI()
  }

  // 批量移动物品
  async function batchMove(fatherId: number, ids: number[], path: T1[]): Promise<void> {
    await batchMoveItemsAPI(fatherId, ids, path)
  }

  // 新增物品共同管理权限
  async function addManagement(ownerId: number, itemId: number): Promise<void> {
    await addManagementAPI(ownerId, itemId)
  }

  // 扫码前置请求
  async function preScanRequest(
    itemId: number,
    userId: number,
    type: number,
    privacy: number,
    hide: number
  ): Promise<PreScanInfo> {
    return await preScanRequestAPI(itemId, userId, type, privacy, hide)
  }

  // 扫码处查看物品概况
  async function scanItemRequest(itemId: number, userId: number): Promise<scanItemRes> {
    return await scanItemAPI(itemId, userId)
  }
  // 扫码处获取内部物品列表
  async function getInnerItems(
    userId: number,
    itemId: number,
    current: number,
    size: number
  ): Promise<BasePageItemSearchVO> {
    return await scanInnerItemApi(userId, itemId, current, size)
  }

  return {
    spacesInfo,
    getFirstFloorRooms,
    getRoomItems,
    pathsInfo,
    spaces,
    getAllPaths,
    batchMove,
    addManagement,
    preScanRequest,
    scanItemRequest,
    getInnerItems
  }
})
