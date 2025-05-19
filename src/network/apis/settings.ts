import service from '..'
import type { Settings, AccountsInfo } from '@/types/settings'
import { LoginResponse } from '@/types/auth'

// 获取设置
export function getAllSettings(): Promise<Settings> {
  return service({
    url: '/settings'
  })
}

// 更改设置
export function updateSettings(allowManagement: 0 | 1): Promise<null> {
  return service({
    url: `/settings?type=${allowManagement}&open=0&wifi=0&recycleBin=0&privacyItemInvisible=0`,
    method: 'PUT'
  })
}

// 设置密码
export function setPassword(password: string, type: 0 | 1): Promise<null> {
  return service({
    url: `/settings/on/${type}?password=${password}`,
    method: 'PUT'
  })
}

// 清空设置密码
export function clearPassword(type: 0 | 1): Promise<null> {
  return service({
    url: `/settings/off/${type}`,
    method: 'PUT'
  })
}

// 验证设置密码
export function validatePassword(password: string, type: 0 | 1): Promise<null> {
  return service({
    url: `/settings/valid/${type}?password=${password}`
  })
}

// 验证用户密码
export function validateUserPassword(oldPassword: string): Promise<null> {
  return service({
    url: `/users/valid/password?password=${oldPassword}`
  })
}

// // 修改用户密码
// export function updateUserPassword(newPassword: string): Promise<null> {
//   return service({
//     url: `/users/change/password?password=${newPassword}`,
//     method: 'PUT'
//   })
// }

// 修改用户密码
export function updateUserPassword(oldPassword: string, newPassword: string): Promise<null> {
  return service({
    url: `/users/change/pwd?old_password=${oldPassword}&password=${newPassword}`,
    method: 'PUT'
  })
}

// 获取切换用户列表
export function getAccounts(userId: number[]): Promise<AccountsInfo[]> {
  return service({
    url: '/users/account',
    method: 'POST',
    data: userId
  })
}

export function changeToken(
  loginId: number,
  password: string,
  identify = 0
): Promise<LoginResponse> {
  return service({
    url: `/users/login/userId?loginId=${loginId}&password=${password}&identify=0`,
    method: 'PUT'
  })
}
