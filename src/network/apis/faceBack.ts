// import type { Common } from '@/types/faceBack'
import type {
  FaceBack,
  TemporaryToken,
  FeedbackDTO,
  LatestVersionInfo,
  FeedbackVO,
  FeedbackResponse,
  FeedbackRequest,
  FeedbackTypeResponse,
  FeedbackTypeVo
} from '@/types/user'
import service, { uploadFileService } from '..'
/**
 *
 * @param type 反馈类型
 * @param imageUrl 反馈图片地址
 * @param content 反馈内容
 * @returns
 */
export const faceBackAPI = (content: string, imageUrl: string[], type = 6): Promise<FaceBack> => {
  return service({
    url: '/feedback',
    method: 'POST',
    data: {
      content,
      type,
      imageUrl,
      version: '1.1.0'
    }
  })
}
/**
 * 获取临时API
 */
export const getTemporaryTokenAPI = () => {
  return service<TemporaryToken>({
    url: '/valid/authentication',
    method: 'POST'
  })
}

export const feedBackAPI = (data: FeedbackDTO): Promise<FaceBack> => {
  return service({
    url: '/feedback',
    method: 'POST',
    data
  })
}

export const getVersionAPI = (): Promise<LatestVersionInfo> => {
  return service({
    // url: '/version/check/update',
    url: '/version/get/update/apk',
    method: 'GET'
  })
}

export const fetchFeedbackListAPI = (data: FeedbackRequest): Promise<FeedbackVO> => {
  const { type, offset, limit } = data
  return service({
    url: `/feedback/page?type=${type}&offset=${offset}&limit=${limit}`,
    method: 'POST'
  })
}

export const fetchFeedbackTypeAPI = (): Promise<FeedbackTypeResponse> => {
  return service({
    url: '/feedback/type',
    method: 'GET'
  })
}
