<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { NButton, NSpace } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import { fetchNodeList, fetchPushItem, fetchUpdatePushItem } from '#/api';
import { getStreamPrefix } from '#/utils/util';

interface Option {
  label: any;
  value: any;
}
const nodeList = ref<Option[]>([]);
const userStore = useUserStore();
async function getNodeList() {
  const data = await fetchNodeList();
  data.forEach((element: any) => {
    nodeList.value.push({
      label: element.name,
      value: element.id,
    });
  });
}

getNodeList();

const tenantCodePrefix = ref(getStreamPrefix());

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
  // wrapperClass: 'grid-cols-1 md:grid-cols-2',
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
      // defaultValue: userStore.userInfo?.tenantCode,
      defaultValue: 'proxy',
      componentProps: {
        placeholder: '请输入App名称',
        disabled: true,
      },
      help: '流应用名',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'stream',
      label: 'Stream',
      componentProps: {
        placeholder: '请输入Steam名称',
        disabled: true,
      },
      help: '流名称，eg:live',
      rules: 'required',
      // renderComponentContent: () => ({
      //   prefix: () => `${tenantCode.value}`,
      // }),
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  footer: false,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const d = modalApi.getData<Record<string, any>>();

      let f: any = {};
      if (d.operator === 'edit') {
        f = await fetchPushItem(d.id);
        f.stream = f.stream.slice(tenantCodePrefix.value.length);
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
    await fetchUpdatePushItem(f.id, f.name);

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
  <Modal class="w-[400px]">
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
