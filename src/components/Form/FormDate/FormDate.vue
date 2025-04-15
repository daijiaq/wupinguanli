<template>
  <view class="formDate">
    <u-row>
      <u-col span="3">
        <u-text color="#353535" :bold="true" text="入库日期" />
      </u-col>
      <u-col span="1.6">
        <u-text @click="showDate = canClick" :text="year" />
      </u-col>
      <u-col span="0.7">
        <u-text :bold="true" text="年" />
      </u-col>
      <u-col span="0.8">
        <u-text @click="showDate = canClick" :text="month" />
      </u-col>
      <u-col span="0.7">
        <u-text :bold="true" text="月" />
      </u-col>
      <u-col span="0.8">
        <u-text @click="showDate = canClick" :text="day" />
      </u-col>
      <u-col span="0.7">
        <u-text :bold="true" text="日" />
      </u-col>
    </u-row>
    <u-picker
      :defaultIndex="defaultDate"
      @confirm="setDate"
      @change="changeDate"
      :immediateChange="true"
      @cancel="showDate = false"
      :show="showDate"
      :columns="dateList"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  //日期时间戳
  date: number
  //是否能点开日期弹窗
  canClick: boolean
}>()
const emits = defineEmits<{
  //更新日期值
  (e: 'update:date', date: Date): void
}>()
//是否显示日期
const showDate = ref(false)
//传入时间戳
const time = new Date(props.date)
//年
const year = ref(time.getFullYear())
//月
const month = ref(time.getMonth() + 1)
//日
const day = ref(time.getDate())
//默认日期(当前日期)
const defaultDate = ref([new Date().getFullYear() - year.value + 9, month.value - 1, day.value - 1])
//修改日期时触发的回调
const changeDate = (e: any) => {
  const tempDate = new Date()
  if (e.value[0] === tempDate.getFullYear()) {
    dateList.value[1] = []
    for (let i = 1; i <= tempDate.getMonth() + 1; i++) {
      dateList.value[1].push(i)
    }
  } else {
    dateList.value[1] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }
  if (e.value[0] % 4 === 0 && e.value[0] % 100 !== 0 && e.value[1] === 2)
    dateList.value[2] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29
    ]
  else if (e.value[0] % 4 !== 0 && e.value[1] === 2)
    dateList.value[2] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28
    ]
  else if (e.value[1] === 4 || e.value[1] === 6 || e.value[1] === 9 || e.value[1] === 11)
    dateList.value[2] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30
    ]
  else if (e.value[0] === tempDate.getFullYear() && e.value[1] === tempDate.getMonth() + 1) {
    dateList.value[2] = []
    for (let i = 1; i <= tempDate.getDate(); i++) {
      dateList.value[2].push(i)
    }
  } else
    dateList.value[2] = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 31
    ]
}
//日期选择数组
const dateList = ref([
  [
    year.value - 9,
    year.value - 8,
    year.value - 7,
    year.value - 6,
    year.value - 5,
    year.value - 4,
    year.value - 3,
    year.value - 2,
    year.value - 1,
    year.value
  ],
  [],
  []
])
for (let i = 1; i <= new Date().getMonth() + 1; i++) {
  dateList.value[1].push(i)
}
for (let i = 1; i <= new Date().getDate(); i++) {
  dateList.value[2].push(i)
}
//设置日期的回调
const setDate = (e: any): void => {
  year.value = e.value[0]
  month.value = e.value[1]
  day.value = e.value[2]
  showDate.value = false
  defaultDate.value[0] = new Date().getFullYear() - year.value
  defaultDate.value[1] = month.value - 1
  defaultDate.value[2] = day.value - 1
  emits('update:date', new Date(year.value, month.value - 1, day.value))
}
</script>

<style scoped lang="scss">
.formDate {
  margin-bottom: 10px;
}
</style>
