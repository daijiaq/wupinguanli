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
  shareItemAPI
} from '@/network/apis/friend'
import type { Group, GetFriend, GroupsInfo, Log, Friend } from '@/types/friend'
import type { T1 } from '@/utils/typings'

export const useGroupStore = defineStore('group', () => {
  // 分组信息
  const groupsInfo = reactive<GroupsInfo>({
    current: 0,
    total: 100,
    pages: 0,
    size: 0,
    groupsData: []
  })

  // 获取所有分组
  async function getAllGroups(): Promise<void> {
    groupsInfo.groupsData = []
    do {
      const data = await getAllGroupsAPI({
        offset: groupsInfo.groupsData.length / 100 + 1
      })
      groupsInfo.groupsData.push(...data.records)
      groupsInfo.total = data.total
    } while (groupsInfo.groupsData.length < groupsInfo.total)
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

  // 当前页好友
  // const friend = ref<GetFriend>({
  //   id: 0,
  //   notes: '',
  //   name: '',
  //   userId: 0,
  //   avatar: '',
  //   qrCode: ''
  //     notes: '',
  // name: '',
  // // userId: 0,
  // avatar: '',
  // qrCode: '',
  // email: '',
  // phone: '',
  // buddy: false,
  // groupBaseInfo: {
  //   groupId: 0,
  //   groupName: ''
  // }
  // })

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

  // 临时好友数组
  const tempFriends = ref<Friend[]>([])

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
    shareItem
  }
})
