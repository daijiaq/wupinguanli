<template>
  <view class="form">
    <u-navbar titleWidth="250rpx" :title="'共同编辑'" bgColor="#f6f6f6" :autoBack="true" />
    <view class="form__information">
      <u-row customStyle="margin-bottom: 10px">
        <u-col span="10.5">
          <u-text color="#353535" :bold="true" text="隐私" />
        </u-col>
        <u-col span="1.5">
          <u-switch :disabled="false" v-model="form.privacy" size="20" :activeValue="true" />
        </u-col>
      </u-row>
      <u-row customStyle="margin-bottom: 10px">
        <u-col span="10.5">
          <u-text color="#353535" :bold="true" text="移入隐藏空间" />
        </u-col>
        <u-col span="1.5">
          <u-switch
            :disabled="false"
            v-model="moveToHiddenSpaceSwitch"
            size="20"
            :activeValue="true"
          />
        </u-col>
      </u-row>
      <u-modal
        :show="showMoveToHiddenModal"
        @confirm="confirmMoveToHidden"
        @cancel="cancelMoveToHidden"
        :showCancelButton="true"
      >
        是否确定移入隐藏空间
      </u-modal>
      <PasswordPopup
        :popup="popup"
        @close="popup = false"
        @confirmGesture="confirmGesture"
        @confirmNumber="confirmNumber"
      />
      <FormInput
        :type="'text'"
        :name="'状态'"
        :maxLength="30"
        :disabled="false"
        :placeHolder="'输入物品状态'"
        v-model:input="form.state"
      >
        <template #icon>
          <u-icon
            @click="showToast()"
            name="question-circle"
            customStyle="position: absolute;top:-5px;left:30px"
          />
        </template>
      </FormInput>
      <u-toast ref="toast"></u-toast>
      <u-row class="form__row" align="center" @click="openTagSelector">
        <u-col span="2">
          <u-text color="#353535" :bold="true" text="标签" />
        </u-col>
        <u-col span="10">
          <div class="tag-content">
            <template v-if="form.labels.length">
              <FormTag
                v-for="(item, index) in form.labels"
                :checked="true"
                :tag="item"
                :key="index"
                :shape="'square'"
              />
            </template>
            <template v-else>
              <span class="tag-placeholder">点击加入标签</span>
            </template>
          </div>
        </u-col>
      </u-row>
      <u-popup :show="showTagSelector" mode="bottom" @close="showTagSelector = false">
        <view class="tag-selector-popup">
          <template v-if="availableTags.length">
            <view class="tag-list">
              <FormTag
                v-for="(tag, idx) in availableTags"
                :key="tag.id || tag.name || idx"
                :tag="tag"
                :checked="form.labels.some((t) => t.id === tag.id)"
                @click.stop="toggleTag(tag)"
              />
            </view>
          </template>
          <template v-else>
            <view class="no-tags">暂无标签可选</view>
          </template>
        </view>
      </u-popup>
      <u-row class="form__row" align="center" @click="openSpace">
        <u-col span="3">
          <u-text color="#353535" :bold="true" text="从属空间" />
        </u-col>
        <u-col span="10">
          <div class="space-path-content">
            <template v-if="form.path.length">
              <span v-for="(item, idx) in [...form.path]" :key="item.id">
                {{ item.name }}<span v-if="idx < form.path.length - 1"> &gt; </span>
              </span>
            </template>
            <template v-else>
              <span class="space-path-placeholder">点击选择空间</span>
            </template>
          </div>
        </u-col>
      </u-row>
      <!-- 多层级空间选择弹框 -->
      <u-popup :show="showSpace" mode="bottom" @close="cancelSpace">
        <view class="space__subordinateSpace">
          <view class="space__subordinateSpace__title">
            <u-text bold size="40rpx" :text="'从属空间'" />
          </view>
          <view class="space__subordinateSpace__confirm">
            <u-text @click="cancelSpace" lines="1" size="20rpx" :text="'取消'" />
            <u-line margin="15rpx 20rpx" color="#efeff2" length="50%" direction="col"></u-line>
            <u-text @click="confirmSpace" color="#82b4fe" lines="1" size="20rpx" :text="'确认'" />
          </view>
        </view>
        <view class="space__subordinateSpace__currentSpace">
          <view class="space__subordinateSpace__currentSpace__icon">
            <u-icon size="27rpx" name="play-right-fill" color="#3988ff"></u-icon>
          </view>
          <text
            style="font-weight: 600"
            v-for="(item, index) in spacesBox.slice(0, pathFloor)"
            :key="item.id"
          >
            {{ item.name }}<text v-if="index < pathFloor - 1"> >&nbsp; </text>
          </text>
        </view>
        <view v-show="showSpace && !pathsLoading" class="space__subordinateSpace__floor">
          <SubordinateSpaceItem
            v-for="(item, subIndex) in pathsInfo"
            :ids="formStore.ids"
            :titlePadding="'10rpx 40rpx'"
            :tagPadding="'0 70rpx'"
            v-show="pathFloor >= subIndex"
            @radioClick="radioClick"
            :parent="subIndex && spacesBox[subIndex - 1] ? spacesBox[subIndex - 1].id : 0"
            :id="spacesBox[subIndex] ? spacesBox[subIndex].id : 0"
            :subordinateSpaces="item"
            :key="subIndex"
            :floor="subIndex + 1"
            :currentFloor="pathFloor"
          />
        </view>
      </u-popup>
      <u-text color="#353535" customStyle="margin-bottom: 10px" :bold="true" text="备注" />
      <FormPhoto
        :size="'200rpx'"
        v-model:photoList="form.figures"
        :disabled="false"
        class="form__information__photo"
        :previewType="'localUrl'"
      />
      <u-textarea
        maxlength="200"
        :count="true"
        :autoHeight="true"
        border="none"
        v-model="form.comment"
        placeholder="补充描述该物品/空间"
        :disabled="false"
      />
    </view>
    <view class="form__submit">
      <u-button
        :loading="isLoading"
        loadingText="修改中"
        @click="submitMultiple"
        type="primary"
        text="确认"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useFormStore } from '@/stores/form'
