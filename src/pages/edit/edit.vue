<template>
  <view class="form">
    <u-form errorType="toast" :rules="rules" :model="formStore.tempItemData" ref="formVerify">
      <!-- 表单验证 -->
      <u-form-item prop="name" />
      <u-navbar titleWidth="250rpx" :title="title" bgColor="#f6f6f6" :autoBack="true" />
      <view class="form__photo">
        <FormPhoto
          :size="'310rpx'"
          v-model:photoList="formStore.tempItemData.images"
          :disabled="false"
        />
      </view>
      <view class="form__information">
        <u-row customStyle="margin-bottom: 10px">
          <u-col span="2">
            <u-text :bold="true" text="属性" />
          </u-col>
          <u-col span="6">
            <u-radio-group
              :disabled="formStore.tempItemData.type === 0"
              v-model="radioValue"
              placement="row"
              shape="square"
            >
              <u-radio :customStyle="{ marginRight: '20rpx' }" label="空间" name="空间" />
              <u-radio :customStyle="{ marginRight: '20rpx' }" label="物品" name="物品" />
            </u-radio-group>
          </u-col>
        </u-row>
        <FormInput
          :type="'text'"
          :name="'名称'"
          :maxLength="30"
          :disabled="false"
          :placeHolder="'最多输入三十字'"
          v-model:input="formStore.tempItemData.name"
        />
        <u-row>
          <u-col span="2">
            <u-text color="#353535" :bold="true" text="二维码" />
          </u-col>
          <u-col span="10">
            <u-icon @click="showCode = true" name="grid"></u-icon>
          </u-col>
          <u-popup
            overlayOpacity="0"
            :safeAreaInsetBottom="false"
            round="30rpx"
            mode="center"
            :show="showCode"
            @close="showCode = false"
          >
            <view class="form__information__code">
              <view class="form__information__code__text">
                <u-text size="28rpx" color="#000" align="center" text="将物品二维码发送给好友" />
                <u-button
                  disabled
                  customStyle="border:none;width:50rpx;"
                  open-type="share"
                  icon="share"
                />
              </view>
              <image class="form__information__code__img" :src="formStore.tempItemData.qrCode" />
            </view>
          </u-popup>
        </u-row>
      </view>
      <view class="form__information">
        <u-row customStyle="margin-bottom: 10px">
          <u-col span="10.5">
            <u-text color="#353535" :bold="true" text="隐私" />
          </u-col>
          <u-col span="1.5">
            <u-switch :disabled="false" v-model="privacy" size="20" :activeValue="true" />
          </u-col>
        </u-row>
        <PasswordPopup
          :popup="popup"
          @close="popup = false"
          @confirmGesture="confirmGesture"
          @confirmNumber="confirmNumber"
        />
        <FormShow
          v-model:show="showTag"
          @click="changeTag = true"
          :name="'标签'"
          :show-jump="true"
        />
        <view v-show="showTag" class="form__information__tag">
          <FormTag
            v-for="(item, index) in formStore.tempItemData.labels"
            :checked="true"
            :tag="item"
            :key="index"
            :shape="'square'"
          ></FormTag>
        </view>
        <u-row customStyle="margin-bottom: 10px" v-if="formStore.currentFloor === 1">
          <u-col span="2">
            <u-text color="#353535" :bold="true" text="定位" />
          </u-col>
          <u-col span="10" @click="chooseLocation">
            <u-input
              placeholder="点击定位"
              border="none"
              disabled
              :disabledColor="'#fff'"
              v-model="formStore.tempItemData.address"
            />
          </u-col>
        </u-row>
        <FormInput
          :type="'number'"
          :name="'金额'"
          :maxLength="10"
          :disabled="false"
          :placeHolder="'请输入金额'"
          :unitName="'元'"
          v-model:input="formStore.tempItemData.price"
          :span="4"
        />
        <FormInput
          v-if="formStore.tempItemData.type"
          :type="'number'"
          :name="'数量'"
          :maxLength="10"
          :disabled="false"
          :placeHolder="'请输入数量'"
          v-model:input="formStore.tempItemData.count"
        />
        <FormDate :can-click="true" v-model:date="date" />
        <FormInput
          :type="'text'"
          :name="'链接'"
          :maxLength="100"
          :disabled="false"
          :placeHolder="'输入物品/空间的购买链接'"
          v-model:input="formStore.tempItemData.url"
          :display="!false"
        />
        <FormInput
          :type="'text'"
          :name="'状态'"
          :maxLength="30"
          :disabled="false"
          :placeHolder="'输入物品状态'"
          v-model:input="formStore.tempItemData.state"
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
      </view>
      <view v-if="formStore.tempItemData.type" class="form__information">
        <FormShow
          v-model:show="showAssociate"
          @click="jumpPageAssociate"
          :name="'关联物品'"
          :show-jump="true"
        />
        <view v-show="showAssociate" class="form__information__items">
          <view
            v-for="(item, index) in formStore.tempItemData.items"
            :key="index"
            class="form__information__items__item"
          >
            <u-avatar size="80rpx" :src="item.cover"></u-avatar>
            <u-text size="20rpx" lines="1" :bold="true" align="center" :text="item.name" />
            <view
              v-if="!false"
              @click="deleteAssociate(index)"
              class="form__information__items__item-delete"
            >
              <view class="form__information__items__item-delete-minus"></view>
            </view>
          </view>
        </view>
        <FormShow
          v-if="formStore.tempItemData.type"
          v-model:show="showSpace"
          @click="openSpace"
          :name="'从属空间'"
          :show-jump="false"
        />
        <view class="form__information__subordinateSpace" v-if="showSpace">
          <view class="space__subordinateSpace__floor">
            <SubordinateSpaceItem
              v-for="(item, subIndex) in spacesBox"
              :ids="[formStore.tempItemData.id]"
              :titlePadding="'10rpx 10rpx'"
              :tagPadding="'0 20rpx'"
              v-show="pathFloor >= subIndex"
              :parent="subIndex ? spacesBox[subIndex - 1].id : 0"
              :id="spacesBox[subIndex].id"
              :subordinateSpaces="[item]"
              :key="subIndex"
              :floor="subIndex + 1"
              :currentFloor="currentFloor"
            />
          </view>
        </view>
        <!-- <FormShow
          @click="addAdministrator = true"
          v-model:show="showAdministrator"
          :name="'管理人'"
          :show-jump="true"
        />
        <u-row v-if="showAdministrator" customStyle="margin-top:10px">
          <view
            v-for="(item, index) in form.administrator"
            :key="index"
            class="form__information__administrator"
          >
            <u-avatar size="80rpx" :src="item.avatar"></u-avatar>
            <u-text size="25rpx" lines="1" :bold="true" align="center" :text="item.name" />
          </view>
        </u-row> -->
      </view>
      <view class="form__information">
        <u-text color="#353535" customStyle="margin-bottom: 10px" :bold="true" text="备注" />
        <FormPhoto
          :size="'140rpx'"
          v-model:photoList="formStore.tempItemData.figures"
          :disabled="false"
        />
        <u-textarea
          maxlength="200"
          :count="true"
          :autoHeight="true"
          border="none"
          v-model="formStore.tempItemData.comment"
          placeholder="补充描述该物品/空间"
          :disabled="false"
        />
      </view>
      <view class="form__information">
        <FormShow v-model:show="showHistory" :name="'历史记录'" :show-jump="true" />
        <view
          v-show="showHistory"
          :key="index"
          v-for="(item, index) in formStore.logsInfo.logsData"
        >
          <FormHistory :history="item" />
        </view>
      </view>
    </u-form>
    <view v-if="!false" class="form__submit">
      <u-button
        :loading="isLoading"
        loadingText="修改中"
        @click="submitForm"
        type="primary"
        text="确认"
      />
    </view>
    <!-- <u-popup :safeAreaInsetBottom="false" round="20rpx" mode="bottom" :show="addAdministrator">
      <view class="form__popup">
        <view class="form__popup__title">
          <u-text bold size="40rpx" :text="'管理人'" />
          <u-icon color="#5196ff" name="edit-pen-fill"></u-icon>
        </view>
        <view class="form__popup__operate">
          <u-text @click="addAdministrator = false" lines="1" size="20rpx" :text="'取消'" />
          <u-line margin="15rpx 20rpx" color="#efeff2" length="50%" direction="col"></u-line>
          <u-text @click="clear()" color="#82b4fe" lines="1" size="20rpx" :text="'清除'" />
          <u-line margin="15rpx 20rpx" color="#efeff2" length="50%" direction="col"></u-line>
          <u-text @click="confirm()" color="#82b4fe" lines="1" size="20rpx" :text="'确认'" />
        </view>
      </view>
      <view class="form__avatars">
        <view v-for="(item, index) in form.administrator" :key="index" class="form__avatars__item">
          <u-avatar @click="tick(index)" size="80rpx" :src="item.avatar"></u-avatar>
          <u-text size="25rpx" lines="1" :bold="true" align="center" :text="item.name" />
          <view v-show="tickBox[index] === true" class="form__avatars__item__tick">
            <u-icon size="25rpx" name="checkmark" color="#fff"></u-icon>
          </view>
        </view>
      </view>
      <view class="form__authority">
        <u-radio-group v-model="authorityValue" placement="column" shape="square">
          <u-radio :customStyle="{ marginRight: '20rpx' }" label="仅查看" name="仅查看" />
          <u-radio
            :customStyle="{ marginRight: '20rpx' }"
            label="可查看并编辑"
            name="可查看并编辑"
          />
        </u-radio-group>
      </view>
    </u-popup> -->
    <u-popup :safeAreaInsetBottom="false" round="20rpx" mode="bottom" :show="changeTag">
      <view class="form__popup">
        <view class="form__popup__title">
          <u-text bold size="35rpx" :text="'标签'" />
          <u-icon @click="jumpPageTag" color="#5196ff" name="edit-pen-fill"></u-icon>
        </view>
        <view class="form__popup__operate">
          <u-text @click="changeTag = false" lines="1" size="26rpx" :text="'取消'" />
          <u-line margin="15rpx 20rpx" color="#efeff2" length="50%" direction="col"></u-line>
          <u-text @click="clearTag()" color="#82b4fe" lines="1" size="26rpx" :text="'清除'" />
          <u-line margin="15rpx 20rpx" color="#efeff2" length="50%" direction="col"></u-line>
          <u-text @click="confirmTag()" color="#82b4fe" lines="1" size="26rpx" :text="'确认'" />
        </view>
        <view class="form__popup__tags">
          <FormMultiple
            :tagBox="tagBox"
            :tags="tagStore.tagsInfo.tagData"
            @checkboxClick="checkboxClick"
          />
        </view>
      </view>
    </u-popup>
    <u-popup :safeAreaInsetBottom="false" round="20rpx" mode="bottom" :show="changeSpace">
      <view class="form__popup">
        <view class="form__popup__title">
          <u-text bold size="35rpx" :text="'从属空间'" />
        </view>
        <view class="form__popup__operate">
          <u-text @click="cancelSpace" lines="1" size="20rpx" :text="'取消'" />
          <u-line margin="15rpx 20rpx" color="#efeff2" length="50%" direction="col"></u-line>
          <u-text
            @click="changeSpace = false"
            color="#82b4fe"
            lines="1"
            size="20rpx"
            :text="'确认'"
          />
        </view>
        <view v-if="changeSpace" class="form__popup__tags">
          <SubordinateSpaceItem
            v-for="(item, subIndex) in pathsInfo"
            :ids="[formStore.tempItemData.id]"
            :titlePadding="'10rpx 10rpx'"
            :tagPadding="'0 20rpx'"
            v-show="pathFloor >= subIndex"
            @radioClick="radioClick"
            :parent="subIndex ? spacesBox[subIndex - 1].id : 0"
            :id="spacesBox[subIndex].id"
            :subordinateSpaces="item"
            :key="subIndex"
            :floor="subIndex + 1"
            :currentFloor="currentFloor"
          />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 引入store
