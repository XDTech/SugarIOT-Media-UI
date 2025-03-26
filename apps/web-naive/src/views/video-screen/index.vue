<script setup lang="ts">
import type { TreeOption } from 'naive-ui';

import { h, ref } from 'vue';

import {
  NBadge,
  NButton,
  NCollapse,
  NCollapseItem,
  NFlex,
  NGrid,
  NGridItem,
  NIcon,
  NInput,
  NInputGroup,
  NLayout,
  NLayoutSider,
  NPopover,
  NSpace,
  NTree,
} from 'naive-ui';
import screenfull from 'screenfull';

import { message } from '#/adapter/naive';
import { fetchProxyAddress, fetchPushAddr, getScreenList } from '#/api';
import { fetchChannelInvite } from '#/api/core/gb';
import ptz from '#/views/ptz/index.vue';

import screenBox from './components/screen-box.vue';

const boxPrefix = 'screen-box-';
const pattern = ref('');
const showIrrelevantNodes = ref(false);
const data = ref<TreeOption[]>([]);
const layout = ref({
  row: 1,
  col: 1,
});
const mapCon = ref(new Map());
const selectedItem = ref();
const gridRef = ref(null); // 用于获取 NGrid 组件的 DOM
const currItem = ref();
const ptzRef = ref();
const onlineIcon = h(
  NBadge,
  {
    processing: true,
    type: 'success',
  },
  {
    value: () =>
      h('span', {
        class: 'icon-[line-md--sun-rising-loop]',
      }),
  },
);

const offlineIcon = h(
  NBadge,
  {
    processing: true,
    type: 'error',
  },
  {
    value: () =>
      h('span', {
        class: 'icon-[line-md--hazard-lights-off-loop]',
      }),
  },
);
const transformToTree = (data: any[], parentId: string): TreeOption[] => {
  return data
    .filter((node) => node.parentId === parentId)
    .map((node) => {
      const children = transformToTree(data, node.id);
      return {
        item: node,
        key: node.id,
        label: node.name,
        disabled: false,

        prefix: () =>
          node.nodeType === '0'
            ? h(NIcon, null, {
                default: () =>
                  h('span', {
                    class: 'icon-[fxemoji--folder]',
                  }),
              })
            : h(NIcon, null, {
                default: () =>
                  h('span', {
                    class: 'icon-[fxemoji--handheldvideocamera]',
                  }),
              }),
        suffix: () => (node.status === 'online' ? onlineIcon : offlineIcon),

        isLeaf: children.length === 0,
        children: children.length > 0 ? children : undefined,
      };
    });
};

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      const item = option.item as any;
      if (item.nodeType === '0') return;
      fetchPlayer(option.item);
    },
  };
};

async function fetchPlayer(item: any) {
  let data = null;
  switch (item.types) {
    case 'live': {
      if (item.status === 'offline') {
        message.error('设备不在线');
        return;
      }
      data = await fetchPushAddr(item.id);

      break;
    }
    case 'proxy': {
      data = await fetchProxyAddress(item.id);

      break;
    }
    case 'rtp': {
      data = await fetchChannelInvite(item.id);

      break;
    }
  }

  if (data) {
    const url = data.RtmpMediaSource[0];
    playBox(url, item);
  }
}

async function getScreen() {
  const res = await getScreenList();

  data.value = transformToTree(res, '0');
}
getScreen();

const setBoxRef = (index: any) => {
  return (el: any) => {
    if (el) {
      mapCon.value.set(`${boxPrefix}${index}`, el); // 存储每个 `screenBox` 组件的实例或 DOM
    }
  };
};

function genScreen(duration: number) {
  layout.value = {
    row: duration,
    col: duration,
  };
}
function changeBorderColor(index: any) {
  selectedItem.value = index;
}

function getItemStyle(index: any) {
  return {
    border:
      selectedItem.value === index
        ? '1px solid yellow'
        : '1px solid transparent',
    cursor: 'pointer',
  };
}

