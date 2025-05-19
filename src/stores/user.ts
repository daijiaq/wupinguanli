import type { UserInfo } from '../types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, changeUserAvatar, changeUserName } from '@/network/apis/user'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const AuthStore = useAuthStore()
const { password } = storeToRefs(AuthStore)

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    avatar: '',
    id: '',
    phone: '',
    userId: 0,
    name: '',
    qrCode: ''
  })

  // 每个用户id对应一个password
  let passwordMap = new Map()

  async function fetchUserInfo() {
    userInfo.value = await getUserInfo()
    // console.log(userInfo.value)
    const storedData = uni.getStorageSync('passwordId')
    if (storedData) {
      const parsed = JSON.parse(storedData)
      passwordMap = new Map(parsed) // 恢复历史数据
      // console.log(passwordMap.keys())
    }
    const hasOtherKeys = Array.from(passwordMap.keys()).some((key) => key === userInfo.value.id)
    if (!hasOtherKeys) {
      password.value = uni.getStorageSync('password')
      passwordMap.set(userInfo.value.id, password.value)
    }
    // console.log(passwordMap.get(userInfo.value.id))
    // uni.removeStorageSync('passwordId')
    uni.setStorageSync('passwordId', JSON.stringify([...passwordMap]))
  }

  async function changeAvatar(files: string) {
    userInfo.value = await changeUserAvatar(files)
  }

  async function changeName(name: string) {
    userInfo.value = await changeUserName(name)
  }

  return {
    userInfo,
    passwordMap,
    fetchUserInfo,
    changeAvatar,
    changeName
  }
})
