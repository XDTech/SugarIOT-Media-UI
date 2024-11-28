<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { antdDelete, antdEdit, MdiPlus, MsPlay } from '@vben/icons';

import { NButton, NPopconfirm, NPopover, NTag } from 'naive-ui';

import { message } from '#/adapter/naive';
import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { fetchDelPull, fetchPullList } from '#/api';

import StreamPullFormModal from './components/stream-pull-form-modal.vue';

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
    { title: '名称', width: 200, field: 'name', fixed: 'left' },
    {
      field: 'app',
      title: '应用名',
      width: 100,
      slots: { default: 'app' },
    },
    {
      field: 'stream',
      title: '流地址',
      width: 100,
      slots: { default: 'stream' },
    },
    { field: 'url', title: 'Url地址', width: 300 },
    {
      field: 'timeoutSec',
      title: '超时时间(秒)',
      width: 150,
      titlePrefix: { content: '拉流超时时间' },
    },
    {
      field: 'enableMp4',
      title: 'MP4录制',
      width: 150,
      slots: { default: 'enableMp4' },
    },
    {
      field: 'createdAt',
      title: '创建时间',
      formatter: 'formatDateTime',
      width: 200,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 150,
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

          return await fetchPullList({
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
    refresh: true,
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

      <template #app="{ row }">
        <NTag round size="small" type="info">
          {{ row.app }}
        </NTag>
      </template>

      <template #stream="{ row }">
        <NTag round size="small" type="info">
          {{ row.stream }}
        </NTag>
      </template>

      <template #enableMp4="{ row }">
        <NTag v-if="row.enableMp4" round size="small" type="success">
          开启
        </NTag>
        <NTag v-if="!row.enableMp4" round size="small" type="error">
          关闭
        </NTag>
      </template>
      <template #action="{ row }">
        <NPopover trigger="hover">
          <template #trigger>
            <NButton circle quaternary type="primary">
              <template #icon>
                <MsPlay />
              </template>
            </NButton>
          </template>
          <span>播放流</span>
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
  </Page>
</template>
