<template>
  <view>
    <u-navbar
      bgColor="transparent"
      placeholder
      title="意见反馈"
      titleStyle="font-weight:bold"
      autoBack
    ></u-navbar>
    <!-- 主要内容 -->
    <view class="faceBack">
      <view class="faceBack__title">
        <text class="faceBack__title__text">问题反馈</text>
      </view>
      <view class="faceBack__issue">
        <view class="faceBack__issue__textarea">
          <u-textarea
            :height="120"
            v-model="textarea"
            placeholder="添加描述和问题 截图使问题更容易解决哦"
            count
            focus
            border="none"
            :maxlength="200"
          ></u-textarea>
        </view>
        <!-- 图片上传 -->
        <u-upload
          :fileList="fileList1"
          @afterRead="afterRead"
          @delete="deletePic"
          name="1"
          multiple
          :previewFullImage="true"
          :maxCount="10"
          deletable
          sizeType
        >
        </u-upload>
      </view>
      <view class="faceBack__btn">
        <u-button
          @click="submit"
          type="primary"
          text="提交"
          size="middle"
          color="#579aff"
        ></u-button>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onShow, onReady } from '@dcloudio/uni-app'
import { ref, computed, onMounted } from 'vue'
import { faceBackAPI, getTemporaryTokenAPI } from '@/network/apis/faceBack'
import { photeUrl, uploadSDK } from '@/utils/SDK'

//拿到文字框的内容
const textarea = ref('')

//保存照片数组
const fileList1 = <any>ref([])

//删除图片
const deletePic = (event: any) => {
  //将数组中的方法移除
  fileList1.value.splice(event.index, 1)
}

//上传文件
const afterRead = async (event: any) => {
  //保存已有的图片
  let lists = [].concat(event.file)

  //当前的图片数量
  let fileListLen = fileList1.value.length

  //选中的照片数组
  lists.map((item: any) => {
    fileList1.value.push({
      ...item
    })
  })

  //判断照片是否合规
  if (!isPhotoSizeValid()) {
    uni.showToast({
      title: '照片过大，请重新上传',
      icon: 'none'
    })
  } else {
    return
  }
}

// 判断照片大小是否符合规范
const isPhotoSizeValid = () => {
  for (const item of fileList1.value) {
    if (item.size > 3 * 1024 * 1024) {
      return false
    }
  }
  return true
}
//点击提交
const submit = async () => {
  //判断是否为空
  if (textarea.value.trim() === '') {
    uni.showToast({
      title: '内容为空',
      icon: 'none'
    })
    textarea.value = ''
  } else {
    // 判断照片大小是否符合规范
    if (!isPhotoSizeValid()) {
      uni.showToast({
        title: '照片过大，请重新上传',
        icon: 'none'
      })
      return // 如果照片大小不符合规范，直接返回，不执行后续操作
    }

    // 发送图片上传请求
    //获取临时token
    const res = await getTemporaryTokenAPI()

    //文件上传到SDK
    await uploadSDK('feedback', res, fileList1)

    //发送网络请求
    await faceBackAPI(textarea.value, photeUrl.value)

    uni.showToast({
      title: '提交成功',
      icon: 'success'
    })

    //跳转页面
    setTimeout(() => {
      // 三秒后返回上一页
      wx.navigateBack({
        delta: 1 // 返回的页面数，1表示返回上一页
      })
    }, 3000)
  }
}
</script>

<style lang="scss" scoped>
.faceBack {
  margin: 20rpx 40rpx 0rpx 40rpx;
  &__title {
    font-size: 40rpx; /* 设置字号为14px */
    color: #505050;
    padding-top: 20px;
    border-bottom: 5rpx solid #f5f7ff; /* 底部边框，1像素宽，颜色可以根据需要调整 */
    padding-bottom: 20px; /* 文字距离底部的距离为20px */
    &__text {
      padding-left: 15rpx;
    }
  }
  &__issue {
    border-bottom: 5rpx solid #f5f7ff;
    padding-bottom: 20rpx;
    &__textarea {
      margin-bottom: 20rpx;
    }
  }
  &__btn {
    margin: 0 auto;
    font-size: 20rpx;
    width: 150rpx;
    margin-top: 100rpx;
    border-radius: 4rpx;
  }
}
.faceBack__issue__textarea {
  margin-bottom: 20rpx;
}
// .faceBack__issue {
//   background-color: red;
// }
</style>
