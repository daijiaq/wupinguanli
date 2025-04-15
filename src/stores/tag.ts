import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { TagsInfo } from '@/types/tag'
import { getAllTagsAPI, createTagAPI, deleteTagAPI, updateTagAPI } from '@/network/apis/tag'

export const useTagStore = defineStore('tag', () => {
  // 标签信息
  const tagsInfo = reactive<TagsInfo>({
    current: 0,
    total: 100,
    pages: 0,
    size: 0,
    tagData: []
  })

  // 获取所有标签
  async function getAllTags(): Promise<void> {
    tagsInfo.tagData = []
    do {
      const data = await getAllTagsAPI({
        offset: tagsInfo.tagData.length / 100 + 1
      })
      tagsInfo.tagData.push(...data.records)
      tagsInfo.total = data.total
    } while (tagsInfo.tagData.length < tagsInfo.total)
  }

  // 添加标签
  async function createTag(name: string, color: string): Promise<void> {
    await createTagAPI(name, color)
  }

  // 删除标签
  async function deleteTag(id: number): Promise<void> {
    await deleteTagAPI(id)
  }

  //更新标签
  async function updateTag(id: number, name: string, color: string): Promise<void> {
    await updateTagAPI(id, name, color)
  }

  return {
    tagsInfo,
    createTag,
    deleteTag,
    getAllTags,
    updateTag
  }
})
