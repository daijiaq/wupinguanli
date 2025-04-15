import dayjs from 'dayjs'
// 节流函数
export function throttle(func: () => void, delay: number): () => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastExecTime = 0

  return function () {
    const currentTime = Date.now()
    const elapsedTime = currentTime - lastExecTime

    if (elapsedTime > delay) {
      func()
      lastExecTime = currentTime
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(func, delay - elapsedTime)
    }
  }
}

// 格式化事件
export const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}
