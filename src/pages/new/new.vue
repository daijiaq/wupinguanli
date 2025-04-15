<template>
  <view class="form">
    <u-form v-if="loading" errorType="toast" :rules="rules" :model="form" ref="formVerify">
      <!-- 表单验证 -->
      <u-form-item prop="name" />
      <u-navbar @leftClick="back" titleWidth="250rpx" :title="'新建'" bgColor="#f6f6f6" />
      <view class="form__photo">
        <FormPhoto :disabled="false" :size="'310rpx'" v-model:photoList="form.images" />
      </view>
      <view class="form__information">
        <u-row customStyle="margin-bottom: 10px">
          <u-col span="2">
            <u-text :bold="true" text="属性" />
          </u-col>
          <u-col span="6">
            <u-radio-group
              v-model="radioValue"
              placement="row"
              shape="square"
              :disabled="currentFloor === 1"
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
          v-model:input="form.name"
        >
          >
          <template #icon>
            <view class="form__information__icon"> * </view>
          </template>
        </FormInput>
        <u-row>
          <u-col span="2">
            <u-text color="#353535" :bold="true" text="二维码" />
          </u-col>
          <u-col span="10">
            <u-input placeholder="保存即可生成二维码" border="none" readonly />
          </u-col>
        </u-row>
      </view>
      <view class="form__information">
        <u-row customStyle="margin-bottom: 10px">
          <u-col span="10.5">
            <u-text color="#353535" :bold="true" text="隐私" />
          </u-col>
          <u-col span="1.5">
            <u-switch v-model="privacy" size="20" :activeValue="true" />
          </u-col>
        </u-row>
        <PasswordPopup
          :popup="popup"
          @close="popup = false"
          @confirmGesture="confirmGesture"
          @confirmNumber="confirmNumber"
        />
        <FormShow :show-jump="true" v-model:show="showTag" @click="openTag" :name="'标签'" />
        <view v-if="showTag" class="form__information__tag">
          <FormTag
            v-for="(item, index) in form.labels"
            :checked="true"
            :tag="item"
            :key="index"
            :shape="'square'"
          ></FormTag>
        </view>
        <u-row customStyle="margin-bottom: 10px" v-if="useForm.currentFloor === 1">
          <u-col span="2">
            <u-text color="#353535" :bold="true" text="定位" />
          </u-col>
          <u-col span="10" @click="chooseLocation">
            <u-input
              placeholder="点击定位"
              border="none"
              disabled
              :disabledColor="'#fff'"
              v-model="form.address"
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
          v-model:input="form.price"
          :span="4"
        />
        <FormInput
          v-if="currentFloor !== 1"
          :type="'number'"
          :name="'数量'"
          :maxLength="10"
          :disabled="false"
          :placeHolder="'请输入数量'"
          v-model:input="form.count"
        />
        <FormDate :can-click="true" v-model:date="date" />
        <FormInput
          v-if="currentFloor !== 1"
          :type="'text'"
          :name="'链接'"
          :maxLength="100"
          :disabled="false"
          :placeHolder="'输入物品/空间的购买链接'"
          v-model:input="form.url"
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
      </view>
      <view v-if="currentFloor !== 1" class="form__information">
        <FormShow
          :show-jump="true"
          v-model:show="showAssociate"
          :url="'new/dependence/dependence'"
          :name="'关联物品'"
          :isDetail="false"
        />
        <view v-show="showAssociate" class="form__information__items">
          <view
            v-for="(item, index) in form.items"
            :key="index"
            class="form__information__items__item"
          >
            <u-avatar size="80rpx" :src="item.cover"></u-avatar>
            <u-text size="20rpx" lines="1" :bold="true" align="center" :text="item.name" />
            <view @click="deleteAssociate(index)" class="form__information__items__item-delete">
              <view class="form__information__items__item-delete-minus"></view>
            </view>
          </view>
        </view>
        <FormShow
          :show-jump="true"
          v-model:show="showSpace"
          @click="openSpace"
          :name="'从属空间'"
          :isDetail="false"
        />
        <view class="form__information__subSpace" v-if="showSpace">
          <view class="space__subSpace__floor">
            <SubordinateSpaceItem
              v-for="(item, subIndex) in spacesBox"
              :ids="[]"
              :titlePadding="'10rpx 10rpx'"
              :tagPadding="'0 20rpx'"
              v-show="pathFloor >= subIndex"
              @radioClick="radioClick"
              :parent="subIndex ? spacesBox[subIndex - 1].id : 0"
              :id="spacesBox[subIndex].id"
              :subordinateSpaces="[item]"
              :key="subIndex"
              :floor="subIndex + 1"
              :currentFloor="currentFloor - 1"
            />
          </view>
        </view>
      </view>
      <view class="form__information">
        <u-text color="#353535" customStyle="margin-bottom: 10px" :bold="true" text="备注" />
        <FormPhoto :disabled="false" :size="'140rpx'" v-model:photoList="form.figures" />
        <u-textarea
          maxlength="200"
          :count="true"
          :autoHeight="true"
          border="none"
          v-model="form.comment"
          placeholder="补充描述该物品/空间"
        />
      </view>
    </u-form>
    <view v-if="loading" class="form__submit">
      <u-button
        :loading="isLoading"
        loadingText="新建中"
        @click="submitForm"
        type="primary"
        text="确认保存"
      />
    </view>
    <u-popup :safeAreaInsetBottom="false" round="20rpx" mode="bottom" :show="addTag">
      <view class="form__popup">
        <view class="form__popup__title">
          <u-text bold size="35rpx" :text="'标签'" />
          <u-icon @click="toTag" color="#5196ff" name="edit-pen-fill"></u-icon>
        </view>
        <view class="form__popup__operate">
          <u-text @click="cancelTag" lines="1" size="20rpx" :text="'取消'" />
          <u-line margin="15rpx 20rpx" color="#efeff2" length="50%" direction="col"></u-line>
          <u-text @click="clearTag()" color="#82b4fe" lines="1" size="20rpx" :text="'清除'" />
          <u-line margin="15rpx 20rpx" color="#efeff2" length="50%" direction="col"></u-line>
          <u-text @click="confirmTag()" color="#82b4fe" lines="1" size="20rpx" :text="'确认'" />
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
            :ids="[]"
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
    <u-modal
      @cancel="cancelSave"
      @confirm="confirmSave"
      :showCancelButton="true"
      :show="showSave"
      width="600rpx"
    >
      是否存入草稿箱?
    </u-modal>
    <u-modal
      @cancel="cancelWrite"
      @confirm="confirmWrite"
      :showCancelButton="true"
      :show="showWrite"
      width="600rpx"
    >
      是否写入草稿箱数据?
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
// 引入类型
import type { ItemForm, RoomForm, Image } from '@/types/form'
import type { Path } from '@/types/space'
import type { AutoTag } from '@/types/tag'
// 引入组件
import FormDate from '@/components/Form/FormDate/FormDate.vue'
import FormTag from '@/components/Form/FormTag/FormTag.vue'
import FormShow from '@/components/Form/FormShow/FormShow.vue'
import FormPhoto from '@/components/Form/FormPhoto/FormPhoto.vue'
import FormInput from '@/components/Form/FormInput/FormInput.vue'
import FormMultiple from '@/components/Form/FormMultiple/FormMultiple.vue'
import SubordinateSpaceItem from '@/components/Space/SubordinateSpaceItem/SubordinateSpaceItem.vue'

