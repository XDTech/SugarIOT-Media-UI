<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal } from '@vben/common-ui';

import { NButton, NSpace } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import {
  createDepartment,
  getDepartment,
  getDepartmentList,
  updateDepartment,
} from '#/api';
import { listToTree } from '#/utils/util';

async function fetchDepartmentList() {
  const data = await getDepartmentList(null);
  const promise1 = new Promise((resolve, _) => {
    resolve(listToTree(data));
  });
  return promise1;
}

const [loading, { setTrue, setFalse }] = useBoolean(false);
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
      component: 'ApiTreeSelect',
      fieldName: 'parentId',
      label: '上级节点',
      componentProps: {
        placeholder: '请输入名称',
        api: fetchDepartmentList,
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        filterable: true,
        checkable: true,
      },
      help: '为空为根节点',
    },

    {
      component: 'Input',
      fieldName: 'name',
      label: '部门名称',
      componentProps: {
        placeholder: '请输入名称',
      },
      help: '部门名称',
      rules: 'required',
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
    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: '序号',
      // defaultValue: 10,
      help: '序号',
      componentProps: {
        placeholder: '请输入序号',
        // min: 1,
        // precision: 1,
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'charge',
      label: '负责人',
      componentProps: {
        placeholder: '请输入负责人',
      },
    },

    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
      componentProps: {
        placeholder: '手机号',
      },
    },

    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      componentProps: {
        placeholder: '请输入邮箱',
      },
      // rules: z.union([z.string().email(), z.literal('')]),
    },

    {
      component: 'Input',
      fieldName: 'remarks',
      label: '备注',
      // defaultValue: 10,
      componentProps: {
        type: 'textarea',

        placeholder: '请输入备注',
        autosize: { minRows: 1, maxRows: 6 },
      },
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  footer: false,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      let f: any = {};
      await fetchDepartmentList();
      const d = modalApi.getData<Record<string, any>>();

      if (d.operator === 'edit') {
        f = await getDepartment(d.id);
      }

      await formApi.setValues({ ...f });
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
    await (d.operator === 'edit' ? updateDepartment(f) : createDepartment(f));

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
</script>

<template>
  <Modal class="w-[800px]">
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
