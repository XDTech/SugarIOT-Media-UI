<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { antdDelete, antdDisconnect, MsPlay } from '@vben/icons';

import { NButton, NPopconfirm, NPopover, NTag, NText } from 'naive-ui';

import { message } from '#/adapter/naive';
import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import {
  fetchChannelPageList,
  fetchDelChannel,
  fetchSendBye,
} from '#/api/core/gb';

import PlayerComponent from '../../player/index.vue';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      componentProps: {
        placeholder: '请输入名称',
      },
      label: '名称',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};
const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '通道名称',
      width: 200,
      field: 'channelName',
      fixed: 'left',
      slots: { default: 'name' },
    },

    {
      title: '通道ID',
      width: 200,
      slots: { default: 'channelCode' },
    },
    {
      field: 'deviceName',
      title: '设备名称',
      width: 200,
    },
    {
      field: 'deviceCode',
      title: '设备ID',
      width: 200,
      slots: { default: 'deviceCode' },
    },

    {
      title: '厂家',
      width: 150,
      field: 'manufacturer',
    },
    {
      title: '地址',
      width: 150,
      field: 'address',
    },
    {
      title: '类型',
      width: 100,
      field: 'model',
    },
    {
      field: 'status',
      title: '通道状态',
      width: 100,
      slots: { default: 'status' },
    },
    {
      field: 'status',
      title: '播放状态',
      width: 100,
      slots: { default: 'playStatus' },
    },

    {
      title: '经度',
      width: 150,
      field: 'lng',
    },
    {
      title: '纬度',
      width: 150,
      field: 'lat',
    },
    {
      title: 'PTZ类型',
      width: 150,
      field: 'ptzType',
      slots: { default: 'ptzType' },
    },
    {
      field: 'syncTime',
      title: '同步时间',
      formatter: 'formatDateTime',
      width: 300,
    },
    {
      field: 'createdAt',
      title: '创建时间',
      formatter: 'formatDateTime',
      width: 300,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 200,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  exportConfig: {},
  importConfig: {},
  proxyConfig: {
    response: {
      result: 'data',
      total: 'total',
    },
    ajax: {
      query: async ({ page }, formValues) => {
        try {
          loading(true);

          // if (formValues && formValues.isTrusted) {
          //   formValues = {};
          // }
          return await fetchChannelPageList({
            pi: page.currentPage,
            ps: page.pageSize,
            ...formValues,
          });
        } finally {
          //
          setTimeout(() => {
            loading(false);
          }, 200);
        }
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    import: false,
    refresh: false,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

function loading(params: boolean) {
  gridApi.setLoading(params);
}

async function deleteItem(id: string) {
  loading(true);
  try {
    await fetchDelChannel(id);
    message.success('操作成功');
    gridApi.query();
  } finally {
    loading(false);
  }
}

// 播放器model

const [playerModal, playerModalAPI] = useVbenModal({
  // 连接抽离的组件
  footer: false,
});

// const state = playerModalAPI.useStore();
const item = ref();
const title = ref();
function openPlayer(i: any) {
  item.value = i;
  title.value = `【${i.channelName}】视频预览`;
  playerModalAPI.open();
}
// watch(state, (_msg) => {
//   playerHight.value = state.value.fullscreen ? 600 : 300;
// });

async function closePlayer(item: any) {
  // loading(true);
  try {
    //  loading(true);
    await fetchSendBye(item.id);
    gridApi.query();
    message.success('操作成功');
  } finally {
    // loading(false);
  }
}

// 播放成功回调，修改状态为0
function playSuccess(id: string) {
  const data = gridApi.grid.getData();
  const item = data.find((item) => item.id === id);
  if (item && item.status === '1') {
    item.status = '0';
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text); // 将文本写入剪贴板

    message.success('复制成功');
  } catch {
    message.success('复制失败');
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="通道管理列表" table-title-help="">
      <template #toolbar-tools> </template>

      <template #name="{ row }">
        <NText type="info">
          {{ row.channelName }}
        </NText>
      </template>

      <template #channelCode="{ row }">
        <NTag round size="small" type="info">
          {{ row.channelCode }}
        </NTag>
      </template>

      <template #deviceCode="{ row }">
        <NTag round size="small" type="info">
          {{ row.deviceCode }}
        </NTag>
      </template>

      <template #stream="{ row }">
        <NTag round size="small" type="info">
          {{ row.stream }}
        </NTag>
      </template>
      <template #url="{ row }">
        <NText type="info" @click="copyToClipboard(row.url)">
          {{ row.url }}
        </NText>
      </template>

      <template #status="{ row }">
        <NTag v-if="row.status === 'online'" round size="small" type="success">
          在线
        </NTag>
        <NTag v-if="row.status === 'offline'" round size="small" type="error">
          离线
        </NTag>
      </template>

      <template #playStatus="{ row }">
        <NTag
          v-if="row.playStatus === 'online'"
          round
          size="small"
          type="success"
        >
          正在播放
        </NTag>
        <NTag
          v-if="row.playStatus === 'offline'"
          round
          size="small"
          type="error"
        >
          暂未播放
        </NTag>
      </template>

      <template #ptzType="{ row }">
        <NTag v-if="row.ptzType === 1" round size="small" type="info">
          球机
        </NTag>
        <NTag v-if="row.ptzType === 2" round size="small" type="info">
          半球
        </NTag>
        <NTag v-if="row.ptzType === 3" round size="small" type="info">
          固定枪机
        </NTag>
        <NTag v-if="row.ptzType === 4" round size="small" type="info">
          遥控枪机
        </NTag>
      </template>

      <template #action="{ row }">
        <NPopover trigger="hover">
          <template #trigger>
            <NButton circle quaternary type="primary" @click="openPlayer(row)">
              <template #icon>
                <MsPlay />
              </template>
            </NButton>
          </template>
          <span>播放流</span>
        </NPopover>

        <NPopover trigger="hover">
          <template #trigger>
            <NPopconfirm @positive-click="closePlayer(row)">
              <template #trigger>
                <NButton circle quaternary type="primary">
                  <template #icon>
                    <antdDisconnect />
                  </template>
                </NButton>
              </template>
              确定关闭国标流吗？
            </NPopconfirm>
          </template>
          <span>关闭国标流</span>
        </NPopover>

        <NPopconfirm @positive-click="deleteItem(row.id)">
          <template #trigger>
            <NButton circle quaternary type="error">
              <template #icon>
                <antdDelete />
              </template>
            </NButton>
          </template>
          确定要删除吗？
        </NPopconfirm>
      </template>
    </Grid>

    <streamModal />

    <playerModal :title="title" class="h-[600px] w-[800px]">
      <PlayerComponent
        v-model:model-value="item"
        types="gb"
        @play-success="playSuccess"
      />
    </playerModal>
  </Page>
</template>
