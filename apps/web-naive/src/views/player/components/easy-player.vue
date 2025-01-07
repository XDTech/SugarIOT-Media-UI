<!-- eslint-disable no-console -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-empty -->
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  keys: {
    type: String,
    default: '1', // 默认值
  },
});

const containerId = ref(`player_box${props.keys}`);

const playerInfo = ref<any>();

function playCreate() {
  const container = document.querySelector(`#${containerId.value}`);
  const easyplayer = new (window as any).EasyPlayerPro(container, {
    isLive: true,
    bufferTime: 0.2,
    stretch: false,
    MSE: false,
    WCS: true,
    hasAudio: true,
    debug: false,
    // poster: '/static/zlm.png',
  });

  easyplayer.on('fullscreen', (flag: any) => {
    console.log('is fullscreen', flag);
  });

  easyplayer.on('decodeHevc', (flag: any) => {
    console.log('is decodeHevc', flag);
  });
  easyplayer.on('playbackRate', (rate: any) => {
    easyplayer.setRate(rate);
  });
  easyplayer.on('error', (_err: any) => {
    console.error('error', _err);
  });

  easyplayer.on('playbackSeek', (data: any) => {
    console.log('playbackSeek', data);
  });
  easyplayer.on('contextmenuClose', async () => {
    console.error('contextmenuClose');
    await destory();
  });
  playerInfo.value = easyplayer;
}

onMounted(() => {
  playCreate();
});
onUnmounted(async () => {
  await destory();
});

async function destory() {
  console.log(playerInfo.value);
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
  destory,
  playCreate,
});
</script>

<template>
  <div :id="containerId" class="player-box">
    <slot name="title"></slot>
  </div>
</template>

<style scoped>
.player-box {
  z-index: 1000;
  background-color: black;
}
</style>
