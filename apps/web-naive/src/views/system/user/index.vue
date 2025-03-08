<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import {
  accountEdit,
  antdDelete,
  MdiPlus,
  userEdit,
  userPwd,
} from '@vben/icons';

import { NButton, NPopconfirm, NPopover, NTag, NText } from 'naive-ui';

import { message } from '#/adapter/naive';
import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { deleteUser, getUserPageList, updateUserAccount } from '#/api';

import PasswordFormModal from './components/password-form-modal.vue';
import UserFormModal from './components/user-form-modal.vue';
import UserInfoFormModal from './components/user-info-form-modal.vue';

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      componentProps: {
        placeholder: '请输入姓名',
      },
      label: '姓名',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};
const gridOptions: VxeGridProps = {
  columns: [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      field: 'name',
      title: '姓名',
      slots: { default: 'name' },
    },
    {
      field: 'username',
      editRender: { name: 'input' },
      title: '用户名',
      slots: { default: 'username' },
    },
    { field: 'roleNames', title: '角色', slots: { default: 'roleNames' } },
    { field: 'departmentName', title: '部门' },
    { field: 'postName', title: '岗位' },
    { field: 'phone', title: '电话' },
    { field: 'email', title: '邮箱' },

    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
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
      width: 200,
    },
  ],
  height: 'auto',
  keepSource: true,
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  validConfig: {
    showMessage: true,
  },
  editRules: {
    username: [{ required: true, message: '必须填写' }],
  },
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

          return await getUserPageList({
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

const [userModal, userModalAPI] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: UserFormModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = userModalAPI.getData();
      if (d.refresh) {
        gridApi.reload();
      }
    }
  },
});

const [infoModal, infoModalAPI] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: UserInfoFormModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = infoModalAPI.getData();
      if (d.refresh) {
        gridApi.reload();
      }
    }
  },
});

const [pwdModal, pwdModalAPI] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: PasswordFormModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = userModalAPI.getData();
      if (d.refresh) {
        gridApi.reload();
      }
    }
  },
});

function add() {
  userModalAPI.setState({ title: '添加用户' });

  userModalAPI.setData({ operator: 'add' });
  userModalAPI.open();
}
function edit(item: any) {
  infoModalAPI.setState({ title: `编辑【${item.name}】` });

  infoModalAPI.setData({ operator: 'edit', ...item });
  infoModalAPI.open();
}

async function deleteItem(id: string) {
  loading(true);
  try {
    await deleteUser(id);
    message.success('操作成功');
    gridApi.query();
  } finally {
    loading(false);
  }
}
function hasEditStatus(row: any) {
  return gridApi.grid?.isEditByRow(row);
}

function editRowEvent(row: any) {
  gridApi.grid?.setEditRow(row);
}

const cancelRowEvent = async (_row: any) => {
  await gridApi.grid?.clearEdit();
  await gridApi.query();
};
async function saveRowEvent(row: any) {
  loading(true);
  const res = await gridApi.grid.validate(row);
  if (res) {
    loading(false);
    return;
  }
  try {
    await gridApi.grid?.clearEdit();

    await updateUserAccount(row.id, row.username);
    message.success('操作成功');
  } catch {
    await gridApi.query();
  } finally {
    loading(false);
  }
}

function editPwd(item: any) {
  pwdModalAPI.setState({ title: `修改【${item.name}】密码` });

  pwdModalAPI.setData({ id: item.id });
  pwdModalAPI.open();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <NPopover trigger="hover">
          <template #trigger>
            <NButton circle @click="add">
              <template #icon>
                <MdiPlus />
              </template>
            </NButton>
          </template>
          添加用户
        </NPopover>
      </template>

      <template #name="{ row }">
        <NText type="info">
          {{ row.name }}
        </NText>
      </template>

      <template #username="{ row }">
        <NTag size="small" type="success">
          {{ row.username }}
        </NTag>
      </template>

      <template #roleNames="{ row }">
        <NTag
          v-for="(roleName, index) in row.roleNames"
          :key="index"
          size="small"
          type="info"
        >
          {{ roleName }}
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
        <template v-if="hasEditStatus(row)">
          <NButton circle quaternary type="primary" @click="saveRowEvent(row)">
            保存
          </NButton>
          <NButton
            circle
            quaternary
            type="primary"
            @click="cancelRowEvent(row)"
          >
            取消
          </NButton>
        </template>
        <template v-else>
          <NButton circle quaternary type="primary" @click="edit(row)">
            <template #icon>
              <accountEdit />
            </template>
          </NButton>

          <NPopover>
            <template #trigger>
              <NButton
                circle
                quaternary
                type="primary"
                @click="editRowEvent(row)"
              >
                <template #icon>
                  <userEdit />
                </template>
              </NButton>
            </template>
            修改账号
          </NPopover>
          <NPopover>
            <template #trigger>
              <NButton circle quaternary type="primary" @click="editPwd(row)">
                <template #icon>
                  <userPwd />
                </template>
              </NButton>
            </template>
            修改密码
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
      </template>
    </Grid>

    <userModal />
    <infoModal />
    <pwdModal />
  </Page>
</template>
