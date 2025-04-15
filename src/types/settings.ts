export interface Settings {
  /**
   * 是否默认接受共同管理物品(0关1开)
   */
  allowManagement: 0 | 1
  /**
   * 是否隐藏隐私物品(0关1开)
   */
  privacyDisplay: 0 | 1
  /**
   * 是否设置统一隐私密码(0关1开)
   */
  unifiedPassword: 0 | 1
}

export interface AccountsInfo {
  /**
   * uuid，带在 header
   */
  id: string
  /**
   * userId，用于请求
   */
  userId: number
  /**
   * 用户名
   */
  name: string
  /**
   * 头像
   */
  avatar: string
  /**
   * 二维码
   */
  qrCode: string
  /**
   * token
   */
  token: string
}
