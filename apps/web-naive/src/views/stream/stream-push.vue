<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import {
  antdDelete,
  antdDisconnect,
  antdEdit,
  MdiPlus,
  MsPlay,
} from '@vben/icons';

import { NButton, NPopconfirm, NPopover, NTag, NText } from 'naive-ui';

import { message } from '#/adapter/naive';
import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { fetchClosePush, fetchDelPull, fetchPushList } from '#/api';
import { fetchSendBye } from '#/api/core/gb';
import dayjs, { formatDuration } from '#/utils/dayjs-util';
import { getStreamPrefix } from '#/utils/util';

import PlayerComponent from '../player/index.vue';
import StreamPullFormModal from './components/stream-pull-form-modal.vue';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}
const tenantCodePrefix = ref(getStreamPrefix());
const types = ref();
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
      title: '名称',
      width: 300,
      field: 'name',
      fixed: 'left',
      slots: { default: 'name' },
    },
    {
      field: 'app',
      title: '应用名',
      width: 200,
      slots: { default: 'app' },
    },
    {
      field: 'stream',
      title: '流地址',
      width: 300,
      slots: { default: 'stream' },
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },

    {
      field: 'totalReaderCount',
      title: '观看人数',
      width: 100,
    },
    {
      field: 'bytesSpeed',
      title: '速度',
      width: 150,
    },
    {
      field: 'schema',
      title: '推流方式',
      width: 100,
      slots: { default: 'schema' },
    },
    {
      field: 'originTypeStr',
      title: '产生源类型',
      width: 100,
    },

    {
      field: 'aliveSecond',
      title: '持续时间',

      slots: { default: 'aliveSecond' },

      width: 300,
    },
    {
      field: 'pushAt',
      title: '最近推流时间',
      formatter: 'formatDateTime',
      width: 300,
    },
    {
      field: 'createAt',
      title: '创建时间',
      formatter: 'formatDateTime',
      width: 300,
    },
    {
      field: 'updateAt',
      title: '更新时间',
      formatter: 'formatDateTime',
      width: 300,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 300,
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
          return await fetchPushList({
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

const [streamModal, streamModalAPI] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: StreamPullFormModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = streamModalAPI.getData();
      if (d.refresh) {
        gridApi.reload();
      }
    }
  },
});
function add() {
  streamModalAPI.setState({ title: '添加拉流代理' });

  streamModalAPI.setData({ operator: 'add' });
  streamModalAPI.open();
}
function edit(item: any) {
  streamModalAPI.setState({ title: `编辑【${item.name}】` });

  streamModalAPI.setData({ operator: 'edit', ...item });
  streamModalAPI.open();
}

async function deleteItem(id: string) {
  loading(true);
  try {
    await fetchDelPull(id);
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
  title.value = `【${i.name}】视频预览`;
  types.value = i.app;
  playerModalAPI.open();
}
// watch(state, (_msg) => {
//   playerHight.value = state.value.fullscreen ? 600 : 300;
// });

async function closePlayer(item: any) {
  loading(true);
  try {
    //  loading(true);
    await (item.app === 'rtp'
      ? fetchSendBye(item.id)
      : fetchClosePush(item.id));
    gridApi.query();
    message.success('操作成功');
  } finally {
    loading(false);
  }
}

// 播放成功回调，修改状态为0
function playSuccess(_id: string) {
  // const data = gridApi.grid.getData();
  // const item = data.find((item) => item.id === id);
  // if (item && item.status === '1') {
  //   item.status = '0';
  // }
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
    <Grid table-title="拉流代理列表" table-title-help="提示">
      <template #toolbar-tools>
        <NPopover trigger="hover">
          <template #trigger>
            <NButton circle @click="add">
              <template #icon>
                <MdiPlus />
              </template>
            </NButton>
          </template>
          添加拉流代理
        </NPopover>
      </template>

      <template #name="{ row }">
        <NText type="info">
          {{ row.name }}
        </NText>
      </template>

      <template #app="{ row }">
        <NTag round size="small" type="info">
          {{ row.app }}
        </NTag>
      </template>

      <template #stream="{ row }">
        <NTag round size="small" type="info">
          {{ row.stream.slice(tenantCodePrefix.length) }}
        </NTag>
      </template>
      <template #url="{ row }">
        <NText type="info" @click="copyToClipboard(row.url)">
          {{ row.url }}
        </NText>
      </template>

      <template #status="{ row }">
        <NTag v-if="row.status === 'online'" round size="small" type="success">
          正在推流
        </NTag>
        <NTag v-if="row.status === 'offline'" round size="small" type="error">
          暂未推流
        </NTag>
      </template>

      <template #schema="{ row }">
        <NTag round size="small" type="primary">
          {{ row.schema }}
        </NTag>
      </template>
      <template #aliveSecond="{ row }">
        <NTag round size="small" type="primary">
          {{ formatDuration(dayjs.duration(row.aliveSecond, 'seconds')) }}
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
              确定关闭推流吗？
            </NPopconfirm>
          </template>
          <span>关闭推流</span>
        </NPopover>

        <NButton circle quaternary type="primary" @click="edit(row)">
          <template #icon>
            <antdEdit />
          </template>
        </NButton>

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
        :types="types"
        @play-success="playSuccess"
      />
    </playerModal>
  </Page>
</template>
