<!-- eslint-disable no-console -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-empty -->
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

const playerInfo = ref<any>();

function playCreate() {
  const container = document.querySelector('#player_box1');
  const easyplayer = new (window as any).EasyPlayerPro(container, {
    isLive: true,
    bufferTime: 0.2,
    stretch: false,
    MSE: false,
    WCS: false,
    hasAudio: true,
    // poster: '/static/zlm.png',
  });

  easyplayer.on('fullscreen', (flag: any) => {
    console.log('is fullscreen', flag);
  });
  easyplayer.on('playbackRate', (rate: any) => {
    easyplayer.setRate(rate);
  });
  easyplayer.on('error', (_err: any) => {});

  easyplayer.on('playbackSeek', (data: any) => {
    console.log('playbackSeek', data);
  });
  easyplayer.on('contextmenuClose', async () => {
    await destory();
  });
  playerInfo.value = easyplayer;
}
onMounted(() => {
  playCreate();
  console.log(playerInfo);
});
onUnmounted(async () => {
  await destory();
});

async function destory() {
  if (playerInfo.value) {
    await playerInfo.value.destroy();
    playerInfo.value = null;
  }
}
function play(url: string) {
  playerInfo.value?.play(url);
}
async function replay(url: string) {
  await destory();
  playCreate();
  await playerInfo.value?.play(url);
}
defineExpose({
  play,
  replay,
});
</script>

<template>
  <div id="player_box1" class="player-box"></div>
</template>

<style scoped>
.player-box {
  inset: 0;
  z-index: 9000;
  background-color: black;
}
</style>
