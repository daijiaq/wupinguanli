import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import {
  getAllSettings,
  setPassword,
  updateSettings,
  clearPassword,
  getAccounts
} from '@/network/apis/settings'
import type { Settings, AccountsInfo } from '@/types/settings'
import { useUserStore } from '@/stores/user'
const user = useUserStore()

export const useSettingsStore = defineStore('settings', () => {
  // 基础设置
  const settingsInfo = ref<Settings>({
    allowManagement: 0,
    privacyDisplay: 0,
    unifiedPassword: 0
  })

  // 切换账号的列表数据
  const accountsInfo = ref<AccountsInfo[]>([
    // {
    //   id: '1',
    //   userId: 11,
    //   name: '用户111',
    //   avatar: '/static/avatar.png',
    //   qrCode: '',
    //   token: ''
    // },
    // {
    //   id: '2',
    //   userId: 12,
    //   name: '用户222',
    //   avatar: '/static/avatar.png',
    //   qrCode: '',
    //   token: ''
    // },
    // {
    //   id: '3',
    //   userId: 13,
    //   name: '用户333',
    //   avatar: '/static/avatar.png',
    //   qrCode: '',
    //   token: ''
    // }
  ])

  // 获取设置
  const initSettings = async () => {
    const data = await getAllSettings()
    settingsInfo.value.allowManagement = data.allowManagement
    settingsInfo.value.privacyDisplay = data.privacyDisplay
    settingsInfo.value.unifiedPassword = data.unifiedPassword
  }

  // 设置密码
  const setPasswordStore = async (password: string, type: 0 | 1) => {
    setPassword(password, type)
    if (type) settingsInfo.value.privacyDisplay = 1
    else settingsInfo.value.unifiedPassword = 1
  }

  // 修改设置
  const updateSettingsStore = (allowManagement: 0 | 1) => {
    updateSettings(allowManagement)
    settingsInfo.value.allowManagement = allowManagement
  }

  // 清空密码
  const clearPasswordStore = (type: 0 | 1) => {
    clearPassword(type)
    if (type) settingsInfo.value.privacyDisplay = 0
    else settingsInfo.value.unifiedPassword = 0
  }

  // 切换账号初始化
  const initSwitchAccounts = async (userId: number[]) => {
    const data = await getAccounts(userId)
    accountsInfo.value = data
    console.log(accountsInfo.value)
    console.log(user.passwordMap.size)
  }

  return {
    settingsInfo,
    accountsInfo,
    initSettings,
    setPasswordStore,
    updateSettingsStore,
    clearPasswordStore,
    initSwitchAccounts
  }
})
