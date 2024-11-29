<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

let jess: any = null;

const openM = ref(false);
const [playerModal, playerModalAPI] = useVbenModal({
  footer: false,
  onBeforeClose: async () => {
    if (jess) {
      await jess.destroy();
      jess = null;
      return true;
    }

    return false;
  },
  onOpenChange: async (open) => {
    if (open) {
      openM.value = true;
      nextTick(() => {
        initPlayer();
      });
    }
  },
});

// jess
const container = ref(null);

onMounted(async () => {
  // 等待 Vue 渲染完成
});

function initPlayer() {
  setTimeout(() => {
    // https://live.nodemedia.cn:8443/live/b480_264.flv
    jess = new (window as any).Jessibuca({
      container: '#container',
      videoBuffer: Number(1), // 缓存时长
      isResize: false,
      decoder: '../../public/player/decoder.js',
      text: '加载中',
      loadingText: '加载中...',
      wasm: true,
      vc: 'ff',
      playing: false,
      quieting: true,
      loaded: false, // mute
      showOperateBtns: false,
      showBandwidth: true,
      err: '22',
      operateBtns: {
        /** 是否显示全屏按钮 */
        fullscreen: true,
        /** 是否显示截图按钮 */
        screenshot: true,
        /** 是否显示播放暂停按钮 */
        play: true,
        /** 是否显示声音按钮 */
        audio: true,
        /** 是否显示录制按 */
        record: true,
      },
      speed: 0,
      performance: '',
      volume: 1,
      rotate: 0,
      useWCS: true,
      useMSE: true,
      useOffscreen: false,
      recording: false,
      recordType: 'webm',
      scale: 0,
    });

    jess.on('loadingTimeout', () => {
      console.log('timeout');
    });
    jess.on('play', () => {
      console.log('play');
    });
    jess.on('buffer', (buffer: any) => {
      console.log('buffer', buffer);
    });

    jess.on('stats', (stats: any) => {
      console.log('stats', stats);
    });

    jess.on('kBps', (kBps: any) => {
      console.log('kBps', kBps);
    });
    jess.toggleControlBar(true);
    print();
  }, 0);
}

function print() {
  jess?.play('http://pull-demo.volcfcdnrd.com/live/st-4536521_yzmuhevcd.flv');
}
</script>

<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-new -->
<template>
  <playerModal class="h-[600px] w-[800px]" title="高级配置">
    <div id="container" ref="container"></div>
  </playerModal>
</template>

<style>
#container {
  width: 100%;
  height: 100%;
  background: rgb(13 14 27 / 70%);
}

/* @media (max-width: 720px) {
  #container {
    width: 90vw;
    height: 52.7vw;
  }
} */
</style>
