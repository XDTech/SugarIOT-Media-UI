<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal } from '@vben/common-ui';

import { NButton, NSpace, type TreeInst } from 'naive-ui';

import { useVbenForm, z } from '#/adapter/form';
import { message } from '#/adapter/naive';
import {
  getDepartmentList,
  getPermissionList,
  getRoleList,
  updateUserPwd,
} from '#/api';
import { listToTree } from '#/utils/util';

const treeInstRef = ref<null | TreeInst>(null);

const pattern = ref('');
const permissionList = ref([]);
const cascadeFlag = ref(false);
const expandFlag = ref(false);
const selectKey = ref<string[]>([]);
const [loading, { setTrue, setFalse }] = useBoolean(false);
const allKey = ref([]);

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
      fieldName: 'password',
      label: '密码',
      componentProps: {
        type: 'password',
        placeholder: '请输入密码',
        'show-password-on': 'mousedown',
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'confirmPwd',
      label: '确认密码',
      componentProps: {
        type: 'password',
        placeholder: '请输入密码',
        'show-password-on': 'mousedown',
      },
      rules: z
        .string()
        .min(1, { message: '请确认密码' })
        .refine(
          async (value) => {
            const f = await formApi.getValues();
            if (f.password !== value) {
              return false;
            }
            return true;
          },
          {
            message: '两次密码不一致',
          },
        ),
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  footer: false,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const d = modalApi.getData<Record<string, any>>();

      const f: any = { id: d.id };

      await formApi.setValues({ ...f });

      selectKey.value = f.permissions;
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

    await updateUserPwd(f.id, f.password);

    message.success('操作成功');
    closeDrawer();
  } finally {
    setFalse();
  }
}
function closeDrawer() {
  modalApi.close();
}
</script>

<template>
  <Modal class="h-[300px] w-[400px]">
    <Form />

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
