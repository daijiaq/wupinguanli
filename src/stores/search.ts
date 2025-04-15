import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import {
  getAllItems,
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

export const useSearchStore = defineStore('search', () => {
  // 搜索页的主体列表
  const currentSearchList = ref<CompleteSearchList>({
    offset: 0,
    total: 0,
    limit: 10,
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
    // 更新列表
    currentSearchList.value.itemList.push(...data.records)
    let lastPageNum = data.size
    if (data.current === data.pages) {
      lastPageNum = data.total % data.size
    }
    // 给新增的元素加上 isChecked 属性
    setItemList(
      currentSearchList.value.itemList,
      currentSearchList.value.offset * data.size,
      currentSearchList.value.offset * data.size + lastPageNum
    )
    // 更新 searchList 的 total 和 offset
    currentSearchList.value.total = data.total
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
  async function fetchScreenSearchList(deleted: number) {
    const data = await searchByScreen(
      {
        offset: currentScreenData.offset + 1
      },
      currentSearchInputData.inputData,
      currentScreenData.screenData,
      deleted
    )

    // 筛选第一页则替换整个列表，否则追加
    if (currentScreenData.offset === 0) {
      currentSearchList.value.itemList = data.records
    } else {
      currentSearchList.value.itemList.push(...data.records)
    }
    // 筛选后重置 currentSearchList 的 offset
    currentSearchList.value.offset = 0

    // 获取最后一页的数量
    let lastPageNum = data.size
    if (data.current === data.pages) {
      lastPageNum = data.total % data.size
    }
    if (data.pages) {
      // 为新列表重新添加 isChecked 属性
      setItemList(
        currentSearchList.value.itemList,
        currentScreenData.offset * data.size,
        currentScreenData.offset * data.size + lastPageNum
      )
    }

    // 获取总数更新 searchList
    currentSearchList.value.total = data.total
    // 更新当前页数
    currentScreenData.offset = data.current
  }

  // 输入框搜索物品
  async function searchItemByInput(deleted: number, isRepagination?: boolean) {
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

    // 筛选第一页则替换整个列表，否则追加
    if (currentSearchInputData.offset === 0) {
      currentSearchList.value.itemList = data.records
    } else {
      currentSearchList.value.itemList.push(...data.records)
    }

    // 搜索后重置 currentSearchList 的 offset
    currentSearchList.value.offset = 0

    // 获取最后一页的数量
    let lastPageNum = data.size
    if (data.current === data.pages) {
      lastPageNum = data.total % data.size
    }
    if (data.pages) {
      setItemList(
        currentSearchList.value.itemList,
        currentSearchInputData.offset * data.size,
        currentSearchInputData.offset * data.size + lastPageNum
      )
    }

    // 获取总数更新 searchList
    currentSearchList.value.total = data.total
    // 更新当前页数
    currentSearchInputData.offset = data.current
  }

  // 批量删除
  async function batchDeleteSearch(checkedItemList: number[], type: number) {
    await batchDelete(type, checkedItemList)
    // 重置列表
    currentSearchList.value.checkedItemList = []
    // 重新获取列表
    resetSearchList(0)
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
    currentSearchList.value.itemList.push(...data.records)
    let lastPageNum = data.size
    if (data.current === data.pages) {
      lastPageNum = data.total % data.size
    }
    setItemList(
      currentSearchList.value.itemList,
      currentSearchList.value.offset * data.size,
      currentSearchList.value.offset * data.size + lastPageNum
    )
    console.log(currentSearchList.value.itemList)
    currentSearchList.value.total = data.total
    currentSearchList.value.offset = data.current
  }

  // 恢复已删除物品
  async function restoreDeletedItem(itemIds: number[]) {
    await reloadDeletedItems(itemIds)
    resetSearchList(1)
  }

  // 获取/查询历史记录（name 有值则搜索对应名字，搜索全部 name 为空）
  async function fetchHistoryItem(name: string) {
    const data = await getAllHistory(
      {
        offset: currentSearchList.value.offset + 1
      },
      name
    )
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
    currentSearchList.value.offset = data.current
  }

  return {
    currentSearchList,
    currentTagList,
    currentScreenData,
    currentSearchInputData,
    setItemList,
    fetchNewSearchList,
    fetchScreenSearchList,
    fetchTagList,
    searchItemByInput,
    batchDeleteSearch,
    fetchDeletedItem,
    restoreDeletedItem,
    fetchHistoryItem
  }
})