import { useTagStore } from '@/stores/tag'
import { useSpaceStore } from '@/stores/space'
import { useFormStore } from '@/stores/form'

// 引入类型
import type { ItemForm, RoomForm, Image } from '@/types/form'
import type { Path } from '@/types/space'

// 引入组件
import FormDate from '@/components/Form/FormDate/FormDate.vue'
import FormTag from '@/components/Form/FormTag/FormTag.vue'
import FormShow from '@/components/Form/FormShow/FormShow.vue'
import FormPhoto from '@/components/Form/FormPhoto/FormPhoto.vue'
import FormInput from '@/components/Form/FormInput/FormInput.vue'
import FormMultiple from '@/components/Form/FormMultiple/FormMultiple.vue'
import FormHistory from '@/components/Form/FormHistory/FormHistory.vue'
import SubordinateSpaceItem from '@/components/Space/SubordinateSpaceItem/SubordinateSpaceItem.vue'

const tagStore = useTagStore()
const { getAllTags } = tagStore
const formStore = useFormStore()
const { upload, getItemLogs, currentFloor, currentId, updateRoom, updateItem } = formStore
const useSpace = useSpaceStore()
const { pathsInfo } = useSpace

onMounted(() => {
  // 开启分享功能
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
})

// 是否正在提交
const isLoading = ref(false)

