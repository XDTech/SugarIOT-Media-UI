<!-- eslint-disable no-console -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-empty -->
<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

const playerInfo = ref<any>();

const [playerModal, playerModalAPI] = useVbenModal({
  footer: false,
  onBeforeClose: async () => {
    if (playerInfo.value) {
      await playerInfo.value.destroy();
      playerInfo.value = null;
      return true;
    }

    return false;
  },
  onOpenChange: async (open) => {
    if (open) {
      nextTick(() => {
        setTimeout(() => {
          playCreate();
        }, 0);
      });
    }
  },
});

function playCreate() {
  const container = document.querySelector('#player_box1');
  const easyplayer = new (window as any).EasyPlayerPro(container, {
    isLive: true,
    bufferTime: 0.2,
    stretch: false,
    MSE: false,
    WCS: false,
    hasAudio: true,
  });

  easyplayer.on('fullscreen', (flag: any) => {
    console.log('is fullscreen', flag);
  });
  easyplayer.on('playbackRate', (rate: any) => {
    easyplayer.setRate(rate);
  });

  easyplayer.on('playbackSeek', (data: any) => {
    console.log('playbackSeek', data);
  });
  playerInfo.value = easyplayer;

  play();
}

function play() {
  playerInfo.value?.play('ws://192.168.31.208/live/test.live.flv');
}
</script>

<template>
  <playerModal class="h-[600px] w-[800px]" title="高级配置">
    <div id="player_box1" class="player-box"></div>
  </playerModal>
</template>

<style scoped>
.player-box {
  position: absolute;
  inset: 0;
  height: 80%;
}
</style>
