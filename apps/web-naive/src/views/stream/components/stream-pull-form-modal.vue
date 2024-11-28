<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal } from '@vben/common-ui';

import { NButton, NSpace } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import { fetchCreatePull, fetchPullItem, fetchUpdatePull } from '#/api';

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
      fieldName: 'app',
      label: 'App',
      componentProps: {
        placeholder: '请输入App名称',
      },
      help: '流应用名，eg: app',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'stream',
      label: 'Stream',
      componentProps: {
        placeholder: '请输入Steam名称',
      },
      help: '流名称，eg:live',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'url',
      label: 'URL',
      componentProps: {
        placeholder: '请输入拉流url',
      },
      help: '拉流的url',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'timeoutSec',
      label: '超时时间',
      defaultValue: 10,
      help: '拉流超时时间,单位秒',
      componentProps: {
        placeholder: '请输入拉流超时时间(秒)',
        min: 1,
        precision: 1,
      },
      rules: 'required',
    },
    {
      component: 'Switch',
      defaultValue: false,
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'enableMp4',
      help: '是否开启MP4录制',
      label: 'MP4录制',
      rules: 'selectRequired',
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
        f = await fetchPullItem(d.id);
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
    await (d.operator === 'edit' ? fetchUpdatePull(f) : fetchCreatePull(f));

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