function playBox(url: string, item: any) {
  if (!selectedItem.value) {
    message.error('请选择播放屏幕');
    return;
  }

  const box = mapCon.value.get(`${boxPrefix}${selectedItem.value}`);
  if (box) {
    // box.replay(
    //   'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8',
    // );
    currItem.value = item;
    box.receiveItem(item);
    ptzRef.value.receiveItem(item);
    box.replay(url);
  }
}
// 切换全屏
const toggleFullScreen = () => {
  const grid = gridRef.value;
  if (grid && screenfull.isEnabled) {
    screenfull.toggle(grid); // 使用 screenfull 来切换全屏
  }
};

function itemCallback(item: any) {
  currItem.value = item;
  ptzRef.value.receiveItem(item);
}
</script>
<template>
  <div class="screen-container">
    <NLayout has-sider position="absolute">
      <NLayoutSider
        :collapsed-width="0"
        bordered
        collapse-mode="width"
        content-style="padding: 24px;"
        show-trigger="arrow-circle"
      >
        <NSpace vertical>
          <NCollapse :default-expanded-names="['2', '1']">
            <NCollapseItem name="1" title="媒体列表">
              <NInputGroup>
                <NInput v-model:value="pattern" placeholder="搜索" />
                <NButton @click="getScreen">
                  <template #icon>
                    <span class="icon-[ant-design--reload-outlined]"> </span>
                  </template>
                  刷新
                </NButton>
              </NInputGroup>
              <NTree
                :data="data"
                :node-props="nodeProps"
                :pattern="pattern"
                :show-irrelevant-nodes="showIrrelevantNodes"
                block-line
                show-line
              />
            </NCollapseItem>
            <NCollapseItem name="2" title="云台控制">
              <ptz ref="ptzRef" />
            </NCollapseItem>
          </NCollapse>
        </NSpace>
      </NLayoutSider>

      <NFlex style="gap: 0; width: 100%" vertical>
        <div ref="gridRef" style="height: 100%">
          <NGrid
            :cols="layout.col"
            style="height: 100%; background-color: #333"
          >
            <NGridItem
              v-for="index in layout.row * layout.col"
              :key="index"
              :style="getItemStyle(index)"
              @click="changeBorderColor(index)"
            >
              <screenBox
                :ref="setBoxRef(index)"
                :keys="`screen_${index}`"
                class="screen-box"
                @item-callback="itemCallback"
              />
            </NGridItem>
          </NGrid>
        </div>
        <NFlex
          justify="end"
          style="
            height: 40px;
            padding-top: 5px;
            padding-right: 5px;
            background-color: rgb(36 44 61 / var(--tw-bg-opacity, 1));
          "
        >
          <NPopover trigger="hover">
            <template #trigger>
              <NButton size="small" style="color: white" @click="genScreen(1)">
                <template #icon>
                  <span
                    class="icon-[material-symbols-light--computer-outline-rounded]"
                  ></span>
                </template>
              </NButton>
            </template>
            <span>1画面</span>
          </NPopover>

          <NPopover trigger="hover">
            <template #trigger>
              <NButton size="small" style="color: white" @click="genScreen(2)">
                <template #icon>
                  <span
                    class="icon-[material-symbols-light--computer-outline-rounded]"
                  ></span>
                </template>
              </NButton>
            </template>
            <span>4画面</span>
          </NPopover>
          <NPopover trigger="hover">
            <template #trigger>
              <NButton size="small" style="color: white" @click="genScreen(3)">
                <template #icon>
                  <span
                    class="icon-[material-symbols-light--computer-outline-rounded]"
                  ></span>
                </template>
              </NButton>
            </template>
            <span>9画面</span>
          </NPopover>
          <NPopover trigger="hover">
            <template #trigger>
              <NButton size="small" style="color: white" @click="genScreen(4)">
                <template #icon>
                  <span
                    class="icon-[material-symbols-light--computer-outline-rounded]"
                  ></span>
                </template>
              </NButton>
            </template>
            <span>16画面</span>
          </NPopover>
          <NButton size="small" style="color: white" @click="toggleFullScreen">
            <template #icon>
              <span
                class="icon-[material-symbols-light--fit-screen-outline]"
              ></span>
            </template>
          </NButton>
        </NFlex>
      </NFlex>
    </NLayout>
  </div>
</template>

<style scoped>
.screen-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.screen-box {
  height: 100%;
  background-color: black;
}
</style>
