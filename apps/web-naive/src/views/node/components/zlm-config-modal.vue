<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { h, ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal } from '@vben/common-ui';

import { NButton, NCard, NDivider, NSpace, NTooltip } from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import { fetchAdvanceNode, fetchNodeItem, fetchNodeItemConfig } from '#/api';

const [loading, { setTrue, setFalse }] = useBoolean(false);
const id = ref();

// const renderCardTitle = () => {
//   return h(NDivider, { titlePlacement: 'center' }, 'Rtmp配置');
// };

const [RtmpForm, rtmpFormApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: {
    // 所有表单项

    labelClass: 'w-1/8',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'rtmpPort',
      label: 'RTMP端口',
      help: 'rtmp服务器监听端口',
      componentProps: {
        placeholder: '请输入rtmp端口',
        min: 1,
        precision: 0,
      },
    },
  ],
});

const [RtspForm, rtspFormApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: {
    // 所有表单项

    labelClass: 'w-1/8',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'rtspPort',
      label: 'RTSP端口',
      help: 'rtsp服务器监听端口',
      componentProps: {
        placeholder: '请输入rtsp端口',
        min: 1,
        precision: 0,
      },
    },
  ],
});

const [WebHookForm, WebhookFormApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: {
    // 所有表单项

    labelClass: 'w-1/8',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'aliveInterval',
      label: '心跳间隔(秒)',
      help: 'keepalive hook触发间隔,单位秒,可为小数',
      componentProps: {
        placeholder: '请输入心跳间隔',
        min: 1,
        precision: 1,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'timeoutSec',
      label: '超时时间(秒)',
      help: 'hook api最大等待回复时间,单位秒',
      componentProps: {
        placeholder: '请输入超时时间',
        min: 1,
        precision: 0,
      },
    },
  ],
});

const [configModal, configModalAPI] = useVbenModal({
  footer: false,
  onOpenChange: async (open) => {
    if (open) {
      const data = configModalAPI.getData();

      id.value = data.id;
      const form = await fetchNodeItem(data.id);

      await rtmpFormApi.setValues(form);
      await rtspFormApi.setValues(form);
      await WebhookFormApi.setValues(form);
    }
  },
});

async function getRemoteConfig() {
  try {
    setTrue();
    const res = await fetchNodeItemConfig(id.value);

    if (res) {
      const config = res[0];
      rtmpFormApi.setValues({ rtmpPort: Number(config['rtmp.port']) });
      rtspFormApi.setValues({ rtmpPort: Number(config['rtsp.port']) });
      WebhookFormApi.setValues({
        timeoutSec: Number(config['hook.timeoutSec']),
        aliveInterval: Number(config['hook.alive_interval']),
      });
      message.success('操作成功');
    }
  } finally {
    setFalse();
  }
}

async function submitForm() {
  const values = await rtmpFormApi
    .merge(rtspFormApi)
    .merge(WebhookFormApi)
    .submitAllForm();
  values.id = id.value;

  setTrue();
  try {
    await fetchAdvanceNode(values);
    message.success('操作成功');
    configModalAPI.setData({ refresh: true });
    configModalAPI.close();
  } finally {
    setFalse();
  }
}

function closeModal() {
  configModalAPI.close();
}
</script>

<template>
  <configModal class="h-[600px] w-[800px]" title="高级配置">
    <NCard
      :bordered="false"
      :title="
        () => {
          return h(
            NDivider,
            { titlePlacement: 'center' },
            { default: () => 'RTMP配置' },
          );
        }
      "
      header-style="padding: 0;"
      size="small"
    >
      <RtmpForm />
    </NCard>

    <NCard
      :bordered="false"
      :title="
        () => {
          return h(
            NDivider,
            { titlePlacement: 'center' },
            { default: () => 'RTSP配置' },
          );
        }
      "
      header-style="padding: 0;"
      size="small"
    >
      <RtspForm />
    </NCard>

    <NCard
      :bordered="false"
      :title="
        () => {
          return h(
            NDivider,
            { titlePlacement: 'center' },
            { default: () => 'Webhook配置' },
          );
        }
      "
      header-style="padding: 0;"
      size="small"
    >
      <WebHookForm />
    </NCard>

    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton type="error" @click="closeModal">
          <template #icon>
            <span class="icon-[ant-design--close-outlined]"></span>
          </template>
          关闭
        </NButton>
        <NTooltip trigger="hover">
          <template #trigger>
            <NButton
              :disabled="loading"
              :loading="loading"
              type="success"
              @click="getRemoteConfig"
            >
              <template #icon>
                <span class="icon-[mdi--cog-sync-outline]"></span>
              </template>
              远程配置
            </NButton>
          </template>
          拉取远程ZLM实例的配置文件，并且赋值到表单中。
        </NTooltip>

        <NButton
          :disabled="loading"
          :loading="loading"
          type="primary"
          @click="submitForm"
        >
          <template #icon>
            <span class="icon-[ant-design--save-outlined]"></span>
          </template>

          提交
        </NButton>
      </NSpace>
    </template>
  </configModal>
</template>
