<script setup lang="ts">
import { ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal, z } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { NButton, NSpace } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import {
  fetchCreateDevice,
  fetchDeviceInfo,
  fetchUpdateDevice,
} from '#/api/core/gb';

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
      fieldName: 'name',
      label: '设备名称',
      componentProps: {
        placeholder: '请输入设备名称',
      },
      help: '设备名称',
      rules: 'required',
    },

    {
      component: 'Input',
      fieldName: 'deviceId',
      label: '国标ID',

      componentProps: {
        placeholder: '请输入7位流水号',
      },
      rules: z
        .string()
        .min(1, { message: '请输入7位流水号' })
        .refine(
          (value) => {
            // 检查输入是否是7位数字且大于0
            const regex = /^\d{7}$/;
            if (!regex.test(value)) {
              return false;
            }

            return true;
          },
          {
            message: '请输入7位流水号',
          },
        ),
      help: '国标唯一ID，格式为7位',
      renderComponentContent: () => ({
        prefix: () => `${tenantCode.value}`,
      }),
    },

    {
      component: 'Select',
      fieldName: 'deviceType',
      label: '设备类型',
      componentProps: {
        placeholder: '请选择设备类型',
        options: [
          {
            label: 'NVR',
            value: 'nvr',
          },
          {
            label: 'IP Camera',
            value: 'ip_camera',
          },
        ],
      },
      help: '设备类型',

      rules: 'selectRequired',
    },
    {
      component: 'Select',
      fieldName: 'netType',
      label: '连接方式',
      componentProps: {
        placeholder: '请选择连接方式',
        options: [
          {
            label: '公网',
            value: 'public_net',
          },
          {
            label: '内网',
            value: 'private_net',
          },
        ],
      },
      help: '设备类型',

      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'pwd',
      label: '密码',
      componentProps: {
        placeholder: '请输入密码',
      },
      help: '密码为空使用系统密码校验',
    },
    {
      component: 'Select',
      fieldName: 'autoClose',
      label: '无人观看',
      defaultValue: 'no',
      help: '所有通道无人观看时的处理，后续可对通道进行单独配置',
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
      help: '所有通道推流后自动录制，后续可对通道进行单独配置',
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
      help: '所有通道注册后自动拉流，后续可对通道进行单独配置',
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
        f = await fetchDeviceInfo(d.id);
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
  const d = modalApi.getData<Record<string, any>>();
  try {
    const f = await formApi.getValues();
    await (d.operator === 'edit' ? fetchUpdateDevice(f) : fetchCreateDevice(f));
    message.success('操作成功');
    modalApi.setData({ refresh: true });
    closeDrawer();
  } finally {
    setFalse();
  }
}
</script>

<template>
  <Modal class="h-[580px] w-[650px]">
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
