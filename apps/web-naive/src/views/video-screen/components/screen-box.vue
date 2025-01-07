<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { NFlex } from 'naive-ui';

import easyPlayer from '#/views/player/components/easy-player.vue';

const props = defineProps({
  keys: {
    type: String,
    default: 'screen_1',
  },
});

const emit = defineEmits(['itemCallback']);
const player = ref<any>();
const playUrl = ref<any>();
const itemInfo = ref<any>();
const playerFlag = ref<any>(false);
const playerTitleShow = ref<any>(false);
onMounted(() => {
  // player.value.play(
  //   'http://192.168.31.208:80/rtp/10000100001111111111_10000100001320000008.live.flv?sign=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MzU5ODM5MzYsInR5cGUiOiJnYiJ9.6lev7dGrtKJ1yizmhwxFGQABxuP7b92vh0RctN1LSsg',
  // );
});

// function play(url: string) {
//   player.value?.play(url);
// }
async function replay(url: string) {
  playUrl.value = url;
  playerFlag.value = true;
  player.value?.replay(url);
}

function receiveItem(item: any) {
  itemInfo.value = item;
}
defineExpose({
  replay,
  receiveItem,
});

function mouseenter() {
  if (!playerFlag.value) return;
  playerTitleShow.value = true;
}
function mouseleave() {
  if (!playerFlag.value) return;
  playerTitleShow.value = false;
}

function close() {
  playerFlag.value = false;
  player.value?.destory();
}

function boxClick() {
  if (playerFlag.value) {
    emit('itemCallback', itemInfo.value);
  }
}
</script>

<template>
  <div style="width: 100%" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <easyPlayer
      v-show="playerFlag"
      ref="player"
      :keys="props.keys"
      style="height: 100%"
      @click="boxClick"
    >
      <template #title>
        <NFlex
          v-if="playerTitleShow"
          justify="space-between"
          style="
            position: fixed;
            z-index: 40; /* 确保在其它元素之上 */
            width: 100%; /* 宽度100% */
            height: 30px; /* 固定高度 */
            padding: 10px;
            font-size: 24px;
            color: white;
          "
        >
          <span>{{ itemInfo.name }}</span>
          <span class="icon-[ant-design--close-outlined]" @click="close"></span>
        </NFlex>
      </template>
    </easyPlayer>
  </div>
</template>

<style scoped></style>
