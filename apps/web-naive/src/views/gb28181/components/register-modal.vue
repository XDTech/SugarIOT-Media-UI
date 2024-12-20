<script setup lang="ts">
import { ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal, z } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { NButton, NSpace } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import { fetchCreateDevice } from '#/api/core/gb';

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
      fieldName: 'deviceName',
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
        prefix: () => `${tenantCode.value}0000`,
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
      component: 'Input',
      fieldName: 'pwd',
      label: '密码',
      componentProps: {
        placeholder: '请输入密码',
      },
      help: '密码为空使用系统密码校验',
    },
  ],
});
const [Modal, modalApi] = useVbenModal({
  onOpened: () => {
    console.warn(userStore.userInfo);
    tenantCode.value = userStore.userInfo?.tenantCode;
  },
});

function closeDrawer() {
  modalApi.close();
}
async function handleSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) return;
  setTrue();

  try {
    const f = await formApi.getValues();
    await fetchCreateDevice(f);

    message.success('操作成功');
    modalApi.setData({ refresh: true });
    closeDrawer();
  } finally {
    setFalse();
  }
}
</script>

<template>
  <Modal class="h-[350px] w-[500px]" title="添加国标设备">
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
