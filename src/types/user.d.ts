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
// 反馈响应
export interface FeedbackDTO {
  /**
   * 反馈内容
   */
  content: string | null
  /**
   * 反馈图片
   */
  imageUrl: string[] | null
  /**
   * 反馈类型
   * 1无法打开小程序
     2小程序闪退
     3页面加载慢
     4其他异常
     5产品开发建议
     else(不是1到5)：意见反馈
   */
  type: number | null
  /**
   * 版本号
   */
  version: string | null
  /**
   * 是否允许开发者向用户发送信息
   */
  returninformation: boolean | null
}
// 版本信息
export interface VersionInfo {
  versionId: integer | null
  version: string | null
  fixContent: string | null
  publishTime: string | null
  apkUrl: string | null
  state: integer | null
}

// 最新版本安装包信息
export interface LatestVersionInfo {
  version: string | null
  apkUrl: string | null
}

// 反馈列表请求参数
export interface FeedbackRequest {
  type: integer | null
  offset: integer | null
  limit: integer | null
}

// 反馈列表响应
export interface FeedbackResponse {
  //Http状态码
  code: number | null
  //返回的数据对象
  data: FeedbackVO[] | null
  //返回的状态信息
  msg: null | string
  [property: string]: any
}

// 反馈列表项
export interface FeedbackVO {
  /**
   * 反馈内容
   */
  content?: null | string
  /**
   * 开发者回复
   */
  developerReply?: null | string
  feedbackId?: number | null
  /**
   * 反馈时间
   */
  feedTime?: null | string
  /**
   * 反馈图片
   */
  imageUrls?: string[] | null
  /**
   * 回复时间
   */
  replyTime?: null | string
  /**
   * 是否允许开发者向用户发送信息
   */
  returnInformation?: boolean | null
  /**
   * 反馈状态，0为未读，1为已读未回复 2已读已回复
   */
  state?: State
  /**
   * 反馈类型(对应标题)
   * 1无法打开小程序
   * 2小程序闪退
   * 3页面加载慢
   * 4其他异常
   * 5产品开发建议
   * else(不是1到5)：意见反馈
   */
  type?: number | null
  /**
   * 反馈者
   */
  userId?: number | null
  /**
   * 版本号
   */
  version?: null | string
  [property: string]: any
}

/**
 * 反馈状态，0为未读，1为已读未回复 2已读已回复
 */
export enum State {
  Read = 'READ',
  Unread = 'UNREAD'
}

// 反馈类型响应
export interface FeedbackTypeResponse {
  /**
   * Http状态码
   */
  code?: number | null
  /**
   * 返回的数据对象
   */
  data?: FeedbackTypeVo
  /**
   * 返回的状态信息
   */
  msg?: null | string
  [property: string]: any
}

/**
 * 返回的数据对象
 */
export interface FeedbackTypeVo {
  /**
   * 反馈类型字符串
   * 000000
   * 第一位:无法打开小程序
   * 第二位:小程序闪退
   * 第三位:页面加载慢
   * 4第四位:其他异常
   * 5第五位:产品开发建议
   * 第六位:意见反馈
   */
  types: string | null
  [property: string]: any
}