// 获取所有标签
if (tagStore.tagsInfo.tagData.length === 0) getAllTags()

onShow(() => {
  // 清空当前物品已选标签
  tagBox.value = new Array(tagStore.tagsInfo.tagData.length).fill(false)
  // 重置当前已选关联物品数组
  associateBox.value = new Array(formStore.tempItemData.items.length).fill(true)
  // 创建当前物品标签哈希表
  let hashTable: Set<number> = new Set()
  formStore.tempItemData.labels.forEach((item) => {
    hashTable.add(item.id)
  })
  // 载入当前物品已选标签
  tagStore.tagsInfo.tagData.forEach((item, index) => {
    if (hashTable.has(item.id)) {
      tagBox.value[index] = true
    }
  })
})

//表单数据
formStore.tempItemData = JSON.parse(JSON.stringify(formStore.itemData))

//标题
const title = formStore.tempItemData.name

//上传图片
async function uploadImg(
  images: Image[],
  type: number
): Promise<
  {
    id: number
    url: string
  }[]
> {
  if (type) {
    for (let i = 0; i < images.length; i++) {
      images[i] = await upload(type, images[i].url)
    }
  } else {
    for (let i = 0; i < images.length; i++) {
      images[i] = await upload(type, images[i].url)
    }
  }
  return images as {
    id: number
    url: string
  }[]
}

