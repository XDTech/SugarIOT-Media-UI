<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { antdDelete, antdEdit, MdiPlus } from '@vben/icons';

import { NButton, NPopconfirm, NTag, NText } from 'naive-ui';

import { message } from '#/adapter/naive';
import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { deleteRole, getRolePageList } from '#/api';

import RoleFormModal from './components/role-form-modal.vue';

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
      field: 'name',
      title: '名称',
      slots: { default: 'name' },
    },
    { field: 'identity', title: '标识', slots: { default: 'identity' } },
    { field: 'sort', title: '排序', slots: { default: 'sort' } },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    { field: 'remarks', title: '备注' },

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

          return await getRolePageList({
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

const [roleModal, roleModalAPI] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: RoleFormModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = roleModalAPI.getData();
      if (d.refresh) {
        gridApi.reload();
      }
    }
  },
});
function add() {
  roleModalAPI.setState({ title: '添加角色' });

  roleModalAPI.setData({ operator: 'add' });
  roleModalAPI.open();
}
function edit(item: any) {
  roleModalAPI.setState({ title: `编辑【${item.name}】` });

  roleModalAPI.setData({ operator: 'edit', ...item });
  roleModalAPI.open();
}

async function deleteItem(id: string) {
  loading(true);
  try {
    await deleteRole(id);
    message.success('操作成功');
    gridApi.query();
  } finally {
    loading(false);
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="角色列表">
      <template #toolbar-tools>
        <NButton circle @click="add">
          <template #icon>
            <MdiPlus />
          </template>
        </NButton>
      </template>

      <template #name="{ row }">
        <NText type="info">
          {{ row.name }}
        </NText>
      </template>

      <template #identity="{ row }">
        <NTag size="small" type="success">
          {{ row.identity }}
        </NTag>
      </template>

      <template #sort="{ row }">
        <NTag round size="small" type="info">
          {{ row.sort }}
        </NTag>
      </template>

      <template #status="{ row }">
        <NTag v-if="row.status === 'normal'" round size="small" type="success">
          启用
        </NTag>
        <NTag v-if="row.status === 'locked'" round size="small" type="error">
          禁用
        </NTag>
      </template>

      <template #action="{ row }">
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

    <roleModal />
  </Page>
</template>
