import COS from 'cos-wx-sdk-v5'
import { ref, type Ref } from 'vue'
/**
 *上传文件至腾讯云SDK，返回带有图片地址的数组
 * @param address 写入地址
 * @param res 临时Token
 * @param fileList1 选中的图片数组
 */

export const photeUrl = ref<string[]>([''])
export const avatarUrl = ref<string>('')

export const uploadSDK = (address: string, res: any, fileList1: Ref<any>) => {
  // 实例化COS
  const cos = new COS({
    SimpleUploadMethod: 'putObject',
    getAuthorization: function (options: any, callback: any) {
      callback({
        TmpSecretId: res.credentials.tmpSecretId,
        TmpSecretKey: res.credentials.tmpSecretKey,
        XCosSecurityToken: res.credentials.sessionToken,
        StartTime: res.startTime,
        ExpiredTime: res.expiredTime,
        expiration: res.expiration,
        requestId: res.requestId
      })
    }
  })

  // 清空数组
  photeUrl.value = []

  // 批量上传
  const promises = fileList1.value.map((file: any, i: any) => {
    return new Promise<void>((resolve) => {
      // 获取照片类型
      const urlTp = file.url.split('.')
      const urlPart = urlTp[urlTp.length - 1]

      // 获取当前的年月日
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = (currentDate.getMonth() + 1).toString() // 月份从 0 开始，所以要加 1
      const day = currentDate.getDate().toString().padStart(2, '0')

      // 当前时间
      const currentTimestamp = new Date().getTime()

      // 配置cos
      cos.postObject(
        {
          Bucket: 'smart-management-1310045286',
          Region: 'ap-guangzhou',
          Key: `${address}/${year}/${month}/${day}/${currentTimestamp}.${urlPart}`,
          FilePath: file.url
        },
        function (err: any, data: any) {
          if (err) {
            console.log('上传失败')
            resolve() // 解决Promise以确保异步操作完成
          } else {
            console.log('上传成功')
            // 当前地址
            const key = `https://szpic.lxtlovely.top/${address}/${year}/${month}/${day}/${currentTimestamp}.${urlPart}`
            // 图片地址数组
            photeUrl.value.push(key)
            resolve() // 解决Promise以确保异步操作完成
          }
        }
      )
    })
  })

  // 返回一个Promise，以便在异步操作完成后获取photeUrl
  return Promise.all(promises).then(() => photeUrl.value)
}
/**
 *更改头像
 * @param address 上传地址
 * @param res  临时Token
 * @param avatarPath 图片地址
 * @returns  SDK返回回来的图片地址
 */
export const AvatarSDk = async (address: string, res: any, avatarPath: string) => {
  return new Promise<string>((resolve) => {
    const cos = new COS({
      SimpleUploadMethod: 'putObject',
      getAuthorization: function (options: any, callback: any) {
        callback({
          TmpSecretId: res.credentials.tmpSecretId,
          TmpSecretKey: res.credentials.tmpSecretKey,
          XCosSecurityToken: res.credentials.sessionToken,
          StartTime: res.startTime,
          ExpiredTime: res.expiredTime,
          expiration: res.expiration,
          requestId: res.requestId
        })
      }
    })

    // 清空头像地址
    avatarUrl.value = ''

    // 获取图片类型
    const urlTp = avatarPath.split('.')
    const urlPart = urlTp[urlTp.length - 1]

    // 获取当前的年月日
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString() // 月份从 0 开始，所以要加 1
    const day = currentDate.getDate().toString().padStart(2, '0')

    // 当前时间
    const currentTimestamp = new Date().getTime()

    // 配置cos
    cos.postObject(
      {
        Bucket: 'smart-management-1310045286',
        Region: 'ap-guangzhou',
        Key: `${address}/${year}/${month}/${day}/${currentTimestamp}.${urlPart}`,
        FilePath: avatarPath
      },
      function (err: any, data: any) {
        if (err) {
          console.log('上传失败')
          resolve('')
        } else {
          console.log('上传成功')
          // 当前地址
          const key = `https://szpic.lxtlovely.top/${address}/${year}/${month}/${day}/${currentTimestamp}.${urlPart}`
          // 图片地址数组
          avatarUrl.value = key
          resolve(avatarUrl.value)
        }
      }
    )
  })
}
