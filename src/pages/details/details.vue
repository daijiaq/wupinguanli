<template>
  <view class="form">
    <u-navbar
      titleWidth="250rpx"
      :title="formStore.itemData.name"
      bgColor="#f6f6f6"
      :autoBack="true"
    />
    <view class="form__photo">
      <FormPhoto :size="'310rpx'" v-model:photoList="formStore.itemData.images" :disabled="true" />
    </view>
    <view class="form__information">
      <u-row customStyle="margin-bottom: 10px">
        <u-col span="2">
          <u-text :bold="true" text="属性" />
        </u-col>
        <u-col span="6">
          <u-radio-group :disabled="true" v-model="radioValue" placement="row" shape="square">
            <u-radio :customStyle="{ marginRight: '20rpx' }" label="空间" name="空间" />
            <u-radio :customStyle="{ marginRight: '20rpx' }" label="物品" name="物品" />
          </u-radio-group>
        </u-col>
      </u-row>
      <FormInput
        :type="'text'"
        :name="'名称'"
        :maxLength="30"
        :disabled="true"
        :placeHolder="'最多输入三十字'"
        v-model:input="formStore.itemData.name"
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
              <u-text size="26rpx" color="#000" align="center" text="将物品二维码发送给好友" />
              <u-button customStyle="border:none;width:50rpx;" @click="sendItem" icon="share" />
            </view>
            <image class="form__information__code__img" :src="formStore.itemData.qrCode" />
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
          <u-switch :disabled="true" v-model="privacy" size="20" :activeValue="true" />
        </u-col>
      </u-row>
      <FormShow v-model:show="showTag" :name="'标签'" :show-jump="false" />
      <view v-show="showTag" class="form__information__tag">
        <FormTag
          v-for="(item, index) in formStore.itemData.labels"
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
        <u-col span="10">
          <u-input
            border="none"
            disabled
            :disabledColor="'#fff'"
            v-model="formStore.itemData.address"
          />
        </u-col>
      </u-row>
      <FormInput
        :type="'number'"
        :name="'金额'"
        :maxLength="10"
        :disabled="true"
        :placeHolder="'请输入金额'"
        :unitName="'元'"
        v-model:input="formStore.itemData.price"
        :span="4"
      />
      <FormInput
        v-if="formStore.itemData.type"
        :type="'number'"
        :name="'数量'"
        :maxLength="10"
        :disabled="true"
        :placeHolder="'请输入数量'"
        v-model:input="formStore.itemData.count"
      />
      <FormDate :can-click="false" v-model:date="date" />
      <FormInput
        :type="'text'"
        :name="'链接'"
        :maxLength="100"
        :disabled="true"
        :placeHolder="'输入物品/空间的购买链接'"
        v-model:input="formStore.itemData.url"
        :display="!true"
      />
      <FormInput
        :type="'text'"
        :name="'状态'"
        :maxLength="30"
        :disabled="true"
        :placeHolder="'输入物品状态'"
        v-model:input="formStore.itemData.state"
      >
      </FormInput>
    </view>
    <template v-if="!isShareItem">
      <view v-if="formStore.itemData.type" class="form__information">
        <FormShow v-model:show="showAssociate" :name="'关联物品'" :show-jump="false" />
        <view v-show="showAssociate" class="form__information__items">
          <view
            v-for="(item, index) in formStore.itemData.items"
            :key="index"
            class="form__information__items__item"
          >
            <u-avatar size="80rpx" :src="item.cover"></u-avatar>
            <u-text size="20rpx" lines="1" :bold="true" align="center" :text="item.name" />
          </view>
        </view>
        <FormShow
          v-if="formStore.itemData.type"
          v-model:show="showSpace"
          :name="'从属空间'"
          :show-jump="false"
        />
        <view class="form__information__subordinateSpace" v-if="showSpace">
          <view class="space__subordinateSpace__floor">
            <SubordinateSpaceItem
              v-for="(item, subIndex) in spacesBox"
              :ids="[formStore.itemData.id]"
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
          :show-jump="false"
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
          v-model:photoList="formStore.itemData.figures"
          :disabled="true"
        />
        <u-textarea
          maxlength="200"
          :count="true"
          :autoHeight="true"
          border="none"
          v-model="formStore.itemData.comment"
          placeholder="补充描述该物品/空间"
          :disabled="true"
        />
      </view>
      <view class="form__information">
        <FormShow v-model:show="showHistory" :name="'历史记录'" :show-jump="false" />
        <view
          v-show="showHistory"
          :key="index"
          v-for="(item, index) in formStore.logsInfo.logsData"
        >
          <FormHistory :history="item" />
        </view>
      </view>
    </template>
  </view>
  <u-modal
    @cancel="showDelete = false"
    @confirm="deleteItem"
    :showCancelButton="true"
    :show="showDelete"
    width="600rpx"
  >
    确认删除?
  </u-modal>
  <view class="form__operate" v-if="!isShareItem && !isDeleted">
    <view class="form__operate__item" @click="jumpPageEdit">
      <u-icon customStyle="font-size:25px;top:10px" name="edit-pen-fill" color="#3988ff"></u-icon>
      <u-text customStyle="font-size: 15px;margin-top:10px;" color="#000" text="编辑" />
    </view>
    <view class="form__operate__item" @click="showDelete = true">
      <u-icon customStyle="font-size:25px;top:10px" name="trash" color="#3988ff"></u-icon>
      <u-text customStyle="font-size: 15px;margin-top:10px;" color="#000" text="删除" />
    </view>
    <view class="form__operate__item" @click="jumpPageShare">
      <u-icon customStyle="font-size:25px;top:10px" name="share" color="#3988ff"></u-icon>
      <u-text customStyle="font-size: 15px;margin-top:10px;" color="#000" text="分享" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShareAppMessage, onLoad } from '@dcloudio/uni-app'