// 上传新图片与旧图片合并
async function concatImages(images: Image[], type: number): Promise<Image[]> {
  const originalImgs = images.filter((item) => 'id' in item)
  const newImages = await uploadImg(
    images.filter((item) => !('id' in item)),
    type
  )
  return originalImgs.concat(newImages)
}

//物品属性
const radioValue = formStore.tempItemData.type === 2 ? ref('物品') : ref('空间')

//显示二维码
const showCode = ref(false)

//隐私权
const privacy = ref(formStore.tempItemData.privacy ? true : false)
//密码弹窗
const popup = ref(false)
//密码
const PIN = ref('')
//是否修改过隐私设置
let changed = false
//验证手势密码
const confirmGesture = (password: string) => {
  PIN.value = password
}
//验证数字密码
const confirmNumber = (password: string) => {
  PIN.value = password
}
watch(
  () => privacy.value,
  () => {
    changed = true
    if (privacy.value) popup.value = true
    else PIN.value = ''
  }
)
watch(
  () => popup.value,
  () => {
    if (!popup.value && !PIN.value) privacy.value = false
  }
)

// 点击定位
const chooseLocation = () => {
  return uni.chooseLocation({
    success: (res) => {
      formStore.tempItemData.address = res.name
      formStore.tempItemData.latitude = res.latitude
      formStore.tempItemData.longitude = res.longitude
    }
  })
}

