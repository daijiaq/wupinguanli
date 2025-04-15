import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAuthStore = defineStore('auth', () => {
  // 是否需要登录
  const toLogin = ref(false)
  // 是否已登录
  const logined = ref(false)

  return { toLogin, logined }
})