import type { ItemModifyRequest } from '@/types/form'
import FormInput from '@/components/Form/FormInput/FormInput.vue'
import PasswordPopup from '@/components/PasswordPopup/PasswordPopup.vue'
import FormTag from '@/components/Form/FormTag/FormTag.vue'
import FormPhoto from '@/components/Form/FormPhoto/FormPhoto.vue'
import { getDetailItemAPI } from '@/network/apis/space'
import SubordinateSpaceItem from '@/components/Space/SubordinateSpaceItem/SubordinateSpaceItem.vue'
import { useSpaceStore } from '@/stores/space'

const formStore = useFormStore()
const { batchUpdateItems } = formStore
const spaceStore = useSpaceStore()
const { getAllPaths, pathsInfo } = spaceStore
// 隐私——密码框的弹出
const popup = ref(false)
// 存隐私密码
const PIN = ref('')
// 手势密码
const confirmGesture = (password: number) => {
  PIN.value = password.toString()
}
// 数字密码
const confirmNumber = (password: number) => {
  PIN.value = password.toString()
}
// 移入隐藏的确认弹框
const showMoveToHiddenModal = ref(false)
// 移入隐藏的开关
const moveToHiddenSpaceSwitch = ref(false)
// 移入隐藏的值
const moveToHiddenSpace = ref(false)
// 标签选择的底部弹框
const showTagSelector = ref(false)
// 可选标签列表
const selectedItems = ref<any>([]) // 存所有选中物品详情
const availableTags = ref<any>([]) // 存所有去重后的标签
// 从属空间底部弹框
const showSpace = ref(false)
// 存储当前路径
const spacesBox = ref([])
// 当前层数
const pathFloor = ref(0)
// 路径加载
const pathsLoading = ref(true)
// 修改状态加载
const isLoading = ref(false)
const toast = ref()
const showToast = (): void => {
  toast.value.show({
    message: "用于描述物品的使用状态,比如可以填入'五成新'、'未使用过'、'已借出'等"
  })
}
const form = reactive({
  hide: 0,
  privacy: 0,
  state: '',
  labels: [],
  path: [],
  comment: '',
  figures: []
})
// 共同编辑有改数据才传参，不然不传，以免更改了原本的数据
const getNonEmptyFields = (form: Record<string, any>) => {
  const result: Record<string, any> = {}
  // 遍历表单对象的所有键
  Object.keys(form).forEach((key) => {
    const value = form[key]
    // 只要有值（非空字符串、非undefined、非null、非空数组）就传
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === 'string' && value.trim() === '') &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      result[key] = value
    }
  })
  return result
}
// 确认提交
async function submitMultiple() {
  try {
    const tempForm = getNonEmptyFields({
      hide: form.hide,
      privacy: form.privacy,
      state: form.state,
      labels: form.labels,
      comment: form.comment,
      figures: form.figures.map((item: any) => ({ id: item.id, url: item.url })),
      password: form.privacy ? PIN.value : '',
      path: form.path
    })
    if (Object.keys(tempForm).length === 0) {
      uni.showToast({ title: '未做任何更改', icon: 'none' })
      return
    }
    isLoading.value = true
    await batchUpdateItems(formStore.ids, tempForm)
    isLoading.value = false
    successCallback()
  } catch {
    isLoading.value = false
  }
}

