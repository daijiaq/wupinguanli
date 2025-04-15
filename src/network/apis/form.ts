import service from '..'
import type { ItemForm, RoomForm, Log, BatchUpdate } from '@/types/form'
import type { DetailData } from '@/types/space'
import type { Pages } from '@/utils/typings'
import type { PagingParams } from '@/utils/typings'
import { uploadFileService } from '..'

// 添加房间
export function createRoomAPI({
  privacy,
  type,
  price,
  name,
  state,
  address,
  latitude,
  longitude,
  comment,
  date,
  labels,
  images,
  figures,
  password
}: RoomForm): Promise<DetailData> {
  return service<DetailData>({
    url: '/items/rooms',
    method: 'POST',
    data: {
      hide: 0,
      privacy,
      type,
      price,
      name,
      state,
      address,
      latitude,
      longitude,
      comment,
      date,
      labels,
      images,
      figures,
      password
    }
  })
}

// 添加空间中的空间或物品
export function createItemAPI(
  id: number,
  {
    privacy,
    type,
    price,
    name,
    state,
    comment,
    date,
    fatherName,
    url,
    path,
    labels,
    count,
    images,
    figures,
    password,
    items
  }: ItemForm
): Promise<DetailData> {
  return service<DetailData>({
    url: `/items/${id}/items`,
    method: 'POST',
    data: {
      hide: 0,
      privacy,
      type,
      price,
      name,
      state,
      comment,
      date,
      fatherName,
      url,
      path,
      labels,
      count,
      images,
      figures,
      password,
      items
    }
  })
}

// 更新房间
export function updateRoomAPI(
  id: number,
  {
    privacy,
    type,
    price,
    name,
    state,
    address,
    latitude,
    longitude,
    comment,
    date,
    labels,
    images,
    figures,
    password
  }: RoomForm
): Promise<DetailData> {
  return service<DetailData>({
    url: `/items/rooms/${id}`,
    method: 'PUT',
    data: {
      privacy,
      type,
      price,
      name,
      state,
      address,
      latitude,
      longitude,
      comment,
      date,
      labels,
      images,
      figures,
      password
    }
  })
}

// 更新空间中的空间或物品
export function updateItemAPI(
  fatherId: number,
  id: number,
  {
    privacy,
    type,
    price,
    name,
    state,
    comment,
    date,
    fatherName,
    url,
    path,
    labels,
    count,
    images,
    figures,
    password,
    items
  }: ItemForm
): Promise<DetailData> {
  return service<DetailData>({
    url: `/items/${fatherId}/items/${id}`,
    method: 'PUT',
    data: {
      privacy,
      type,
      price,
      name,
      state,
      comment,
      date,
      fatherName,
      url,
      path,
      labels,
      count,
      images,
      figures,
      password,
      items
    }
  })
}

// 获取物品日志
export function getItemLogsAPI(
  id: number,
  { offset, limit = 100 }: PagingParams
): Promise<Pages<Log>> {
  return service<Pages<Log>>({
    url: `/items/${id}/logs?offset=${offset}&limit=${limit}`,
    method: 'GET'
  })
}

// 上传图片
export function uploadImgAPI(imgUrl: string): Promise<{
  id: number
  url: string
}> {
  return uploadFileService<{
    id: number
    url: string
  }>({
    url: `/items/upload/image`,
    filePath: imgUrl,
    timeout: 20000,
    name: 'image'
  })
}

// 上传备注图片
export function uploadFigureImgAPI(imgUrl: string): Promise<{
  id: number
  url: string
}> {
  return uploadFileService<{
    id: number
    url: string
  }>({
    url: `/items/upload/figure`,
    filePath: imgUrl,
    timeout: 20000,
    name: 'image'
  })
}

// 批量修改物品
export function batchUpdateItemsAPI(
  ids: number[],
  { state, count, price, name, date, privacy, password }: BatchUpdate
): Promise<null> {
  return service<null>({
    url: `/items/modify`,
    method: 'PUT',
    timeout: 10000,
    data: {
      ids,
      state,
      count,
      price,
      name,
      date,
      privacy,
      password
    }
  })
}

// 批量删除物品
export function batchDeleteItemsAPI(ids: number[]): Promise<null> {
  return service<null>({
    url: `/items/delete/0`,
    method: 'DELETE',
    timeout: 10000,
    data: ids
  })
}