// 引入store
import { useFormStore } from '@/stores/form'
import { useTagStore } from '@/stores/tag'
import { useSpaceStore } from '@/stores/space'
const tagStore = useTagStore()
const { getAllTags } = tagStore
const useForm = useFormStore()
const { form, createRoom, createItem, upload, currentFloor, resetForm } = useForm
const spaceStore = useSpaceStore()
const { pathsInfo, spaces } = spaceStore
// 第一次进入页面时，获取所有标签
if (!tagStore.tagsInfo.tagData.length) getAllTags()

const showSave = ref(false)

const loading = ref(false)

onLoad(() => {
  resetForm()
})

const back = () => {
  if (!submitted.value && form.name) {
    showSave.value = true
  } else {
    uni.navigateBack()
  }
}

const confirmSave = () => {
  if (!form.name) {
    uni.showToast({
      title: '名称不能为空',
      icon: 'none'
    })
    showSave.value = false
  } else {
    uni.setStorageSync('form', {
      privacy: privacy.value,
      type: radioValue.value,
      price: form.price,
      count: form.count,
      name: form.name,
      state: form.state,
      comment: form.comment,
      date: date.value,
      url: form.url,
      images: form.images,
      figures: form.figures,
      password: PIN.value,
      address: form.address
    })
  }
  uni.navigateBack()
}

