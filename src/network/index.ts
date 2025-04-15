import { __API_TIMEOUT__, __BASE_URL__ } from '@/constant'

// 请求拦截器
const requestInterceptor = (options: UniApp.RequestOptions | UniApp.UploadFileOption) => {
  // 添加请求头
  options.header = {
    token: '',
    uuid: ''
  }
  const token = uni.getStorageSync('token')
  if (token) options.header.token = token
  const uuid = uni.getStorageSync('uuid')
  if (uuid) options.header.uuid = uuid

  return options
}

// uni.request 请求封装
const service = <T>(options: UniApp.RequestOptions): Promise<T> => {
  // 请求拦截
  requestInterceptor(options)

  // 发起请求
  return new Promise((resolve, reject) => {
    uni
      .request({
        url: __BASE_URL__ + options.url || '',
        method: options.method || 'GET',
        // data: 可传 Object | String | ArrayBuffer
        data: options.data || {},
        header: options.header || {},
        timeout: options.timeout || __API_TIMEOUT__
      })
      .then((res: any) => {
        switch (res.data.code) {
          case 200:
            resolve(res.data.data)
            break
          case 100:
            uni.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            reject(res.data.data)
            break
          case 101:
            uni.showToast({
              title: '您还未登录',
              icon: 'error'
            })
            // 重定向到登录页
            setTimeout(() => {
              uni.redirectTo({
                url: '/pages/login/login'
              })
            }, 1500)
            uni.removeStorageSync('token')
            uni.removeStorageSync('uuid')
            break
          case 400:
            uni.showToast({
              title: '客户端异常',
              icon: 'error'
            })
            break
          case 404:
            uni.showToast({
              title: '界面不存在',
              icon: 'error'
            })
            break
          case 500:
            uni.showToast({
              title: '服务端异常',
              icon: 'error'
            })
            break
          default:
            uni.showToast({
              title: '未知错误'
            })
            break
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// 加入拦截器，响应超时情况
uni.addInterceptor('request', {
  fail: () => {
    uni.showToast({
      title: '请求超时'
    })
  }
})

// uni.uploadFile 请求封装
export const uploadFileService = <T>(options: UniApp.UploadFileOption): Promise<T> => {
  // 请求拦截
  requestInterceptor(options)

  // 发起请求
  return new Promise((resolve, reject) => {
    uni
      .uploadFile({
        name: options.name || '',
        url: __BASE_URL__ + options.url || '',
        filePath: options.filePath || '',
        formData: options.formData || {},
        header: options.header || {},
        timeout: options.timeout || __API_TIMEOUT__
      })
      .then((res: any) => {
        // uni.uploadFile 返回的 res 是 string 类型，需要转换为对象
        const data = JSON.parse(res.data)
        switch (data.code) {
          case 200:
            resolve(data.data)
            break
          case 100:
            uni.showToast({
              title: data.msg,
              icon: 'error'
            })
            reject(res.data.data)
            break
          case 101:
            uni.showToast({
              title: '您还未登录',
              icon: 'error'
            })
            // 重定向到登录页
            setTimeout(() => {
              uni.redirectTo({
                url: '/pages/login/login'
              })
            }, 1500)
            uni.removeStorageSync('token')
            uni.removeStorageSync('uuid')
            break
          case 400:
            uni.showToast({
              title: '客户端异常',
              icon: 'error'
            })
            break
          case 404:
            uni.showToast({
              title: '界面不存在',
              icon: 'error'
            })
            break
          case 500:
            uni.showToast({
              title: '服务端异常',
              icon: 'error'
            })
            break
          default:
            uni.showToast({
              title: '未知错误'
            })
            break
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// 加入拦截器，响应超时情况
uni.addInterceptor('uploadFile', {
  fail: () => {
    uni.showToast({
      title: '请求超时'
    })
  }
})

export default service
