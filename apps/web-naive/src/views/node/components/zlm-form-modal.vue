<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal } from '@vben/common-ui';

import { NButton, NSpace } from 'naive-ui';

import { useVbenForm, z } from '#/adapter/form';
import { message } from '#/adapter/naive';
import { fetchCreateNode, fetchNodeItem, fetchUpdateNode } from '#/api';

const [loading, { setTrue, setFalse }] = useBoolean(false);
const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-1/5',
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
      fieldName: 'name',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
      },
      help: '流媒体服务器名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'ip',
      label: 'IP',
      componentProps: {
        placeholder: '请输入IP',
      },
      help: '流媒体服务器IP',
      rules: z.string().min(1, '请输入IP').ip({ message: 'IP格式错误' }),
    },

    {
      component: 'Input',
      fieldName: 'remoteIp',
      label: '公网IP',
      componentProps: {
        placeholder: '请输入IP',
      },
      help: '流媒体服务器公网IP',
      rules: z.string().min(1, '请输入公网IP').ip({ message: 'IP格式错误' }),
    },
    {
      component: 'Input',
      fieldName: 'secret',
      label: 'Secret',
      componentProps: {
        placeholder: '请输入Secret',
      },
      help: 'ZLM配置文件中的Secret',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'httpPort',
      label: 'Http端口',
      help: 'ZLM配置文件中的Http端口号',
      componentProps: {
        placeholder: '请输入http端口',
        min: 1,
        precision: 0,
      },
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'httpsPort',
      label: 'Https端口',
      help: 'ZLM配置文件中的Https端口号',
      componentProps: {
        placeholder: '请输入https端口',
        min: 1,
        precision: 0,
      },
      rules: 'required',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  footer: false,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const d = modalApi.getData<Record<string, any>>();

      let f = {};
      if (d.operator === 'edit') {
        f = await fetchNodeItem(d.id);
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
    await (d.operator === 'edit' ? fetchUpdateNode(f) : fetchCreateNode(f));

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
  <Modal class="w-[500px]">
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
