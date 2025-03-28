<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { antdDelete, antdEdit, MdiPlus } from '#/icons/index';

import { NButton, NPopconfirm, NTag, NText } from 'naive-ui';

import { message } from '#/adapter/naive';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDepartment,
  getDepartmentList,
} from '#/api/core/system/department';

import DepartmentFormModal from './components/department-form-modal.vue';

interface RowType {
  date: string;
  id: number;
  name: string;
  parentId: null | number;
  size: number;
  type: string;
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
    { type: 'seq', width: 70 },
    {
      field: 'name',
      minWidth: 300,
      title: '名称',
      treeNode: true,
      slots: { default: 'name' },
    },
    { field: 'sort', title: '排序', slots: { default: 'sort' } },
    { field: 'charge', title: '负责人' },
    { field: 'phone', title: '手机号' },
    { field: 'email', title: '邮箱' },
    { field: 'remarks', title: '备注' },
    {
      field: 'action',
      slots: { default: 'action' },
      title: '操作',
    },
  ],
  pagerConfig: {
    enabled: false,
  },
  minHeight: 300,
  keepSource: true,
  proxyConfig: {
    response: {},
    ajax: {
      query: async ({ page }, formValues) => {
        try {
          loading(true);

          const data = await getDepartmentList(formValues);

          return { items: data };
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
  exportConfig: {},
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: true,
    showIcon: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });
function loading(params: boolean) {
  gridApi.setLoading(params);
}
const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

const collapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};

const [permissionModal, permissionModalAPI] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DepartmentFormModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = permissionModalAPI.getData();
      if (d.refresh) {
        gridApi.reload();
      }
    }
  },
});
function addItem() {
  permissionModalAPI.setState({ title: '添加部门' });

  permissionModalAPI.setData({ operator: 'add' });
  permissionModalAPI.open();
}
function edit(item: any) {
  permissionModalAPI.setState({ title: `编辑【${item.name}】` });

  permissionModalAPI.setData({ operator: 'edit', ...item });
  permissionModalAPI.open();
}
async function deleteItem(id: string) {
  loading(true);
  try {
    await deleteDepartment(id);
    message.success('操作成功');
    gridApi.query();
  } finally {
    loading(false);
  }
}
</script>

<template>
  <Page description="管理部门列表" title="部门管理">
    <Grid table-title="部门列表">
      <template #toolbar-tools>
        <button
          class="vxe-button type--button size--small is--circle"
          title="添加"
          type="button"
          @click="addItem"
        >
          <MdiPlus />
        </button>
      </template>

      <template #name="{ row }">
        <NText type="info">
          {{ row.name }}
        </NText>
      </template>

      <template #status="{ row }">
        <NTag v-if="row.status === 'normal'" round size="small" type="success">
          启用
        </NTag>
        <NTag v-if="row.status === 'locked'" round size="small" type="error">
          禁用
        </NTag>
      </template>

      <template #sort="{ row }">
        <NTag round size="small" type="info">
          {{ row.sort }}
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
    <permissionModal />
  </Page>
</template>
