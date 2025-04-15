import type { FullUserInfo } from '../utils/typings'

export type BasicUserInfo = Pick<FullUserInfo, 'id' | 'avatar' | 'name' | 'qrCode'>

export interface UserInfo extends BasicUserInfo {
  /**
   * userId，用于请求
   */
  userId: number
  /**
   * 手机号
   */
  phone: string
  /**
   * token
   */
  token?: string
}
/**
 * 临时Token
 */
export interface TemporaryToken {
  credentials: Credentials
  requestId: string
  expiration: string
  startTime: number
  expiredTime: number
}
export interface Credentials {
  tmpSecretId: string
  tmpSecretKey: string
  sessionToken: string
  token: string
}
/**
 * 发送反馈
 */
interface FaceBack {
  /**
   * 反馈标题
   */
  title: string
  /**
   * 反馈内容
   */
  content: string
  /**
   * 反馈图片数组
   */
  imageUrl: string[]
}
