import service from '..'
import type { PasswordLoginForm } from '@/types/auth'
import type { UserInfo } from '@/types/user'

// 密码登录
export function loginByPassword(params: PasswordLoginForm): Promise<UserInfo> {
  return service({
    url: '/users/login/simple',
    method: 'POST',
    data: params
  })
}