//日期
const date = ref(new Date(formStore.tempItemData.date).getTime())
//更改日期格式
function currentTime(timestamp: number): string {
  var now = new Date(timestamp)
  var zeroFill = function (value: number) {
    if (value < 10) {
      return '0' + String(value)
    }
    return value
  }

  var year = now.getFullYear()
  //年
  var month = zeroFill(now.getMonth() + 1)
  //月
  var day = zeroFill(now.getDate())

  return `${year}-${month}-${day}`
}

// 显示标签
const showTag = ref(true)
// 添加标签
const changeTag = ref(false)
// 选取标签数组
const tagBox = ref<boolean[]>([])
// 清空标签
const clearTag = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (let i = 0; i < tagBox.value.length; i++) {
    tagBox.value[i] = false
  }
  formStore.tempItemData.labels = []
}
//确认添加标签
const confirmTag = (): void => {
  changeTag.value = false
  formStore.tempItemData.labels = []
  tagBox.value.forEach((item, index) => {
    if (item) formStore.tempItemData.labels.push(tagStore.tagsInfo.tagData[index])
  })
}
//标签选取事件
const checkboxClick = (index: number): void => {
  tagBox.value[index] = !tagBox.value[index]
}
//跳转至标签编辑页
const jumpPageTag = (): void => {
  uni.navigateTo({
    url: `/pages/new/tag/tag`
  })
}

// 状态消息提示
const toast = ref()
const showToast = (): void => {
  toast.value.show({
    message: "用于描述物品的使用状态,比如可以填入'五成新'、'未使用过'、'已借出'等"
  })
}

// 显示关联物品
const showAssociate = ref(true)
// 数组初始化
if (!formStore.itemData.items) {
  formStore.tempItemData.items = []
}
// 当前已选择关联物品数组
const associateBox = ref(new Array(formStore.tempItemData.items.length).fill(true))
// 删除关联物品
const deleteAssociate = (index: number) => {
  formStore.tempItemData.items.splice(index, 1)
}
// 跳转到关联物品页
const jumpPageAssociate = () => {
  uni.navigateTo({
    url: `/pages/new/dependence/dependence`
  })
}

// 显示从属空间
const showSpace = ref(false)
// 修改从属空间
const changeSpace = ref(false)
// 从属空间缓存
let tempSpaces = <Path[]>[]
// 当前楼层缓存
let tempPathFloor = 0
// 当前路径
const spacesBox = ref<Path[]>([])
// 当前层数
const pathFloor = ref<number>(0)
// 初始化当前路径
spacesBox.value = new Array(pathsInfo.length).fill({ fatherId: 0, id: 0, name: '', layer: 0 })
// 根据反转数组初始化
for (let i = 0; i < formStore.tempItemData.path?.length; i++) {
  pathFloor.value++
  spacesBox.value[formStore.tempItemData.path.length - 1 - i] = {
    fatherId: i ? formStore.tempItemData.path[i - 1].id : 0,
    id: formStore.tempItemData.path[i].id,
    name: formStore.tempItemData.path[i].name,
    layer: i
  }
}

