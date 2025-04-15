<template>
  <view class="empty">
    <image :src="emptyUrl" :style="{ width: width + 'rpx', height: height + 'rpx' }"></image>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    type: 'space' | 'search' | 'deleted' | 'history'
    width?: number
    height?: number
  }>(),
  {
    width: 350,
    height: 440
  }
)

const emptyUrl = ref('https://www.szlab.xyz/item/image/2025/03/08/ZacZaZbeZdcbZdlosxomf.png')

switch (props.type) {
  case 'space':
    emptyUrl.value = 'https://www.szlab.xyz/item/image/2025/03/08/ZacZaZbeZdcbZdlosxomf.png'
    break
  case 'search':
    emptyUrl.value = 'https://www.szlab.xyz/item/image/2025/03/08/cZZbbeabaZbrdZqbg7losxomf.png'
    break
  case 'deleted':
    emptyUrl.value = 'https://www.szlab.xyz/item/image/2025/03/08/dZddbceedZZbcdkdsdc7losxomf.png'
    break
  case 'history':
    emptyUrl.value = 'https://www.szlab.xyz/item/image/2025/03/08/eZbbcbcZdeZghrsnqx7losxomf.png'
    break
}
</script>

<style lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 32%;
}
</style>
