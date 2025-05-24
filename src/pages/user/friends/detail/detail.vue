<template>
  <view class="detail">
    <u-navbar bgColor="#f6f6f6" title="个人主页" :autoBack="true" />
    <view class="detail__item">
      <u-avatar size="132rpx" :src="friendStore.friend.avatar"></u-avatar>
      <view class="detail__item__information">
        <u-text color="#353535" size="30rpx" :text="friendStore.friend.name"></u-text>
        <u-line color="rgba(255,255,255,0)" margin="10rpx 0"></u-line>
        <u-text color="#a4a4a4" size="25rpx" :text="`id: ${friendStore.friend.id}`"></u-text>
      </view>
      <view class="detail__item__qrCode">
        <u-icon @click="showCode = true" size="36rpx" name="grid"></u-icon>
      </view>
    </view>
    <view class="detail__part">
      <view v-if="!isFriend" @click="confirmAddFriend" class="detail__part__unit">
        <u-text
          iconStyle="color:#565656"
          color="#565656"
          prefixIcon="plus"
          size="32rpx"
          text="&nbsp;&nbsp;&nbsp;添加好友"
        ></u-text>
      </view>
      <view class="detail__part__unit" @click="sendFriend">
        <u-text
          iconStyle="color:#565656"
          color="#565656"
          size="32rpx"
          prefixIcon="share"
          text="&nbsp;&nbsp;&nbsp;分享"
        ></u-text>
      </view>
    </view>
    <view v-if="isFriend" class="detail__part">
      <u-row @click="showGroup = true" customStyle="height:100rpx;padding-left:20rpx">
        <u-col span="3.8">
          <u-text
            iconStyle="color:#565656"
            color="#565656"
            size="32rpx"
            prefixIcon="edit-pen"
            text="&nbsp;&nbsp;&nbsp;分组设置:"
          ></u-text>
        </u-col>
        <u-col span="9">
          <u-text color="#5297ff" :text="friendStore.group.name"></u-text>
        </u-col>
      </u-row>
      <u-row @click="showNotes = true" customStyle="height:100rpx;padding-left:20rpx">
        <u-col span="2.6">
          <u-text
            iconStyle="color:#565656"
            color="#565656"
            size="32rpx"
            prefixIcon="pushpin"
            text="&nbsp;&nbsp;&nbsp;备注:"
          ></u-text>
        </u-col>
        <u-col span="9">
          <u-text color="#5297ff" :text="friendStore.friend.notes"></u-text>
        </u-col>
      </u-row>
    </view>
    <view v-if="isFriend" class="detail__part">
      <view @click="jumpPageHistory" class="detail__part__unit">
        <u-text
          iconStyle="color:#565656"
          color="#565656"
          prefixIcon="clock"
          size="32rpx"
          text="&nbsp;&nbsp;&nbsp;历史记录"
        ></u-text>
        <view class="detail__part__unit__arrow">
          <u-icon color="#898a8d" name="arrow-right"></u-icon>
        </view>
      </view>
      <u-row
        v-for="(item, index) in history.slice(0, 5)"
        :key="index"
        customStyle="padding-bottom: 20rpx;"
      >
        <u-col span="9">
          <view class="detail__part__history">
            <text>{{ item.content }}</text>
          </view>
        </u-col>
        <u-col span="3">
          <u-text align="center" size="23rpx" color="#808080" :text="item.logTime"></u-text>
        </u-col>
      </u-row>
    </view>
    <view v-if="isFriend" class="detail__part">
      <view @click="showDelete = true" class="detail__part__unit">
        <u-text
          iconStyle="color:#565656"
          color="#565656"
          prefixIcon="trash"
          size="32rpx"
          text="&nbsp;&nbsp;&nbsp;删除好友"
        ></u-text>
      </view>
    </view>
    <u-popup
      :safeAreaInsetBottom="false"
      round="20rpx"
      mode="center"
      :show="showCode"
      @close="showCode = false"
    >
      <view class="detail__code">
        <image class="detail__code__img" :src="friendStore.friend.qrCode" />
        <view class="detail__code__text">
          <u-button
            disabled
            customStyle="border:none;width:50rpx;"
            open-type="share"
            icon="share"
          />
          <u-text size="25rpx" align="center" text="分享"></u-text>
        </view>
      </view>
    </u-popup>
    <u-popup
      :safeAreaInsetBottom="false"
      round="20rpx"
      mode="center"
      :show="showNotes"
      @close="showNotes = false"
    >
      <view class="detail__input">
        <u-input
          placeholder="请输入备注"
          border="none"
          maxlength="15"
          :disabledColor="'#fff'"
          v-model="notes"
        />
      </view>
      <view class="detail__notes">
        <u-button text="取消" @click="showNotes = false"></u-button>
        <u-button color="#76acfc" text="确认" @click="confirmUpdateNote"></u-button>
      </view>
    </u-popup>
    <u-popup
      :safeAreaInsetBottom="false"
      round="20rpx"
      mode="bottom"
      :show="showGroup"
      @close="showGroup = false"
      height="auto"
    >
      <scroll-view scroll-y class="detail__groups" style="max-height: 60vh">
        <view class="detail__groups">
          <view
            v-for="(item, index) in useGroupStore().groupsInfo.records"
            :key="index"
            class="detail__groups__item"
            @click="setGroup(item)"
          >
            <u-text
              :color="item.id === friendStore.group.id ? '#3988ff' : ''"
              align="center"
              :text="item.name"
            ></u-text>
          </view>
          <view class="detail__groups__item" @click="setGroup({ id: 0, name: '' })">
            <u-text
              :color="friendStore.group.id === 0 ? '#3988ff' : ''"
              align="center"
              text="暂不分组"
            ></u-text>
          </view>
        </view>
      </scroll-view>
    </u-popup>
    <u-modal
      title="确认删除？"
      @cancel="showDelete = false"
      @confirm="confirmDelete"
      :showCancelButton="true"
      :show="showDelete"
      width="500rpx"
    >
    </u-modal>
    <u-modal
      :title="`确认${groupId === 0 ? '暂不分组' : `移动到${groupName}分组`}?`"
      @cancel="showMove = false"
      @confirm="confirmMoveFriend"
      :showCancelButton="true"
      :show="showMove"
      width="500rpx"
    >
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { Log } from '@/types/friend'
// 引入store
import { useFriendStore, useGroupStore } from '@/stores/friend'
import { determineWhetherFriend } from '@/network/apis/friend'
const friendStore = useFriendStore()
const groupStore = useGroupStore()
const {
  updateFriendNote,
  moveFriend,
  sendApplication,
  getUserInfoData,
  DeleteFriends,
  getFriendLogs
} = friendStore
//接受参数
const props = defineProps<{
  id: number
}>()