//从属空间标签点击事件
const radioClick = (index: number, floor: number): void => {
  //点击已选择标签
  if (spacesBox.value[floor - 1].id === pathsInfo[floor - 1][index].id) {
    //修改当前楼层
    pathFloor.value = floor - 1
    //清空当前点击索引之后的已选择空间id缓存
    for (let i = floor - 1; i < spacesBox.value.length; i++) {
      if (!spacesBox.value[i]) break
      spacesBox.value[i] = { fatherId: 0, id: 0, name: '', layer: 0 }
    }
  }
  //点击未选择标签
  else {
    //修改当前楼层
    pathFloor.value = floor
    //将当前id存入已选择id缓存中
    spacesBox.value[floor - 1] = pathsInfo[floor - 1][index]
    //清空当前点击索引之后的已选择空间id缓存
    for (let i = floor; i < spacesBox.value.length; i++) {
      if (!spacesBox.value[i]) break
      spacesBox.value[i] = { fatherId: 0, id: 0, name: '', layer: 0 }
    }
  }
}

// 打开弹窗
const openSpace = (): void => {
  changeSpace.value = true
  for (let i = 0; i < spacesBox.value.length; i++) {
    tempSpaces[i] = spacesBox.value[i]
  }
  tempPathFloor = pathFloor.value
}

// 关闭弹窗
const cancelSpace = (): void => {
  changeSpace.value = false
  spacesBox.value = tempSpaces
  pathFloor.value = tempPathFloor
}

if (!formStore.tempItemData.comment) formStore.tempItemData.comment = ''

//显示历史记录
const showHistory = ref(false)

;(async function () {
  //获取物品日志
  getItemLogs(formStore.tempItemData.id)
})()

//显示管理人
// const showAdministrator = ref(false)
//显示添加管理员
// const addAdministrator = ref(false)
// const clear = (): void => {
//   addAdministrator.value = false
// }
// const confirm = (): void => {
//   addAdministrator.value = false
// }
// const tick = (index: number): void => {
//   tickBox.value[index] = !tickBox.value[index]
// }

// const tickBox = ref<boolean[]>(new Array(formStore.tempItemData.administrator.length).fill(false))
// const authorityValue = ref('仅查看')

//表单规则
const formVerify = ref()
const rules = {
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: ['blur', 'change']
    }
  ]
}
// 上传成功回调
const successCallback = (): void => {
  uni.showToast({
    title: '修改成功',
    icon: 'success',
    duration: 2000
  })
  isLoading.value = false
  formStore.itemData = JSON.parse(JSON.stringify(formStore.tempItemData))
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}

//上传表单时的回调
const submitForm = (): void => {
  formVerify.value
    .validate()
    .then(async () => {
      if (Number(formStore.tempItemData.price) < 0) {
        uni.showToast({
          title: '金额不能小于0',
          icon: 'none'
        })
        isLoading.value = false
        return
      }
      try {
        isLoading.value = true
        const images = await concatImages(formStore.tempItemData.images, 0)
        const figures = await concatImages(formStore.tempItemData.figures, 1)
        if (formStore.tempItemData.type) {
          const path = []
          for (let i = 0; i < pathFloor.value; i++) {
            path.push({
              id: spacesBox.value[i].id,
              name: spacesBox.value[i].name
            })
          }
          const tempForm = <ItemForm>{
            privacy: privacy.value ? 1 : 0,
            type: radioValue.value === '空间' ? 1 : 2,
            price: formStore.tempItemData.price,
            count: formStore.tempItemData.count,
            name: formStore.tempItemData.name,
            state: formStore.tempItemData.state,
            comment: formStore.tempItemData.comment,
            date: currentTime(date.value),
            path: path,
            labels: formStore.tempItemData.labels,
            fatherName: spacesBox.value[pathFloor.value - 1].name,
            url: formStore.tempItemData.url,
            images: images,
            figures: figures,
            password: PIN.value,
            items: formStore.tempItemData.items
          }
          if (!changed || !PIN.value) delete tempForm.password
          await updateItem(currentId, formStore.tempItemData.id, tempForm)
          successCallback()
        } else {
          const tempForm = <RoomForm>{
            privacy: privacy.value ? 1 : 0,
            type: 0,
            price: formStore.tempItemData.price,
            name: formStore.tempItemData.name,
            state: formStore.tempItemData.state,
            address: formStore.tempItemData.address,
            latitude: formStore.tempItemData.latitude,
            longitude: formStore.tempItemData.longitude,
            comment: formStore.tempItemData.comment,
            date: currentTime(date.value),
            images: images,
            figures: figures,
            labels: formStore.tempItemData.labels,
            password: PIN.value
          }
          if (!changed || !PIN.value) delete tempForm.password
          await updateRoom(formStore.tempItemData.id, tempForm)
          successCallback()
        }
      } catch {
        isLoading.value = false
      }
    })
    .catch((error: any) => {
      console.log(error)
    })
}
</script>

