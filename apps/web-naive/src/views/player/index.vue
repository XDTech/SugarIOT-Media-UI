<!-- eslint-disable no-console -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-empty -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

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
import { fetchProxyAddress, fetchPushAddr } from '#/api';
import { fetchChannelInvite } from '#/api/core/gb';
import { Mscopy, MsPlay } from '#/icons/index';
import { copyToClipboard } from '#/utils/util';
import ptz from '#/views/ptz/index.vue';

import easyPlayer from './components/easy-player.vue';

const props = defineProps({
  types: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['playSuccess']);
const parent = ref(null);
const ptzControl = ref();
const player = ref<any>();
const item = defineModel<any>({ required: true });
onMounted(() => {
  createProxy();
});
function receiveItem() {
  ptzControl.value?.receiveItem(item.value);
}
const currentPlayerAddr = ref();
const searchPlayerAddr = ref();
const options = ref<any[]>([]);
// 定义一个变量来接收父组件传来的方法
async function createProxy() {
  try {
    let data: any = null;
    console.log('props.types', props.types);
    switch (props.types) {
      case 'gb': {
        data = await fetchChannelInvite(item.value.id);

        break;
      }
      case 'live': {
        data = await fetchPushAddr(item.value.id);

        break;
      }
      case 'proxy': {
        data = await fetchProxyAddress(item.value.id);

        break;
      }
      case 'rtp': {
        data = await fetchChannelInvite(item.value.relevanceId);

        break;
      }
      // No default
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
  await copyToClipboard(text); // 将文本写入剪贴板

  message.success('复制成功');
}

function play() {
  player.value.replay(searchPlayerAddr.value);
  currentPlayerAddr.value = searchPlayerAddr.value;
}
</script>

<template>
  <NFlex style="height: 100%" vertical>
    <easyPlayer ref="player" class="h-2/3" />
    <NTabs animated class="h-1/3" type="line">
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
      <NTabPane name="ptz" tab="远程控制">
        <ptz ref="ptzControl" :item="item" layout="center" />
      </NTabPane>
    </NTabs>
  </NFlex>
</template>

<style scoped></style>