// 历史记录日志
const history = ref<Log[]>([])

onLoad(async () => {
  // 发送请求查询是否为好友
  const res = await determineWhetherFriend(props.id)
  if (res.buddy === 0) {
    isFriend.value = false
    getUserInfoData(props.id)
  } else {
    getUserInfoData(props.id)
    history.value = await getFriendLogs(props.id)
    // 从 groupStore 中查找好友所在的分组
    const group = groupStore.groupsInfo.records.find(
      (g) => g.id === friendStore.friend.groupBaseInfo.groupId
    )
    if (group) {
      // 更新当前分组信息
      friendStore.group.id = group.id
      friendStore.group.name = group.name
    } else {
      // 如果没有找到分组，设置为默认值
      friendStore.group.id = 0
      friendStore.group.name = '暂不分组'
    }
  }
})

// 跳转到好友历史交互记录页
const jumpPageHistory = () => {
  uni.navigateTo({
    url: '/pages/user/friends/history/history'
  })
}

// 是否为好友
const isFriend = ref(true)
// 确认添加好友
async function confirmAddFriend() {
  await sendApplication(friendStore.friend.id, friendStore.friend.notes, '', '')
  uni.showToast({
    title: '好友申请发送成功',
    icon: 'none'
  })
}

// 显示二维码弹窗
const showCode = ref(false)
let groupId = 0
let groupName = ''

// 控制分组弹窗显示
const showGroup = ref(false)
// 设置分组
const setGroup = (item: any) => {
  if (item.id === friendStore.group.id) return
  groupId = item.id
  groupName = item.name
  showMove.value = true
}

// 显示删除好友弹窗
const showDelete = ref(false)
// 确认删除
async function confirmDelete() {
  showDelete.value = false
  try {
    await DeleteFriends(friendStore.friend.id)
    uni.showToast({
      title: '删除成功',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch {
    uni.showToast({
      title: '删除失败',
      icon: 'none'
    })
  }
}

// 好友分享
const sendFriend = () => {
  uni.showToast({ title: '当前版本暂不支持！', icon: 'none' })
}

// 显示移动分组弹窗
const showMove = ref(false)
// 确认移动
async function confirmMoveFriend() {
  showMove.value = false
  showGroup.value = false
  try {
    await moveFriend(groupId, [friendStore.friend.id])
    friendStore.group.id = groupId
    friendStore.group.name = groupName
    uni.showToast({
      title: '移动成功',
      icon: 'none'
    })
    console.log(friendStore.oldGroupId)
    friendStore.setNeedRefresh(true, friendStore.oldGroupId)
  } catch {
    uni.showToast({
      title: '移动失败',
      icon: 'none'
    })
    return
  }
}
// 备注
const notes = ref('')
// 显示修改备注
const showNotes = ref(false)
// 确认修改备注
async function confirmUpdateNote() {
  showNotes.value = false
  try {
    await updateFriendNote(friendStore.friend.id, notes.value)
    uni.showToast({
      title: '修改成功',
      icon: 'none'
    })
    friendStore.friend.notes = notes.value
  } catch {
    uni.showToast({
      title: '修改失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.detail {
  box-sizing: border-box;
  padding-top: 120px;
  height: 100vh;
  background-color: #f2f2f2;

  &__item {
    display: flex;
    width: 650rpx;
    margin: 0 auto;
    align-items: center;

    &__information {
      margin-left: 30rpx;
    }

    &__qrCode {
      height: 88rpx;
      margin-left: 10rpx;
    }
  }

  &__code {
    width: 468rpx;
    height: 604rpx;

    &__img {
      width: 320rpx;
      height: 320rpx;
      margin: 60rpx 74rpx 20rpx 74rpx;
    }
  }

  &__part {
    width: 680rpx;
    margin: 0 auto;
    margin-top: 30rpx;
    background-color: #fff;
    border-radius: 10rpx;

    &__unit {
      height: 100rpx;
      padding-left: 20rpx;
      display: flex;
      align-items: center;
      &__arrow {
        width: 50rpx;
      }
    }
    &__history {
      padding-left: 20rpx;
      color: #808080;
      font-size: 27.5rpx;
    }
  }

  &__notes {
    width: 500rpx;
    height: 120rpx;
    display: flex;
    justify-content: space-between;
    margin: 0 20rpx;
  }

  &__input {
    width: 80%;
    margin: 50rpx auto;
  }

  &__groups {
    max-height: 600rpx;
    padding-bottom: 50rpx;
    &__item {
      height: 60rpx;
      margin-top: 20rpx;
      border-bottom: 1px solid #f3f3f5;
    }
  }
}
::v-deep .u-popup__content.data-v-74921bef {
  margin-top: -260rpx !important;
}
</style>
