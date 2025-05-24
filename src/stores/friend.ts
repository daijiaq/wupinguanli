import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import {
  createGroupAPI,
  getAllGroupsAPI,
  deleteGroupAPI,
  updateGroupAPI,
  addFriendAPI,
  getAllFriendsAPI,
  searchUserAPI,
  moveFriendAPI,
  updateFriendNoteAPI,
  batchDeleteFriendsAPI,
  deleteFriendAPI,
  getUserInfoAPI,
  getFriendLogsAPI,
  sendApplicationAPI,
  shareItemAPI,
  getGroupFriend
} from '@/network/apis/friend'
import type {
  Group,
  GetFriend,
  GroupsInfo,
  Log,
  Friend,
  PageGroup,
  getGroupFriendType,
  BuddyVO
} from '@/types/friend'
import type { T1 } from '@/utils/typings'

export const useGroupStore = defineStore('group', () => {
  // 分组信息
  const groupsInfo = reactive<PageGroup>({
    current: 0,
    total: 100,
    pages: 0,
    size: 0,
    records: []
  })

  // 获取所有分组
  async function getAllGroups(): Promise<void> {
    groupsInfo.records = []
    do {
      const data = await getAllGroupsAPI({
        offset: groupsInfo.records.length / 10 + 1
      })
      groupsInfo.records.push(...data.records)
      groupsInfo.total = data.total
      console.log(data)
    } while (groupsInfo.records.length < groupsInfo.total)
  }

  // 添加分组
  async function createGroup(name: string): Promise<T1> {
    return await createGroupAPI(name)
  }

  // 删除分组
  async function deleteGroup(id: number): Promise<void> {
    await deleteGroupAPI(id)
  }

  // 修改分组
  async function updateGroup(id: number, name: string): Promise<void> {
    await updateGroupAPI(id, name)
  }

  return {
    groupsInfo,
    createGroup,
    deleteGroup,
    getAllGroups,
    updateGroup
  }
})

export const useFriendStore = defineStore('friend', () => {
  // 添加好友
  async function addFriend(noticeId: number, groupId: number, notes: string): Promise<void> {
    await addFriendAPI(noticeId, groupId, notes)
  }
  //获取好友详情
  const getUserInfoData = async (userId: number) => {
    const res = await getUserInfoAPI(userId)
    friend.value = res
  }
  // 所有好友
  const friends = ref<Group[]>([])

  // 当前页分组
  const group = ref<T1>({
    id: 0,
    name: ''
  })

  // 根据id搜索陌生人返回的数据类型
  const friend = ref<Friend>({
    id: 0,
    notes: '',
    name: '',
    avatar: '',
    qrCode: '',
    // userId: 0,
    email: '',
    phone: '',
    buddy: false,
    groupBaseInfo: {
      groupId: 0,
      groupName: ''
    }
  })

  // 根据id搜索陌生人 数组
  const friendSearchArr = ref<Friend[]>([])

  // 临时好友数组
  const tempFriends = ref<BuddyVO[]>([])

  // 移动分组后刷新原分组数据
  const needRefresh = ref<boolean>(false)
  const oldGroupId = ref(0)

  //
  const setNeedRefresh = (value: boolean, groupId: number) => {
    needRefresh.value = value
    console.log('调用前', value)
    oldGroupId.value = groupId
    console.log(oldGroupId.value)
  }

  //获取所有好友
  async function getAllFriends(): Promise<void> {
    friends.value = await getAllFriendsAPI()
  }

  // 搜索用户
  async function searchUser(id: number): Promise<Friend> {
    return await searchUserAPI(id)
  }

  // 移动好友分组
  async function moveFriend(groupId: number, ids: number[]): Promise<void> {
    await moveFriendAPI(groupId, ids)
  }

  // 修改好友备注
  async function updateFriendNote(id: number, notes: string) {
    await updateFriendNoteAPI(id, notes)
  }

  // 批量删除好友
  async function batchDeleteFriends(ids: number[]) {
    await batchDeleteFriendsAPI(ids)
  }
  // 删除好友
  async function DeleteFriends(id: number) {
    await deleteFriendAPI(id)
  }

  // 获取好友日志
  async function getFriendLogs(id: number, content = ''): Promise<Log[]> {
    return await getFriendLogsAPI(id, content)
  }

  // 发送好友申请通知
  async function sendApplication(id: number, notes: string, validMessage: string, source: string) {
    await sendApplicationAPI(id, notes, validMessage, source)
  }

  async function shareItem(ItemId: number, friendId: number) {
    await shareItemAPI(ItemId, friendId)
  }

  // 批量移动分组好友id数组
  const moveIds: number[] = []

  //分页分组获取好友
  const groupFriendInfo = reactive<getGroupFriendType>({
    current: 0,
    total: 100,
    pages: 0,
    size: 0,
    records: []
  })

  // 存储每个分组的好友列表
  const groupFriendsMap = reactive<Record<number, getGroupFriendType>>({})

  // 初始化分组数据
  const initGroupFriendInfo = (groupId: number) => {
    if (!groupFriendsMap[groupId]) {
      groupFriendsMap[groupId] = {
        current: 0,
        total: 0,
        pages: 0,
        size: 0,
        records: [] // 每个分组独立存储
      }
    }
  }

  // 分页分组获取好友 好友信息
  const GroupFriend = ref<BuddyVO>({
    id: 0,
    notes: '',
    name: '',
    avatar: '',
    qrCode: '',
    groupId: 0,
    checked: false
  })

  // 根据分页分组获取好友
  async function getPageGroupFriend(groupId: number, offset: number, limit: number) {
    initGroupFriendInfo(groupId) // 确保分组数据已初始化
    const currentGroup = groupFriendsMap[groupId]
    // 清空当前分组的数据（避免重复加载）
    currentGroup.records = []
    do {
      const data = await getGroupFriend(groupId, offset, limit)
      currentGroup.records.push(...data.records) // 仅更新当前分组的数据
      currentGroup.total = data.total
    } while (currentGroup.records.length < currentGroup.total)
  }
  return {
    addFriend,
    getAllFriends,
    friends,
    searchUser,
    moveIds,
    moveFriend,
    friend,
    group,
    updateFriendNote,
    batchDeleteFriends,
    DeleteFriends,
    tempFriends,
    getUserInfoData,
    getFriendLogs,
    sendApplication,
    shareItem,
    getPageGroupFriend,
    groupFriendInfo,
    groupFriendsMap,
    GroupFriend,
    friendSearchArr,
    needRefresh,
    oldGroupId,
    setNeedRefresh
  }
})
