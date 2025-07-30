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

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeoutId = undefined
      if (!immediate) {
        func.apply(this, args)
      }
    }

    const callNow = immediate && !timeoutId

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(later, delay)

    if (callNow) {
      func.apply(this, args)
    }
  }
}

// 格式化事件
export const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}
