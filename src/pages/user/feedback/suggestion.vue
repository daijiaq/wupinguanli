<template>
  <view>
    <u-navbar
      bgColor="transparent"
      placeholder
      title="意见反馈"
      titleStyle="font-weight:bold"
      autoBack
    >
    </u-navbar>
  </view>
  <view class="title">
    <text>产品开发建议</text>
  </view>
  <view class="textarea-box">
    <textarea
      class="textarea"
      v-model="feedbackContent"
      placeholder="请输入您的宝贵意见"
      placeholder-class="textarea-placeholder"
      maxlength="100"
    />
    <view class="counter">
      <text>{{ feedbackContent.length }}/100</text>
    </view>
  </view>
  <view class="image-upload">
    <view class="image-list">
      <view
        v-for="(image, index) in imageList"
        :key="index"
        class="image-preview"
        @click="previewImage(index)"
      >
        <image :src="image" mode="aspectFill" class="image-item" />
        <up-icon
          name="close"
          class="remove-btn"
          @click.stop="removeImage(index)"
          color="#fff"
          labelPos="right"
        />
      </view>
      <view v-if="imageList.length < 3" class="add-btn" @click="chooseImage"> +添加图片 </view>
    </view>
    <view class="counter">
      <text>{{ imageList.length }}/3</text>
    </view>
  </view>
  <view class="checkbox">
    <checkbox-group @change="onCheckChange">
      <checkbox value="allow" :checked="checked" class="checkBtn" />
    </checkbox-group>
    <text>允许开发者向您发送信息</text>
  </view>
  <view class="submit-button">
    <u-button type="primary" @click="submitFeedBack">提交</u-button>
  </view>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { feedBackAPI, getVersionAPI } from '@/network/apis/faceBack'
import { useSafeBack } from '@/stores/user'
// 反馈的文本
const feedbackContent = ref('')
const imageList = ref<string[]>([])
const checked = ref(false)
// 反馈的数据
const feedBackData = computed(() => ({
  content: feedbackContent.value,
  imageUrl: imageList.value,
  type: 5,
  version: '1.1.0',
  returninformation: false
}))
const safeback = useSafeBack('/pages/user/feedback/feedback')
// 添加反馈图片
function chooseImage() {
  uni.chooseImage({
    count: 3 - imageList.value.length,
    success: (res) => {
      imageList.value.push(...res.tempFilePaths)
    }
  })
}
// 预览反馈图片
function previewImage(index: number) {
  uni.previewImage({
    current: imageList.value[index],
    urls: imageList.value
  })
}
// 移除反馈图片
function removeImage(index: number) {
  imageList.value.splice(index, 1)
}

// 获取checkbox状态
function onCheckChange(event: any) {
  checked.value = event.detail.value.includes('allow')
  feedBackData.value.returninformation = checked.value
}

// 获取最新版本号
async function fetchVersion() {
  try {
    const res = await getVersionAPI()
    return res.version
  } catch (error) {
    console.error('Error fetching version:', error)
    return '1.1.0'
  }
}
// 提交反馈
async function submitFeedBack() {
  try {
    // 获取最新版本号
    feedBackData.value.version = (await fetchVersion()) || '1.1.0'
    await feedBackAPI(feedBackData.value)
    uni.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
    console.log('反馈上传成功')
    // 跳转回反馈界面
    setTimeout(() => {
      safeback()
    }, 1000)
  } catch (error) {
    console.error('Error submitting feedback:', error)
  }
}
</script>
<style lang="scss">
$width: 80%;
.title {
  width: $width;
  height: 60rpx;
  text-align: left;
  margin: 60rpx auto;
}
.textarea-box {
  width: $width;
  height: 240rpx;
  margin: 0 auto;
  .counter {
    height: 30rpx;
    text-align: right;
  }
}
%img {
  width: 150rpx;
  height: 150rpx;
  margin-right: 10rpx;
  border-radius: 30rpx;
}

.image-upload {
  display: flex;
  width: $width;
  height: 200rpx;
  margin: 120rpx auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .image-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .image-preview {
      position: relative;
      @extend %img;
      .image-item {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 30rpx;
        cursor: pointer;
      }
      .remove-btn {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
      }
    }
    .add-btn {
      @extend %img;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(242, 242, 242);
      color: #666;
      font-size: 24rpx;
      cursor: pointer;
    }
  }
  .counter {
    height: 30rpx;
    text-align: right;
  }
}
.checkbox {
  width: $width;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.submit-button {
  width: 200rpx;
  border-radius: 30rpx;
  margin: 20rpx auto;
  text-align: center;
}
</style>
