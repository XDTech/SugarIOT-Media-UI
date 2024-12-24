<!-- eslint-disable no-console -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-empty -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Mscopy, MsPlay } from '@vben/icons';
import { copyToClipboard } from '@vben/utils';

import {
  NButton,
  NFlex,
  NInput,
  NInputGroup,
  NInputGroupLabel,
  NPopover,
  NSelect,
  NTabPane,
  NTabs,
} from 'naive-ui';

import { message } from '#/adapter/naive';
import { fetchProxyAddress } from '#/api';
import { fetchChannelInvite } from '#/api/core/gb';

import easyPlayer from './components/easy-player.vue';

const props = defineProps({
  types: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['playSuccess']);
const parent = ref(null);
const player = ref<any>();
const item = defineModel<any>({ required: true });
onMounted(() => {
  console.log(item.value, '===');
  createProxy();
});
const currentPlayerAddr = ref();
const searchPlayerAddr = ref();
const options = ref<any[]>([]);
// 定义一个变量来接收父组件传来的方法
async function createProxy() {
  try {
    let data: any = null;
    if (props.types === 'gb') {
      data = await fetchChannelInvite(item.value.id);
    } else if (props.types === 'proxy') {
      data = await fetchProxyAddress(item.value.id);
    }

    if (data) {
      currentPlayerAddr.value = data.RtmpMediaSource[2];
      searchPlayerAddr.value = currentPlayerAddr.value;
      player.value.play(currentPlayerAddr.value);

      for (const key in data) {
        const element: any = data[key];

        const group: any = {
          type: 'group',
          label: key,
          key,
          children: [],
        };

        for (const item of element) {
          if (item.startsWith('https')) continue;
          if (item.startsWith('wss')) continue;
          group.children.push({ label: item, value: item });
        }

        options.value.push(group);
      }
      emit('playSuccess', item.value.id);
    }
  } finally {
    //
  }
}
// 复制
async function copy(text: string) {
  const res = await copyToClipboard(text); // 将文本写入剪贴板

  if (res) {
    message.success('复制成功');
  } else {
    message.success('复制失败');
  }
}

function play() {
  player.value.replay(searchPlayerAddr.value);
  currentPlayerAddr.value = searchPlayerAddr.value;
}
</script>

<template>
  <NFlex style="height: 100%" vertical>
    <easyPlayer ref="player" class="h-1/2" />
    <NTabs animated class="h-1/2" type="line">
      <NTabPane name="addr" tab="实时地址">
        <NInputGroup>
          <NInputGroupLabel>播放地址</NInputGroupLabel>
          <NInput v-model:value="currentPlayerAddr" :disabled="true" />
          <NInputGroupLabel @click="copy(currentPlayerAddr)">
            <NButton quaternary type="primary">
              <template #icon>
                <Mscopy />
              </template>
            </NButton>
          </NInputGroupLabel>
        </NInputGroup>

        <NInputGroup style="margin-top: 10px">
          <NInputGroupLabel>更多地址</NInputGroupLabel>
          <NSelect
            v-model:value="searchPlayerAddr"
            :options="options"
            filterable
          />
          <NPopover trigger="hover">
            <template #trigger>
              <NInputGroupLabel @click="play">
                <NButton quaternary type="primary">
                  <template #icon>
                    <MsPlay />
                  </template>
                </NButton>
              </NInputGroupLabel>
            </template>
            播放当前地址
          </NPopover>
        </NInputGroup>
      </NTabPane>
      <NTabPane name="ptz" tab="远程控制"> Hey Jude </NTabPane>
      <NTabPane name="info" tab="流信息"> 流信息 </NTabPane>
      <NTabPane name="voice" tab="语音对讲"> 七里香 </NTabPane>
    </NTabs>
  </NFlex>
</template>

<style scoped></style>
