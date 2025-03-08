<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal } from '@vben/common-ui';

import {
  NButton,
  NSpace,
  NUpload,
  type TreeInst,
  type UploadFileInfo,
} from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import {
  getDepartmentList,
  getPermissionList,
  getRoleList,
  getUserInfo,
  updateUser,
} from '#/api';
import { getBaseUrl } from '#/utils/base';
import { listToTree } from '#/utils/util';

const treeInstRef = ref<null | TreeInst>(null);

const pattern = ref('');
const permissionList = ref([]);
const cascadeFlag = ref(false);
const expandFlag = ref(false);
const selectKey = ref<string[]>([]);
const [loading, { setTrue, setFalse }] = useBoolean(false);
const allKey = ref([]);

const defaultFile = ref<any>([]);

async function fetchPermissionList() {
  const data = await getPermissionList(null);
  allKey.value = data.map((s: any) => s.id);
  permissionList.value = listToTree(data);
}

async function fetchRoleList() {
  const data = await getRoleList(null);
  const promise1 = new Promise((resolve, _) => {
    resolve(data);
  });
  return promise1;
}
async function fetchDepartmentList() {
  const data = await getDepartmentList(null);
  const promise1 = new Promise((resolve, _) => {
    resolve(listToTree(data));
  });
  return promise1;
}
fetchPermissionList();
const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    // labelClass: 'w-1/5',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: [
    {
      component: 'Input',
      fieldName: 'id',
      label: 'id',
      dependencies: {
        show: false,
        triggerFields: ['none'],
      },
    },
    {
      component: 'Input',
      fieldName: 'avatar',

      formItemClass: 'col-start-2',
      componentProps: {
        placeholder: '请选择头像',
      },
    },

    {
      component: 'Input',
      fieldName: 'name',
      label: '姓名',
      componentProps: {
        placeholder: '请输入姓名',
      },
      rules: 'required',
    },

    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      componentProps: {
        placeholder: '请输入邮箱',
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '电话',
      componentProps: {
        placeholder: '请输入电话',
      },
    },
    {
      component: 'Input',
      fieldName: 'postName',
      label: '岗位',
      componentProps: {
        placeholder: '请输入岗位',
      },
    },

    {
      component: 'ApiTreeSelect',
      fieldName: 'departmentId',
      label: '部门',
      componentProps: {
        placeholder: '请选择部门',
        api: fetchDepartmentList,
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        filterable: true,
        checkable: true,
      },
    },

    {
      component: 'ApiTreeSelect',
      fieldName: 'roles',
      label: '角色',
      componentProps: {
        placeholder: '请选择角色',
        api: fetchRoleList,
        labelField: 'name',
        valueField: 'id',
        multiple: true,
        childrenField: 'children',
        filterable: true,
        checkable: true,
        'ax-tag-count': 2,
      },
    },

    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        class: 'w-auto',
        options: [
          {
            label: '启用',
            value: 'normal',
          },
          {
            label: '禁用',
            value: 'locked',
          },
        ],
      },

      defaultValue: 'normal',
      rules: 'required',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  footer: false,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      pattern.value = '';
      let f: any = {};

      const d = modalApi.getData<Record<string, any>>();

      f = await getUserInfo(d.id);

      await formApi.setValues({ ...f });

      defaultFile.value = [];
      if (f.avatar) {
        defaultFile.value.push({
          id: f.id,
          name: f.username,
          status: 'finished',
          url: `${getBaseUrl()}/file/download?path=${f.avatar}`,
        });
      }

      console.warn(defaultFile.value);
    }
  },
});

async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) return;
  setTrue();

  try {
    const d = modalApi.getData<Record<string, any>>();
    const f = await formApi.getValues();

    await updateUser(f);

    message.success('操作成功');
    modalApi.setData({ refresh: true });
    closeDrawer();
  } finally {
    setFalse();
  }
}
function closeDrawer() {
  modalApi.close();
}

function handleFinish({
  file,
  event,
}: {
  event?: ProgressEvent;
  file: UploadFileInfo;
}) {
  try {
    const res = JSON.parse((event?.target as XMLHttpRequest).response);

    formApi.setFieldValue('avatar', res.msg);
  } catch (error) {
    console.error(error);
  }
}

async function handleRemove() {
  await formApi.setFieldValue('avatar', '');

  return true;
}
</script>

<template>
  <Modal class="h-[500px] w-[800px]">
    <Form>
      <template #avatar="slotProps">
        <NUpload
          :action="`${getBaseUrl()}/file/upload`"
          list-type="image-card"
          v-bind="slotProps"
          v-model:file-list="defaultFile"
          :max="1"
          name="file"
          @finish="handleFinish"
          @remove="handleRemove"
        />
      </template>
    </Form>

    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton type="error" @click="closeDrawer">
          <template #icon>
            <span class="icon-[ant-design--close-outlined]"></span>
          </template>
          关闭
        </NButton>
        <NButton
          :disabled="loading"
          :loading="loading"
          type="primary"
          @click="handleSubmit"
        >
          <template #icon>
            <span class="icon-[ant-design--save-outlined]"></span>
          </template>

          提交
        </NButton>
      </NSpace>
    </template>
  </Modal>
</template>

<style scoped></style>
