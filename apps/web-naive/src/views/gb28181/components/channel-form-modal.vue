<script setup lang="ts">
import { ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { NButton, NSpace } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import { fetchChannel, fetchUpdateChannel } from '#/api/core/gb';

const userStore = useUserStore();

const tenantCode = ref('');

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
      fieldName: 'channelName',
      label: '通道名称',
      componentProps: {
        placeholder: '请输入通道名称',
        disabled: true,
      },
      help: '通道名称',
      rules: 'required',
    },

    {
      component: 'Select',
      fieldName: 'autoClose',
      label: '无人观看',
      defaultValue: 'no',
      help: '所有通道无人观看时的处理，后续可对通道进行单独配置，如果正在推流则下次推流后生效',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        filterOption: true,
        options: [
          {
            label: '保持开启',
            value: 'ignore',
          },
          {
            label: '关闭推流',
            value: 'no',
          },
        ],
        placeholder: '请选择',
        showSearch: true,
      },
      rules: 'selectRequired',
    },
    {
      component: 'Switch',
      defaultValue: false,
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'enableMp4',
      help: '所有通道推流后自动录制，后续可对通道进行单独配置，如果正在推流则下次推流后生效',
      label: 'MP4录制',
      rules: 'selectRequired',
    },
    {
      component: 'Switch',
      defaultValue: false,
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'enablePull',
      help: '所有通道注册后自动拉流，后续可对通道进行单独配置，如果正在推流则下次推流后生效',
      label: '自动拉流',
      rules: 'selectRequired',
    },
  ],
});
const [Modal, modalApi] = useVbenModal({
  onOpened: () => {},
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      tenantCode.value = `${userStore.userInfo?.tenantCode}0000111`;
      const d = modalApi.getData<Record<string, any>>();

      let f: any = {};
      if (d.operator === 'edit') {
        f = await fetchChannel(d.id);
        f.deviceId = f.deviceId.slice(tenantCode.value.length);
      }

      await formApi.setValues({ ...f });
    }
  },
});

function closeDrawer() {
  modalApi.close();
}
async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) return;
  setTrue();
  // const d = modalApi.getData<Record<string, any>>();
  try {
    const f = await formApi.getValues();
    await fetchUpdateChannel(f);
    message.success('操作成功');
    modalApi.setData({ refresh: true });
    closeDrawer();
  } finally {
    setFalse();
  }
}
</script>

<template>
  <Modal class="h-[350px] w-[500px]">
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