const draftForm = uni.getStorageSync('form')

const cancelSave = () => {
  showSave.value = false
  uni.removeStorageSync('form')
  uni.navigateBack()
}

// 纬度
let latitude = 0
let longitude = 0

// 点击定位
const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      form.address = res.name
      latitude = res.latitude
      longitude = res.longitude
    }
  })
}

// // 剪切板链接一键导入信息
// const getItemByUrl = (itemUrl: string) => {
//   uni.request({
//     url: `http://7frv47.natappfree.cc/CrawlProducts?url=${itemUrl}`,
//     method: 'GET',
//     success: (res: any) => {
//       console.log(res.data)
//       if (!res.data.name) {
//         uni.showToast({
//           title: '导入失败',
//           icon: 'error'
//         })
//         return
//       }
//       form.name = res.data.name
//       form.images.push({
//         url: res.data.url
//       })
//       form.price = res.data.price.replace(/\s/g, '')
//       console.log(form)
//       uni.showToast({
//         title: '导入成功',
//         icon: 'success'
//       })
//     },
//     fail: (err) => {
//       console.log(err)
//     }
//   })
// }

// if (!draftForm) {
//   uni.getClipboardData({
//     success: (res) => {
//       console.log(res)
//       const regex = /^(https:\/\/item\.taobao\.com\/item|https:\/\/item\.jd\.com)/
//       if (regex.test(res.data)) {
//         uni.showModal({
//           title: '链接导入',
//           content: '检测到链接，是否一键导入信息？',
//           success: () => {
//             getItemByUrl(res.data)
//             uni.showLoading({
//               title: '导入中'
//             })
//           }
//         })
//       }
//     }
//   })
// }

// 名称自动生成标签
// const getItemByUrl = (name: string) => {
//   uni.request({
//     url: `http://4jzp98.natappfree.cc/${name}`,
//     method: 'GET',
//     success: (res: any) => {
//       console.log(res)
//       console.log(res.data)
//       if (!res.data.name) {
//         uni.showToast({
//           title: '导入失败',
//           icon: 'error'
//         })
//         return
//       }

//       uni.showToast({
//         title: '导入成功',
//         icon: 'success'
//       })
//     },
//     fail: (err) => {
//       console.log(err)
//     }
//   })
// }
// getItemByUrl('鼠标')

//上传图片
async function uploadAllImgs(images: Image[], type: number): Promise<Image[]> {
  for (let i = 0; i < images.length; i++) {
    images[i] = await upload(type, images[i].url)
  }
  return images
}

const showWrite = ref(false)
if (draftForm) {
  showWrite.value = true
} else {
  loading.value = true
}
// 草稿写入
const confirmWrite = () => {
  form.images = draftForm.images
  form.figures = draftForm.figures
  form.name = draftForm.name
  form.count = draftForm.count
  form.price = draftForm.price
  form.url = draftForm.url
  form.state = draftForm.state
  form.comment = draftForm.comment
  radioValue.value = draftForm.type
  date.value = draftForm.date
  privacy.value = draftForm.privacy
  PIN.value = draftForm.password
  form.address = draftForm.address
  showWrite.value = false
  loading.value = true
}
const cancelWrite = () => {
  showWrite.value = false
  loading.value = true
  uni.removeStorageSync('form')
}

