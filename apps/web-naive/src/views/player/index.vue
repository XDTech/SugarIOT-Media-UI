<!-- eslint-disable no-console -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-empty -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { NFlex, NTabPane, NTabs } from 'naive-ui';

import { fetchProxyPull } from '#/api';

import easyPlayer from './components/easy-player.vue';

const parent = ref(null);
const player = ref<any>();
const item = defineModel<any>({ required: true });

onMounted(() => {
  console.log(item.value, '===');
  createProxy();
});

async function createProxy() {
  try {
    await fetchProxyPull(item.value.id);
    player.value.play(
      `http://192.168.31.208/${item.value.app}/${item.value.stream}.live.flv`,
    );
  } finally {
    //
  }
}
</script>

<template>
  <NFlex style="height: 100%" vertical>
    <easyPlayer ref="player" class="h-1/2" />
    <NTabs animated class="h-1/2" type="line">
      <NTabPane name="addr" tab="实时地址"> Wonderwall </NTabPane>
      <NTabPane name="ptz" tab="远程控制"> Hey Jude </NTabPane>
      <NTabPane name="info" tab="流信息"> 流信息 </NTabPane>
      <NTabPane name="voice" tab="语音对讲"> 七里香 </NTabPane>
    </NTabs>
  </NFlex>
</template>

<style scoped></style>