<style lang="scss">
.form {
  padding: 30rpx;
  margin-top: 40px;
  background-color: #f6f6f6;

  &__photo {
    padding: 0rpx 0rpx 20rpx 30rpx;
  }

  &__popup {
    padding: 30rpx 0 0 30rpx;
    padding-bottom: 0;
    display: flex;
    flex-wrap: wrap;

    &__title {
      display: flex;
      margin-right: 280rpx;
    }

    &__operate {
      width: 250rpx;
      display: flex;
    }

    &__tags {
      padding: 20rpx;
      min-height: 200rpx;
      max-height: 500rpx;
      overflow: auto;
    }
  }

  // &__authority {
  //   padding-left: 40rpx;
  //   padding-bottom: 40rpx;
  // }

  // &__avatars {
  //   display: flex;
  //   padding: 20rpx 40rpx;
  //   padding-right: 0;
  //   overflow-x: auto;
  //   flex-wrap: nowrap;

  //   &__item {
  //     padding-right: 20rpx;
  //     position: relative;

  //     &__tick {
  //       width: 28rpx;
  //       height: 28rpx;
  //       border-radius: 14rpx;
  //       background-color: #ff6464;
  //       position: absolute;
  //       right: 15rpx;
  //       bottom: 30rpx;
  //       display: flex;
  //       align-items: center;
  //       justify-content: center;
  //     }
  //   }
  // }

  &__information {
    border-radius: 30rpx;
    background-color: #fff;
    padding: 20rpx;
    margin-bottom: 30rpx;

    &__state {
      width: 500rpx;
      padding: 50rpx 50rpx 0 50rpx;
      border-radius: 30rpx;
      background-color: #fcfcfe;
      text-align: center;
    }

    &__subordinateSpace {
      max-height: 200px;
      overflow-y: auto;
    }

    &__code {
      width: 400rpx;
      padding-top: 20rpx;

      &__text {
        display: flex;
        padding: 0 30rpx 0 30rpx;
        justify-content: center;
      }

      &__img {
        width: 300rpx;
        height: 300rpx;
        margin: 0 50rpx;
      }
    }

    &__tag {
      display: flex;
      justify-content: flex-start;
      flex-flow: row wrap;
    }

    &__administrator {
      width: 80rpx;
      margin-right: 20rpx;
    }

    &__items {
      display: flex;
      justify-content: flex-start;
      flex-flow: row nowrap;
      overflow-x: auto;
      &__item {
        width: 80rpx;
        margin-right: 20rpx;
        position: relative;
        &-delete {
          width: 30rpx;
          height: 30rpx;
          position: absolute;
          border-radius: 15rpx;
          right: -6rpx;
          top: 0;
          background-color: #2979ff;
          display: flex;
          justify-content: center;
          align-items: center;
          &-minus {
            width: 22rpx;
            height: 4rpx;
            border-radius: 2rpx;
            background-color: #fff;
          }
        }
      }
    }
  }

  &__submit {
    margin: 0 auto;
    width: 200rpx;
  }
}
</style>
