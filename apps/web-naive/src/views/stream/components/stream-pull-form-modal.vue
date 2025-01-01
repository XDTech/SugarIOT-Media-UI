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
import {
  fetchCreatePull,
  fetchNodeList,
  fetchPullItem,
  fetchUpdatePull,
} from '#/api';
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
      },
      help: '流名称，eg:live',
      rules: 'required',
      // renderComponentContent: () => ({
      //   prefix: () => `${tenantCode.value}`,
      // }),
    },
    {
      component: 'Input',
      fieldName: 'url',
      label: '拉流地址',
      componentProps: {
        placeholder: '请输入拉流地址',
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
      component: 'Select',
      fieldName: 'autoClose',
      label: '无人观看',
      defaultValue: 'ignore',
      help: '无人观看是否自动关闭流(不触发无人观看hook)，选择`忽略`则不关闭流',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        filterOption: true,
        options: [
          {
            label: '忽略',
            value: 'ignore',
          },
          {
            label: '是',
            value: 'yes',
          },
          {
            label: '否',
            value: 'no',
          },
        ],
        placeholder: '请选择',
        showSearch: true,
      },
      rules: 'selectRequired',
    },

    {
      component: 'Select',
      fieldName: 'playerType',
      label: '播放方式',
      help: '播放方式',

      componentProps: {
        allowClear: true,
        class: 'w-full',
        filterOption: true,
        options: [
          {
            label: '负载均衡',
            value: 'balance',
          },
          {
            label: '分配节点',
            value: 'manual',
          },
        ],
        placeholder: '请选择',
        showSearch: true,
      },
      rules: 'selectRequired',
    },
    {
      component: 'Select',
      fieldName: 'nodeId',
      label: '节点',
      dependencies: {
        componentProps(values) {
          if (values.playerType === 'manual') {
            return {
              options: nodeList.value,
            };
          }
          values.nodeId = null;
          return {};
        },
        disabled(values) {
          return values.playerType !== 'manual';
        },
        rules(values) {
          if (values.playerType === 'manual') {
            return 'selectRequired';
          }
          return null;
        },
        triggerFields: ['playerType'],
      },
      help: '当播放方式为`分配节点`时启用',
      componentProps: {
        allowClear: true,
        class: 'w-full',
        filterOption: true,
        placeholder: '请选择',
        showSearch: true,
      },
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
    {
      component: 'Switch',
      defaultValue: false,
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'enableHls',
      help: '是否开启HLS录制',
      label: 'Hls录制',
      rules: 'selectRequired',
    },
    {
      component: 'Switch',
      defaultValue: false,
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'enableAudio',
      help: '是否开启音频',
      label: '音频',
      rules: 'selectRequired',
    },
    {
      component: 'Switch',
      defaultValue: false,
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'enablePull',
      help: '添加、程序启动后自动拉流',
      label: '自动拉流',
      rules: 'selectRequired',
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
        f = await fetchPullItem(d.id);
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