// 是否正在提交
const isLoading = ref(false)

//物品属性
const radioValue = ref('空间')

//隐私
const privacy = ref(false)
//密码弹窗
const popup = ref(false)
//密码
const PIN = ref('')
//验证手势密码
const confirmGesture = (password: number) => {
  PIN.value = password.toString()
}
//验证数字密码
const confirmNumber = (password: number) => {
  PIN.value = password.toString()
}
watch(
  () => privacy.value,
  () => {
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
//显示标签
const showTag = ref(true)
//添加标签
const addTag = ref(false)
//标签缓存
let tempTagBox = <boolean[]>[]
//初始化选取标签数组
const tagBox = ref<boolean[]>([])

const clearTag = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tagBox.value.forEach((item) => (item = false))
  form.labels = []
  addTag.value = false
}
//标签选择事件
const checkboxClick = (index: number): void => {
  tagBox.value[index] = !tagBox.value[index]
}
//确认添加标签
const confirmTag = (): void => {
  addTag.value = false
  form.labels = []
  for (let i = 0; i < tagBox.value.length; i++) {
    if (tagBox.value[i]) form.labels.push(tagStore.tagsInfo.tagData[i])
  }
}
const openTag = (): void => {
  addTag.value = true
  tempTagBox = []
  for (let i = 0; i < tagBox.value.length; i++) {
    tempTagBox[i] = tagBox.value[i]
  }
}
const cancelTag = (): void => {
  addTag.value = false
  tagBox.value = tempTagBox
}
//跳转至标签编辑页
const toTag = (): void => {
  uni.navigateTo({
    url: `/pages/new/tag/tag`
  })
}

const showAssociate = ref(true)
const deleteAssociate = (index: number) => {
  form.items.splice(index, 1)
}

//日期
const date = ref(Date.now())
//将时间戳转换为年月日
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

//弹出状态提示
const toast = ref()
const showToast = (): void => {
  toast.value.show({
    message: "用于描述物品的使用状态,比如可以填入'五成新'、'未使用过'、'已借出'等"
  })
}

//显示从属空间
const showSpace = ref(false)
//修改从属空间
const changeSpace = ref(false)
//从属空间缓存
let tempSpaces = <Path[]>[]
//当前楼层缓存
let tempPathFloor = 0
//选择从属空间
const spacesBox = ref<Path[]>([])
//当前层数
const pathFloor = ref<number>(0)
//初始化从属空间数组
for (let i = 0; i < pathsInfo.length; i++) {
  spacesBox.value[i] = { fatherId: 0, id: 0, name: '', layer: 0 }
}
for (let i = 0; i < currentFloor - 1; i++) {
  pathFloor.value++
  spacesBox.value[i] = {
    fatherId: i ? spacesBox.value[i - 1].id : 0,
    id: spaces[i].id,
    name: spaces[i].name,
    layer: i
  }
}
//从属空间标签点击事件
const radioClick = (index: number, floor: number): void => {
  //点击已选择标签
  if (spacesBox.value[floor - 1].id === pathsInfo[floor - 1][index].id) {
    //修改当前楼层
    pathFloor.value = floor - 1
    //清空当前点击索引之后的已选择空间缓存
    for (let i = floor - 1; i < spacesBox.value.length; i++) {
      if (!spacesBox.value[i]) break
      spacesBox.value[i] = { fatherId: 0, id: 0, name: '', layer: 0 }
    }
  }
  //点击未选择标签
  else {
    // 修改当前楼层
    pathFloor.value = floor
    // 将当前路径存入已选择路径缓存中
    spacesBox.value[floor - 1] = pathsInfo[floor - 1][index]
    // 清空当前点击索引之后的已选择空间缓存
    for (let i = floor; i < spacesBox.value.length; i++) {
      if (!spacesBox.value[i]) break
      spacesBox.value[i] = { fatherId: 0, id: 0, name: '', layer: 0 }
    }
  }
}
const openSpace = (): void => {
  changeSpace.value = true
  for (let i = 0; i < spacesBox.value.length; i++) {
    tempSpaces[i] = spacesBox.value[i]
  }
  tempPathFloor = pathFloor.value
}

const cancelSpace = (): void => {
  changeSpace.value = false
  spacesBox.value = tempSpaces
  pathFloor.value = tempPathFloor
}

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

const submitted = ref(false)
//上传表单时的回调
const submitForm = (): void => {
  formVerify.value
    .validate()
    .then(async () => {
      try {
        isLoading.value = true
        const images = await uploadAllImgs(form.images, 0)
        const figures = await uploadAllImgs(form.figures, 1)
        if (currentFloor === 1) {
          const tempForm = <RoomForm>{
            privacy: privacy.value ? 1 : 0,
            type: 0,
            price: Number(form.price),
            name: form.name,
            state: form.state,
            address: form.address,
            latitude: latitude,
            longitude: longitude,
            comment: form.comment,
            date: currentTime(date.value),
            images: images,
            figures: figures,
            labels: form.labels,
            password: PIN.value
          }
          if (!PIN.value) delete tempForm.password
          isLoading.value = true
          await createRoom(tempForm)
          uni.showToast({
            title: '新建成功',
            icon: 'success',
            duration: 2000
          })
          isLoading.value = false
          form.labels = []
          setTimeout(() => {
            uni.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          const paths = []
          for (let i = 0; i < pathFloor.value; i++) {
            paths.push({
              id: spacesBox.value[i].id,
              name: spacesBox.value[i].name
            })
          }
          const tempForm = <ItemForm>{
            privacy: privacy.value ? 1 : 0,
            type: radioValue.value === '空间' ? 1 : 2,
            price: Number(form.price),
            count: Number(form.count),
            name: form.name,
            state: form.state,
            comment: form.comment,
            date: currentTime(date.value),
            path: paths,
            labels: form.labels,
            fatherName: spacesBox.value[pathFloor.value - 1].name,
            url: form.url,
            images: images,
            figures: figures,
            password: PIN.value,
            items: form.items
          }
          if (!PIN.value) delete tempForm.password
          await createItem(spacesBox.value[pathFloor.value - 1].id, tempForm)
          uni.showToast({
            title: '新建成功',
            icon: 'success',
            duration: 2000
          })
          isLoading.value = false
          setTimeout(() => {
            uni.navigateBack({
              delta: 1
            })
          }, 1000)
        }
        submitted.value = true
        uni.removeStorageSync('form')
      } catch {
        isLoading.value = false
      }
    })
    .catch((error: any) => {
      console.log(error)
    })
}
//获得inPut值
// const onLossFocus = (input: string | number) => {
//   //拿到值
//   const inputData = input
//   //将值发送给 自动获取标签函数
//   if (inputData !== '') {
//     autoTagAPI(inputData)
//   }
//   return
// }

// //自动标签生成标签
// const autoTagAPI = (name: string | number) => {
//   uni.request({
//     url: `http://8.134.133.252:80//label/${name}`,
//     method: 'GET',
//     success: async (res) => {
//       const data = res.data as AutoTag
//       const { category_1, category_2 } = data.data_0
//       //处理数据，发送给创建标签函数
//       await useTagStore().createTag(category_2, '#1f1f1f')
//       await useTagStore().createTag(category_1, '#1f1f1f')
//       //获取所有标签
//       await useTagStore().getAllTags()
//     },
//     fail: () => {
//       uni.showToast({
//         title: '自动生成标签失败',
//         icon: 'error'
//       })
//     }
//   })
// }
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

  &__information {
    border-radius: 30rpx;
    background-color: #fff;
    padding: 20rpx;
    margin-bottom: 30rpx;

    &__subSpace {
      max-height: 200px;
      overflow-y: auto;
    }

    &__tag {
      display: flex;
      justify-content: flex-start;
      flex-flow: row wrap;
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

    &__icon {
      position: absolute;
      top: -5px;
      left: 30px;
      color: red;
      font-size: 30rpx;
    }
  }

  &__submit {
    margin: 0 auto;
    width: 200rpx;
  }
}
</style>
