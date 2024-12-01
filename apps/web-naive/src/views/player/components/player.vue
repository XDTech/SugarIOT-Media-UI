<!-- eslint-disable no-console -->
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

let jess: any = null;

async function releasePlayer() {
  if (jess) {
    await jess.destroy();
    jess = null;
    return true;
  }
}

// jess
const container = ref(null);

onMounted(async () => {
  // 等待 Vue 渲染完成
  initPlayer();
});

onUnmounted(async () => {
  await releasePlayer();
});
function initPlayer() {
  // https://live.nodemedia.cn:8443/live/b480_264.flv
  jess = new (window as any).Jessibuca({
    container: '#container',
    videoBuffer: Number(0.1), // 缓存时长
    isResize: false,
    decoder: '/public/jess/decoder.js',
    text: '加载中',
    loadingText: '加载中...',

    wasm: true,
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
}

function play(url: string) {
  jess?.play(url);
}

defineExpose({
  play,
});
</script>

<template>
  <div id="container" ref="container"></div>
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
