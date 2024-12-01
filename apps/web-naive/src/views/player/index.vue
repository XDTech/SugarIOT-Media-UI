<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-console -->
<script lang="ts" setup>
import type Jessibuca from '#/jessibuca';

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
      videoBuffer: 0.1, // 缓存时长
      decoder: '/public/jess/decoder.js',
      text: '加载中',
      heartTimeout: 5,
      heartTimeoutReplay: true,
      heartTimeoutReplayTimes: 3,
      hiddenAutoPause: false,
      hotKey: true,
      isFlv: false,
      isFullResize: false,
      isResize: false,
      keepScreenOn: true,
      loadingText: '请稍等, 视频加载中......',
      loadingTimeout: 10,
      loadingTimeoutReplay: true,
      loadingTimeoutReplayTimes: 3,
      openWebglAlignment: false,
      operateBtns: {
        fullscreen: true,
        screenshot: true,
        play: true,
        audio: true,
        record: true,
      },
      recordType: 'mp4',
      rotate: 0,
      showBandwidth: false,
      supportDblclickFullscreen: false,
      timeout: 10,
      useMSE: false,
      useWCS: false,
      useWebFullScreen: true,
      wasmDecodeErrorReplay: true,
      wcsUseVideoRender: true,
    }) as Jessibuca;

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
    play();
  }, 0);
}

function play() {
  jess?.play('http://192.168.31.208/live/test.live.flv');
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
}
</style>
