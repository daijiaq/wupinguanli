export interface Settings {
  /**
   * 是否默认接受共同管理物品(0关1开)
   */
  allowManagement: 0 | 1
  /**
   * 是否隐藏隐私物品(0关1开)
   */
  privacyItemInvisible: 0 | 1
  /**
   * 私密物品不可见是否设置过密码(0无1有)
   */
  privacyPassword: 0 | 1
  /**
   * 隐私物品通用密码是否开启（0关1开）
   */
  unifiedPasswordUsed: 0 | 1
  /**
   * 是否开启隐藏空间(0关1开)
   */
  privacyDisplay: 0 | 1
  /**
   * 隐藏空间是否设置过密码(0无1有)
   */
  displayPassword: 0 | 1
  /**
   * 通用密码是否设置过(0无1有)
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
