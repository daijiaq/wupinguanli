import type { UserInfo } from '../types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, changeUserAvatar, changeUserName } from '@/network/apis/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    avatar: '',
    id: '',
    phone: '',
    userId: 0,
    name: '',
    qrCode: ''
  })

  async function fetchUserInfo() {
    userInfo.value = await getUserInfo()
  }

  async function changeAvatar(files: string) {
    userInfo.value = await changeUserAvatar(files)
  }

  async function changeName(name: string) {
    userInfo.value = await changeUserName(name)
  }

  return {
    userInfo,
    fetchUserInfo,
    changeAvatar,
    changeName
  }
})
