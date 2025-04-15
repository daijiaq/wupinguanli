// import type { Common } from '@/types/faceBack'
import type { FaceBack, TemporaryToken } from '@/types/user'
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
