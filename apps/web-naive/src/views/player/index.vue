<!-- eslint-disable no-console -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-empty -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { NFlex, NTabPane, NTabs } from 'naive-ui';

import easyPlayer from './components/easy-player.vue';

const parent = ref(null);
const item = defineModel<any>({ required: true });

onMounted(() => {
  console.log(item.value, '===');
});

function getNode() {}
</script>

<template>
  <NFlex style="height: 100%" vertical>
    <easyPlayer class="h-1/2" />
    <NTabs animated class="h-1/2" type="line">
      <NTabPane name="oasis" tab="实时地址"> Wonderwall </NTabPane>
      <NTabPane name="the beatles" tab="远程控制"> Hey Jude </NTabPane>
      <NTabPane name="the beatles" tab="流信息"> 流信息 </NTabPane>
      <NTabPane name="jay chou" tab="语音对讲"> 七里香 </NTabPane>
    </NTabs>
  </NFlex>
</template>

<style scoped></style>
