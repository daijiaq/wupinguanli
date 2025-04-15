import type { RoomForm, ItemForm, BatchUpdate, LogsInfo, Image } from '@/types/form'
import type { DetailData } from '@/types/space'
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getDetailRoomAPI, getDetailItemAPI, viewShareItemAPI } from '@/network/apis/space'
import {
  createItemAPI,
  createRoomAPI,
  uploadImgAPI,
  getItemLogsAPI,
  updateRoomAPI,
  updateItemAPI,
  uploadFigureImgAPI,
  batchUpdateItemsAPI,
  batchDeleteItemsAPI
} from '@/network/apis/form'
export const useFormStore = defineStore('form', () => {
  // 物品数据
  const itemData = ref<DetailData>({
    id: 0,
    images: [],
    figures: [],
    type: 1,
    name: '',
    qrCode: '',
    privacy: 0,
    labels: [],
    items: [],
    count: 0,
    price: 0,
    date: '',
    url: '',
    state: '',
    path: [],
    comment: '',
    fatherName: '',
    cover: '',
    address: '',
    longitude: 0,
    latitude: 0
  })

  // 暂存当前编辑数据
  const tempItemData = reactive<DetailData>({
    id: 0,
    images: [],
    figures: [],
    type: 1,
    name: '',
    qrCode: '',
    privacy: 0,
    labels: [],
    items: [],
    count: 0,
    price: 0,
    date: '',
    url: '',
    state: '',
    path: [],
    comment: '',
    fatherName: '',
    cover: '',
    address: '',
    longitude: 0,
    latitude: 0
  })

  // 日志数据
  const logsInfo = ref<LogsInfo>({
    current: 0,
    total: 10,
    pages: 0,
    size: 0,
    logsData: []
  })

  // 获取物品日志
  async function getItemLogs(id: number): Promise<void> {
    logsInfo.value.logsData = (await getItemLogsAPI(id, { offset: 0 })).records
  }

  // 获取详情
  async function getDetail(type: number, id: number, password: string): Promise<void> {
    let data: DetailData
    if (type === 0) {
      data = await getDetailRoomAPI(id, password)
    } else {
      data = await getDetailItemAPI(id, password)
    }
    itemData.value = JSON.parse(JSON.stringify(data))
  }

  // 分享的物品详情
  async function getShareItemDetail(
    type: number,
    itemId: number,
    userId: number,
    password: string
  ): Promise<void> {
    let data: DetailData
    if (type === 0) {
      data = await getDetailRoomAPI(itemId, password)
    } else {
      data = await viewShareItemAPI(itemId, userId, password)
    }
    itemData.value = JSON.parse(JSON.stringify(data))
  }

  // 当前物品或空间id
  const currentId = ref(0)

  // 当前层数
  const currentFloor = ref(0)

  // 当前名
  const currentName = ''

  // 添加空间
  async function createRoom(roomForm: RoomForm): Promise<DetailData> {
    return await createRoomAPI(roomForm)
  }

  // 添加物品
  async function createItem(fatherId: number, itemForm: ItemForm): Promise<DetailData> {
    return await createItemAPI(fatherId, itemForm)
  }

  // 上传图片
  async function upload(
    type: number,
    url: string
  ): Promise<{
    id: number
    url: string
  }> {
    if (type) return await uploadFigureImgAPI(url)
    else return await uploadImgAPI(url)
  }

  //更新空间内的物品或空间数据
  async function updateItem(fatherId: number, id: number, itemForm: ItemForm): Promise<DetailData> {
    return await updateItemAPI(fatherId, id, itemForm)
  }

  //更新空间数据
  async function updateRoom(id: number, roomForm: RoomForm): Promise<DetailData> {
    return await updateRoomAPI(id, roomForm)
  }

  //多选物品id
  const ids = <number[]>[]

  //多选更新物品或空间
  async function batchUpdateItems(ids: number[], form: BatchUpdate): Promise<void> {
    await batchUpdateItemsAPI(ids, form)
  }

  //多选删除物品或空间
  async function batchDeleteItems(ids: number[]): Promise<void> {
    await batchDeleteItemsAPI(ids)
  }

  const form = reactive({
    images: [] as Image[],
    figures: [] as Image[],
    name: '',
    count: 1,
    price: '',
    url: '',
    state: '',
    comment: '',
    items: [] as any[],
    address: '',
    labels: [] as any[]
  })

  const resetForm = () => {
    form.images = []
    form.figures = []
    form.name = ''
    form.count = 1
    form.price = ''
    form.url = ''
    form.state = ''
    form.comment = ''
    form.items = []
    form.address = ''
  }

  return {
    itemData,
    logsInfo,
    getItemLogs,
    getDetail,
    getShareItemDetail,
    currentId,
    currentFloor,
    currentName,
    upload,
    createRoom,
    createItem,
    updateRoom,
    updateItem,
    ids,
    batchUpdateItems,
    batchDeleteItems,
    tempItemData,
    form,
    resetForm
  }
})