// 监听移入隐藏开关变化
watch(
  () => moveToHiddenSpaceSwitch.value,
  (val, oldVal) => {
    // 只在从false切到true时弹窗
    if (val && !oldVal) {
      showMoveToHiddenModal.value = true
    } else {
      moveToHiddenSpace.value = val
    }
  }
)
// 确认移入隐藏
const confirmMoveToHidden = () => {
  moveToHiddenSpace.value = true
  showMoveToHiddenModal.value = false
  form.hide = 1
}
// 取消移入隐藏
const cancelMoveToHidden = () => {
  moveToHiddenSpaceSwitch.value = false
  moveToHiddenSpace.value = false
  showMoveToHiddenModal.value = false
  form.hide = 0
}
// 如果打开了隐私，弹出弹框否则清空密码
watch(
  () => form.privacy,
  () => {
    if (form.privacy) popup.value = true
    else PIN.value = ''
  }
)
// 如果弹窗关闭了，并且用户没有设置密码 则关闭隐私开关
watch(
  () => popup.value,
  () => {
    if (!popup.value && !PIN.value) form.privacy = 0
  }
)
const successCallback = (): void => {
  uni.showToast({
    title: '修改成功',
    icon: 'success',
    duration: 1000
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
// 页面参数处理(scanItem页面是通过传参传递所选物品id的)
onLoad((options) => {
  if (options?.ids) {
    formStore.ids = options.ids.split(',').map((id: any) => Number(id))
  }
})

onMounted(async () => {
  await getAllPaths() // 先获取pathsInfo
  if (formStore.ids && formStore.ids.length) {
    const detailList = await Promise.all(formStore.ids.map((id) => getDetailItemAPI(id, '')))
    selectedItems.value = detailList
    // 合并所有物品的标签并去重
    const tagSet = new Map()
    detailList.forEach((item) => {
      ;(item.labels || []).forEach((tag) => {
        tagSet.set(tag.id, tag)
      })
    })
    availableTags.value = Array.from(tagSet.values())
    // 初始化spacesBox和pathFloor，保证正序
    if (detailList.length > 0) {
      let fullPath = findFullPath([...detailList[0].path].reverse(), pathsInfo)
      while (fullPath.length < pathsInfo.length) {
        fullPath.push({ fatherId: 0, id: 0, name: '', layer: 0 })
      }
      spacesBox.value = fullPath
      pathFloor.value = detailList[0].path.length
    }
    console.log(spacesBox.value, pathFloor.value)
  }
})
// 打开底部标签展示弹框
const openTagSelector = () => {
  showTagSelector.value = false // 先关闭，确保能重新打开
  setTimeout(() => {
    showTagSelector.value = true
  }, 0)
}
// 切换标签的选中状态
const toggleTag = (tag: any) => {
  // 查找当前标签是否已存在于 form.labels 中
  const idx = form.labels.findIndex((t: any) => t.id === tag.id)
  // 找到——删除 否则添加
  if (idx > -1) {
    form.labels.splice(idx, 1)
  } else {
    form.labels.push(tag)
  }
  // 不再自动关闭弹窗
}

// // 打开从属空间弹框
const openSpace = async () => {
  showSpace.value = true
  pathsLoading.value = false
}
// 选择空间层级
const radioClick = (index: number, floor: number) => {
  if (
    spacesBox.value[floor - 1] &&
    spacesBox.value[floor - 1].id === pathsInfo[floor - 1][index].id
  ) {
    pathFloor.value = floor - 1
    spacesBox.value.splice(floor - 1)
  } else {
    pathFloor.value = floor
    spacesBox.value[floor - 1] = pathsInfo[floor - 1][index]
    spacesBox.value.splice(floor)
  }
}
// 弹框确认选择空间
const confirmSpace = () => {
  form.path = spacesBox.value.slice(0, pathFloor.value).map((item: any) => ({
    id: item.id,
    name: item.name
  }))
  showSpace.value = false
}
// 取消选择空间
const cancelSpace = () => {
  showSpace.value = false
}
const findFullPath = (pathArr: any, pathsInfo: any) => {
  return pathArr.map((p: any) => {
    for (const layerArr of pathsInfo) {
      const found = layerArr.find((item: any) => item.id === p.id)
      if (found) return found
    }
    return p
  })
}
</script>

<style lang="scss">
.form {
  padding: 30rpx;
  background-color: #f6f6f6;
  padding-top: 200rpx;
  height: 100vh;
  &__information {
    border-radius: 30rpx;
    background-color: #fff;
    padding: 20rpx;
    margin-bottom: 30rpx;
  }
  &__submit {
    margin: 0 auto;
    width: 200rpx;
  }
  &__row {
    margin-bottom: 10px;
  }
  &__information__tag {
    padding: 0;
  }
  &__information__subordinateSpace {
    max-height: 200px;
    overflow-y: auto;
  }
}
.form__row,
.tag-row,
.space-path-content {
  margin-bottom: 24rpx;
}
.tag-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 48rpx;
  gap: 16rpx;
  position: relative;
  margin-bottom: 30rpx;
}
.tag-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 48rpx;
  gap: 16rpx;
}
.tag-placeholder {
  color: #97999c;
  font-size: 30rpx;
  line-height: 48rpx;
  display: inline-block;
}
.abs-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  height: 48rpx;
  display: flex;
  align-items: center;
}
.tag-selector-popup {
  padding: 30rpx;
  min-height: 320rpx;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx 24rpx;
}
.no-tags {
  text-align: center;
  color: #bbb;
  padding: 40rpx 0;
}
.form__row_space {
  margin-top: 20rpx;
}
.space-selector-popup {
  padding: 30rpx;
  min-height: 320rpx;
}
.space-path-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 26rpx;
  min-height: 18rpx;
  white-space: normal;
  word-break: break-all;
  width: 100%;
  max-width: 515rpx;
  overflow-wrap: break-word;
}
.space-path-placeholder {
  color: #97999c;
  font-size: 30rpx;
  line-height: 48rpx;
  display: inline-block;
}
.space__subordinateSpace {
  padding: 30rpx;
  padding-bottom: 0;
  display: flex;
  flex-wrap: wrap;
}
.space__subordinateSpace__title {
  width: 550rpx;
}
.space__subordinateSpace__confirm {
  width: 140rpx;
  display: flex;
}
.space__subordinateSpace__currentSpace {
  padding: 10rpx 30rpx;
  display: flex;
  flex-wrap: wrap;
}
.space__subordinateSpace__currentSpace__icon {
  margin-top: 9rpx;
  margin-right: 10rpx;
}
.space__subordinateSpace__floor {
  max-height: 190px;
  overflow-y: auto;
}
</style>
