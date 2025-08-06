import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import {
  getAllItems,
  getDependceItems,
  getAllTags,
  searchByScreen,
  searchByInput,
  batchDelete
} from '@/network/apis/search'
import { reloadDeletedItems, getAllHistory } from '@/network/apis/user'
import type {
  CompleteSearchList,
  TagList,
  TagItem,
  ExtendCurrentScreen,
  ExtendCurrentSearchInput,
  ItemList
} from '@/types/search'
import { filterHistory } from '@/network/apis/history'

export const useSearchStore = defineStore('search', () => {
  // 搜索页的主体列表
  const currentSearchList = ref<CompleteSearchList>({
    current: 0,
    offset: 0,
    total: 0,
    limit: 10,
    effectiveSize: 0,
    itemList: [],
    checkedItemList: []
  })

  // 筛选页中的标签列表
  const currentTagList: TagList = reactive({
    offset: 0,
    total: 0,
    limit: 10,
    tagsList: []
  })

  // 筛选页中的筛选条件
  const currentScreenData: ExtendCurrentScreen = reactive({
    offset: 0,
    total: 0,
    limit: 10,
    screenData: {
      // 1 空间 | 2 物品
      type: -1,
      lowPrice: -1,
      highPrice: -1,
      // 0 | 1
      dateType: -1,
      labelId: []
    }
  })

  // 输入框文字搜索
  const currentSearchInputData: ExtendCurrentSearchInput = reactive({
    offset: 0,
    total: 0,
    limit: 10,
    inputData: {
      name: ''
    }
  })

  // 给列表的每一项添加 isChecked 属性用于多选
  function setItemList(itemList: ItemList[] | TagItem[], startIndex: number, endIndex: number) {
    for (let i = startIndex; i < endIndex; i++) {
      itemList[i].isChecked = false
    }
  }

  // 更新数据后重新获取搜索页的主体列表
  async function resetSearchList(deleted: number) {
    // 不筛选直接执行多选删除
    if (currentSearchList.value.offset) {
      // currentSearchList.value.offset -= 1
      currentSearchList.value.offset = 0
      currentSearchList.value.itemList = []
      isDeleted.value ? await fetchDeletedItem() : await fetchNewSearchList(deleted)

      // 筛选后执行多选删除
    } else if (currentScreenData.offset) {
      // currentScreenData.offset -= 1
      currentScreenData.offset = 0
      await fetchScreenSearchList(deleted)

      // 输入框搜索后执行多选删除
    } else if (currentSearchInputData.offset) {
      // currentSearchInputData.offset -= 1
      currentSearchInputData.offset = 0
      await searchItemByInput(deleted)
    }

    // 为新列表重新添加 checked 属性
    setItemList(currentSearchList.value.itemList, 0, 10)
  }

  // 获取搜索初始全部物品列表
  async function fetchNewSearchList(deleted: number) {
    // 当前位置不是已删除列表
    isDeleted.value = false

    // 发起请求
    const data = await getAllItems(
      {
        offset: currentSearchList.value.offset + 1
      },
      deleted
    )
    if (data.current > data.pages) return

    // 获取当前用户ID并过滤数据
    const uuid = uni.getStorageSync('uuid')
    const filteredRecords = data.records.filter((item: any) => item.userId === uuid)

    // 更新列表
    currentSearchList.value.itemList.push(...filteredRecords)

    // 给新增的元素加上 isChecked 属性
    setItemList(
      currentSearchList.value.itemList,
      currentSearchList.value.itemList.length - filteredRecords.length,
      currentSearchList.value.itemList.length
    )

    // 更新 searchList 的 total 和 offset
    // 如果过滤后没有数据，可能需要调整分页逻辑
    if (filteredRecords.length === 0 && data.records.length > 0) {
      // 当前页没有当前用户的数据，尝试获取下一页
      currentSearchList.value.offset = data.current
      if (data.current < data.pages) {
        await fetchNewSearchList(deleted)
        return
      }
    }

    currentSearchList.value.total = data.total
    currentSearchList.value.effectiveSize = data.effectiveSize || 0
    // currentSearchList.value.current = data.current
    currentSearchList.value.offset = data.current
  }

  async function fetchDependceItems(deleted: number) {
    // 当前位置不是已删除列表
    isDeleted.value = false

    // 发起请求
    const data = await getDependceItems(
      {
        offset: currentSearchList.value.offset + 1
      },
      deleted
    )
    // 获取当前用户ID并过滤数据
    const uuid = uni.getStorageSync('uuid')
    const filteredRecords = data.records.filter((item: any) => item.userId === uuid)

    // 更新列表
    currentSearchList.value.itemList.push(...filteredRecords)

    // 给新增的元素加上 isChecked 属性
    setItemList(
      currentSearchList.value.itemList,
      currentSearchList.value.itemList.length - filteredRecords.length,
      currentSearchList.value.itemList.length
    )
    // 更新 searchList 的 total 和 offset
    // 如果过滤后没有数据，可能需要调整分页逻辑
    if (filteredRecords.length === 0 && data.records.length > 0) {
      // 当前页没有当前用户的数据，尝试获取下一页
      currentSearchList.value.offset = data.current
      if (data.current < data.pages) {
        await fetchDependceItems(deleted)
        return
      }
    }

    currentSearchList.value.total = data.total
    currentSearchList.value.effectiveSize = data.effectiveSize || 0
    currentSearchList.value.offset = data.current
  }
  // 获取筛选中的标签列表
  async function fetchTagList() {
    const data = await getAllTags({
      offset: currentTagList.offset + 1
    })
    // 更新标签列表
    currentTagList.tagsList = data.records
  }

  // 筛选物品
  async function fetchScreenSearchList(deleted: number, isRefresh = false) {
    // 如果是下拉刷新操作，重置分页
    if (isRefresh) {
      currentScreenData.offset = 0
    }

    const data = await searchByScreen(
      {
        offset: currentScreenData.offset + 1
      },
      currentSearchInputData.inputData,
      currentScreenData.screenData,
      deleted
    )

    // 获取当前用户ID并过滤数据
    const uuid = uni.getStorageSync('uuid')
    const filteredRecords = data.records.filter((item: any) => item.userId === uuid)

    // 筛选第一页则替换整个列表，否则追加
    if (currentScreenData.offset === 0 || isRefresh) {
      currentSearchList.value.itemList = filteredRecords
    } else {
      currentSearchList.value.itemList.push(...filteredRecords)
    }
    // 筛选后重置 currentSearchList 的 offset
    currentSearchList.value.offset = 0

    if (data.pages) {
      // 为新列表重新添加 isChecked 属性
      setItemList(
        currentSearchList.value.itemList,
        currentSearchList.value.itemList.length - filteredRecords.length,
        currentSearchList.value.itemList.length
      )
    }

    // 获取总数更新 searchList
    currentSearchList.value.total = data.total
    currentSearchList.value.effectiveSize = data.effectiveSize || 0
    // 更新当前页数
    currentScreenData.offset = data.current
  }

  //关联物品的筛选
  async function fetchDependceList(deleted: number) {
    // 关联物品筛选时，重置筛选
    currentScreenData.screenData.type = 2
    const data = await searchByScreen(
      {
        offset: currentScreenData.offset + 1
      },
      currentSearchInputData.inputData,
      currentScreenData.screenData,
      deleted
    )

    // 获取当前用户ID并过滤数据
    const uuid = uni.getStorageSync('uuid')
    const filteredRecords = data.records.filter((item: any) => item.userId === uuid)

    // 筛选第一页则替换整个列表，否则追加
    if (currentScreenData.offset === 0) {
      currentSearchList.value.itemList = filteredRecords
    } else {
      currentSearchList.value.itemList.push(...filteredRecords)
    }
    // 筛选后重置 currentSearchList 的 offset
    currentSearchList.value.offset = 0

    if (data.pages) {
      // 为新列表重新添加 isChecked 属性
      setItemList(
        currentSearchList.value.itemList,
        currentSearchList.value.itemList.length - filteredRecords.length,
        currentSearchList.value.itemList.length
      )
    }

    // 获取总数更新 searchList
    currentSearchList.value.total = data.total
    currentSearchList.value.effectiveSize = data.effectiveSize || 0
    // 更新当前页数
    currentScreenData.offset = data.current
  }

  // 输入框搜索物品
  async function searchItemByInput(
    deleted: number,
    isRepagination?: boolean,
    isRefresh = false,
    clearFilter = true
  ) {
    if (isRepagination || isRefresh) {
      currentSearchInputData.offset = 0
    }

    // 搜索时清空筛选条件，确保从全部数据开始搜索
    if (clearFilter) {
      currentScreenData.screenData = {
        type: -1,
        lowPrice: -1,
        highPrice: -1,
        dateType: -1,
        labelId: []
      }
    }

    const data = await searchByInput(
      {
        offset: currentSearchInputData.offset + 1
      },
      currentSearchInputData.inputData,
      currentScreenData.screenData,
      deleted
    )

    // 获取当前用户ID并过滤数据
    const uuid = uni.getStorageSync('uuid')
    const filteredRecords = data.records.filter((item: any) => item.userId === uuid)

    // 筛选第一页则替换整个列表，否则追加
    if (currentSearchInputData.offset === 0 || isRefresh) {
      currentSearchList.value.itemList = filteredRecords
    } else {
      currentSearchList.value.itemList.push(...filteredRecords)
    }

    // 搜索后重置 currentSearchList 的 offset
    currentSearchList.value.offset = 0

    if (data.pages) {
      setItemList(
        currentSearchList.value.itemList,
        currentSearchList.value.itemList.length - filteredRecords.length,
        currentSearchList.value.itemList.length
      )
    }

    // 获取总数更新 searchList
    currentSearchList.value.total = data.total
    currentSearchList.value.effectiveSize = data.effectiveSize || 0
    // 更新当前页数
    currentSearchInputData.offset = data.current
  }

  // 关联物品输入框搜索物品
  async function searchDependceItemByInput(deleted: number, isRepagination?: boolean) {
    // 关联物品搜索时，重置筛选
    currentScreenData.screenData = {
      type: 2,
      dateType: -1,
      highPrice: -1,
      lowPrice: -1,
      labelId: []
    }
    if (isRepagination) {
      currentSearchInputData.offset = 0
    }
    const data = await searchByInput(
      {
        offset: currentSearchInputData.offset + 1
      },
      currentSearchInputData.inputData,
      currentScreenData.screenData,
      deleted
    )
    console.log(currentScreenData)

    // 获取当前用户ID并过滤数据
    const uuid = uni.getStorageSync('uuid')
    const filteredRecords = data.records.filter((item: any) => String(item.userId) === uuid)

    // 筛选第一页则替换整个列表，否则追加
    if (currentSearchInputData.offset === 0) {
      currentSearchList.value.itemList = filteredRecords
    } else {
      currentSearchList.value.itemList.push(...filteredRecords)
    }

    // 搜索后重置 currentSearchList 的 offset
    currentSearchList.value.offset = 0

    if (data.pages) {
      setItemList(
        currentSearchList.value.itemList,
        currentSearchList.value.itemList.length - filteredRecords.length,
        currentSearchList.value.itemList.length
      )
    }

    // 获取总数更新 searchList
    currentSearchList.value.total = data.total
    currentSearchList.value.effectiveSize = data.effectiveSize || 0
    // 更新当前页数
    currentSearchInputData.offset = data.current
  }

  // 批量删除
  async function batchDeleteSearch(checkedItemList: number[], type: number) {
    await batchDelete(type, checkedItemList)
    // 重置列表
    currentSearchList.value.checkedItemList = []
    // 重新获取列表
    resetSearchList(1)
  }

  // 当前是否是已删除列表
  const isDeleted = ref(false)
  // 获取已删除物品
  async function fetchDeletedItem() {
    isDeleted.value = true
    const data = await getAllItems(
      {
        offset: currentSearchList.value.offset + 1
      },
      1
    )

    // 获取当前用户ID并过滤数据
    const uuid = uni.getStorageSync('uuid')
    const filteredRecords = data.records.filter((item: any) => String(item.userId) === uuid)

    currentSearchList.value.itemList.push(...filteredRecords)

    setItemList(
      currentSearchList.value.itemList,
      currentSearchList.value.itemList.length - filteredRecords.length,
      currentSearchList.value.itemList.length
    )
    currentSearchList.value.total = data.total
    currentSearchList.value.effectiveSize = data.effectiveSize || 0
    currentSearchList.value.offset = data.current
  }

  // 恢复已删除物品
  async function restoreDeletedItem(itemIds: number[]) {
    await reloadDeletedItems(itemIds)
    resetSearchList(1)
  }

  // 获取/查询历史记录（name 有值则搜索对应名字，搜索全部 name 为空）
  async function fetchHistoryItem(name: string) {
    console.log('111', currentSearchList.value.itemList)
    const data = await getAllHistory(
      {
        offset: currentSearchList.value.offset + 1
      },
      name
    )
    // 历史记录API本身就已经是用户相关的，不需要额外的用户ID过滤
    currentSearchList.value.itemList.push(...data.records)
    let lastPageNum = data.size
    if (data.current === data.pages) {
      lastPageNum = data.total % data.size
    }
    // 如果有数据则添加 isChecked 属性
    if (data.records.length !== 0) {
      setItemList(
        currentSearchList.value.itemList,
        currentSearchList.value.offset * data.size,
        currentSearchList.value.offset * data.size + lastPageNum
      )
    }
    currentSearchList.value.total = data.total
    currentSearchList.value.effectiveSize = data.effectiveSize || 0
    currentSearchList.value.offset = data.current
  }

  // 筛选物品的修改记录
  async function fetchScreenHistoryList(filterParams: any, isRefresh = false) {
    // 如果是下拉刷新操作，重置分页
    if (isRefresh) {
      currentScreenData.offset = 0
    }
    console.log('添加前的页数', currentScreenData.offset)
    console.log(filterParams)
    currentScreenData.offset = currentScreenData.offset + 1
    console.log('添加前:', [...currentSearchList.value.itemList])
    const data = await filterHistory(
      {
        offset: currentScreenData.offset + 1
      },
      filterParams
    )
    console.log(data)
    const newdata = JSON.parse(JSON.stringify(data))
    console.log(newdata.records)
    const NewDataList = newdata.records.map((item: any) => ({
      cover: item.itemCover,
      hide: 0,
      id: item.itemId,
      ischecked: false,
      name: item.itemName,
      privacy: item.privacy,
      type: 0,
      log: {
        username: item.modifierName,
        content: item.content,
        date: item.modifyTime,
        ip: null,
        id: null
      }
    }))
    console.log(NewDataList)
    // currentSearchList.value.itemList.push(...NewDataList)
    // NewDataList = []
    console.log(currentScreenData.offset)
    // 筛选第一页则替换整个列表， 否则追加
    if (currentScreenData.offset === 0) {
      currentSearchList.value.itemList = NewDataList
    } else {
      currentSearchList.value.itemList.push(...NewDataList)
    }
    console.log('添加后:', [...currentSearchList.value.itemList])
    console.log('添加后的页数', currentSearchList.value.offset)
    let lastPageNum = newdata.size
    if (newdata.current === newdata.pages) {
      lastPageNum = newdata.total % newdata.size
    }
    // 如果有数据则添加 isChecked 属性
    if (newdata.records.length !== 0) {
      setItemList(
        currentSearchList.value.itemList,
        currentSearchList.value.offset * newdata.size,
        currentSearchList.value.offset * newdata.size + lastPageNum
      )
    }
    currentSearchList.value.total = newdata.total
    currentSearchList.value.offset = newdata.current
  }

  return {
    currentSearchList,
    currentTagList,
    currentScreenData,
    currentSearchInputData,
    setItemList,
    fetchNewSearchList,
    fetchDependceItems,
    fetchScreenSearchList,
    fetchDependceList,
    fetchTagList,
    searchItemByInput,
    searchDependceItemByInput,
    batchDeleteSearch,
    fetchDeletedItem,
    restoreDeletedItem,
    fetchHistoryItem,
    fetchScreenHistoryList
  }
})