import { ref, onMounted } from 'vue'

// 引入类型
import type { Path } from '@/types/space'

// 引入store
import { useFormStore } from '@/stores/form'
import { useTagStore } from '@/stores/tag'
import { useSpaceStore } from '@/stores/space'

// 引入组件
import FormDate from '@/components/Form/FormDate/FormDate.vue'
import FormTag from '@/components/Form/FormTag/FormTag.vue'
import FormShow from '@/components/Form/FormShow/FormShow.vue'
import FormPhoto from '@/components/Form/FormPhoto/FormPhoto.vue'
import FormInput from '@/components/Form/FormInput/FormInput.vue'
import FormHistory from '@/components/Form/FormHistory/FormHistory.vue'
import SubordinateSpaceItem from '@/components/Space/SubordinateSpaceItem/SubordinateSpaceItem.vue'

onMounted(() => {
  // 开启分享功能
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
})

onLoad(async (options: any) => {
  // 初始化isShareItem
  if (options.isShareItem === 'true') {
    isShareItem.value = true
  } else {
    isShareItem.value = false
  }
  // 初始化isDeleted
  if (options.isDeleted === 'true') {
    isDeleted.value = true
  } else {
    isDeleted.value = false
  }
})

// onShareAppMessage(() => {
//   return {
//     title: '理物丨向你分享了一件物品',
//     path: `/pages/share/share?id=${formStore.itemData.id}&type=${formStore.itemData.type}`,
//     imageUrl: '/static/plant.png'
//   }
// })
const sendItem = () => {
  console.log('sds')

  uni.showToast({
    title: '开发中~',
    icon: 'none'
  })
}
// onShareAppMessage(() => {
//   console.log(formStore.itemData.images[0])
//   return {
//     title: '理物丨向你分享了一件物品',
//     path: `/pages/details/details?isShareItem=${true}`,
//     imageUrl: `${formStore.itemData.images[0]}`
//   }
// })

// 获取store方法,数据
const tagStore = useTagStore()
const { getAllTags } = tagStore
const formStore = useFormStore()
const { getItemLogs, currentFloor, batchDeleteItems } = formStore
const spaceStore = useSpaceStore()
const { pathsInfo } = spaceStore

//物品属性
const radioValue = formStore.itemData.type === 2 ? ref('物品') : ref('空间')

//显示二维码
const showCode = ref(false)

//隐私权
const privacy = ref(formStore.itemData.privacy ? true : false)

//日期
const date = ref(new Date(formStore.itemData.date).getTime())

// 获取标签
if (tagStore.tagsInfo.tagData.length === 0) getAllTags()

// 显示标签
const showTag = ref(true)

// 是否为分享的物品
const isShareItem = ref(false)

// 是否从回收站跳转
const isDeleted = ref(false)

// 关联物品
const showAssociate = ref(true)
if (!formStore.itemData.items) {
  formStore.itemData.items = []
}

// 显示从属空间
const showSpace = ref(false)
// 当前路径
const spacesBox = ref<Path[]>([])
// 当前层数
const pathFloor = ref<number>(0)
// 初始化当前路径
for (let i = 0; i < pathsInfo.length; i++) {
  spacesBox.value[i] = { fatherId: 0, id: 0, name: '', layer: 0 }
}
for (let i = 0; i < formStore.itemData.path?.length; i++) {
  pathFloor.value++
  spacesBox.value[formStore.itemData.path.length - 1 - i] = {
    fatherId: i ? formStore.itemData.path[i - 1].id : 0,
    id: formStore.itemData.path[i].id,
    name: formStore.itemData.path[i].name,
    layer: i
  }
}

if (!formStore.itemData.comment) formStore.itemData.comment = ''

// 显示历史记录
const showHistory = ref(false)
// 获取物品日志
getItemLogs(formStore.itemData.id)

// 显示管理人
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

// const tickBox = ref<boolean[]>(new Array(form.administrator.length).fill(false))
// const authorityValue = ref('仅查看')

// 显示删除弹窗
const showDelete = ref(false)

// 删除当前物品
async function deleteItem(): Promise<void> {
  showDelete.value = false
  uni.showToast({
    title: '删除中...',
    icon: 'none'
  })
  await batchDeleteItems([formStore.itemData.id])
  uni.showToast({
    title: '删除成功',
    icon: 'success'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}

// 跳转编辑页
const jumpPageEdit = () => {
  uni.navigateTo({
    url: `/pages/edit/edit`
  })
}

const jumpPageShare = () => {
  uni.navigateTo({
    url: `/pages/user/friends/share/share`
  })
}
</script>

<style lang="scss">
.form {
  padding: 30rpx;
  margin-top: 40px;
  padding-bottom: 130rpx;
  background-color: #f6f6f6;

  &__photo {
    padding: 40rpx 0rpx 20rpx 30rpx;
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

    // &__administrator {
    //   width: 80rpx;
    //   margin-right: 20rpx;
    // }

    &__items {
      display: flex;
      justify-content: flex-start;
      flex-flow: row nowrap;
      overflow-x: auto;
      &__item {
        width: 80rpx;
        margin-right: 20rpx;
        position: relative;
      }
    }
  }

  &__operate {
    height: 150rpx;
    background-color: #fff;
    width: 100%;
    display: flex;
    position: fixed;
    z-index: 100;
    bottom: 0;
    justify-content: space-around;
    &__item {
      height: 100rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
::veep .u-text data-v-5fec1d8b {
  margin-top: 25rpx !important;
}
</style>
