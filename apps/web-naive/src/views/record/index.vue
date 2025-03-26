<script setup lang="ts">
import type { TreeOption } from 'naive-ui';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  NBadge,
  NButton,
  NCollapse,
  NCollapseItem,
  NIcon,
  NInput,
  NInputGroup,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NPopover,
  NSpace,
  NText,
  NTree,
} from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getScreenList } from '#/api';
import { getRecordList } from '#/api/core/record';
import { mdownload, MsPlay } from '#/icons/index';
import { dateFormat, formatBytes, timeFormat } from '#/utils/util';
import easyPlayer from '#/views/player/components/easy-player.vue';

const pattern = ref('');
const showIrrelevantNodes = ref(false);
const data = ref<TreeOption[]>([]);
const onlineIcon = h(
  NBadge,
  {
    processing: true,
    type: 'success',
  },
  {
    value: () =>
      h('span', {
        class: 'icon-[line-md--sun-rising-loop]',
      }),
  },
);

const offlineIcon = h(
  NBadge,
  {
    processing: true,
    type: 'error',
  },
  {
    value: () =>
      h('span', {
        class: 'icon-[line-md--hazard-lights-off-loop]',
      }),
  },
);

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: true,
  schema: [
    {
      component: 'DatePicker',
      fieldName: 'DatePicker',
      label: '时间范围',
      componentProps: {
        type: 'datetimerange',
      },
    },
    {
      component: 'Input',
      fieldName: 'app',
      componentProps: {
        placeholder: '请输入名称',
      },
      dependencies: {
        show: false,
        triggerFields: ['none'],
      },
      label: 'app',
    },
    {
      component: 'Input',
      fieldName: 'stream',
      componentProps: {
        placeholder: '请输入名称',
      },
      dependencies: {
        show: false,
        triggerFields: ['none'],
      },
      label: 'stream',
    },
  ],
  wrapperClass: 'grid-cols-2',
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-1/5',
  },
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};
const gridOptions: VxeGridProps<any> = {
  columns: [
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },

    {
      title: '文件名称',
      width: 150,
      field: 'fileName',
      slots: { default: 'fileName' },
    },
    {
      title: '文件大小',
      width: 150,
      field: 'fileSize',
      slots: { default: 'fileSize' },
    },
    {
      field: 'timeLen',
      title: '录制时长',
      width: 150,
      slots: { default: 'timeLen' },
    },
    {
      field: 'startTime',
      title: '开始时间',
      slots: { default: 'startTime' },
      width: 300,
    },
    {
      field: 'createdAt',
      title: '结束时间',
      formatter: 'formatDateTime',
      width: 300,
    },
    {
      field: 'action',
      fixed: 'right',
      title: '操作',
      width: 100,
      slots: { default: 'action' },
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  exportConfig: {},
  importConfig: {},
  proxyConfig: {
    response: {
      result: 'data',
      total: 'total',
    },
    ajax: {
      query: async ({ page }, formValues) => {
        try {
          loading(true);

          // if (formValues && formValues.isTrusted) {
          //   formValues = {};
          // }

          if (formValues.DatePicker) {
            const dt = formValues.DatePicker;
            formValues.startDate = Math.floor(dt[0] / 1000);
            formValues.endDate = Math.floor(dt[1] / 1000);
          }
          const f: any = {};

          Object.assign(f, formValues);
          delete f.DatePicker;

          return await getRecordList({
            pi: page.currentPage,
            ps: page.pageSize,
            ...f,
          });
        } finally {
          //
          setTimeout(() => {
            loading(false);
          }, 200);
        }
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    import: false,
    refresh: false,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

function loading(params: boolean) {
  gridApi.setLoading(params);
}
const transformToTree = (data: any[], parentId: string): TreeOption[] => {
  return data
    .filter((node) => node.parentId === parentId)
    .map((node) => {
      const children = transformToTree(data, node.id);
      return {
        item: node,
        key: node.id,
        label: node.name,
        disabled: false,

        prefix: () =>
          node.nodeType === '0'
            ? h(NIcon, null, {
                default: () =>
                  h('span', {
                    class: 'icon-[fxemoji--folder]',
                  }),
              })
            : h(NIcon, null, {
                default: () =>
                  h('span', {
                    class: 'icon-[fxemoji--handheldvideocamera]',
                  }),
              }),
        suffix: () => (node.status === 'online' ? onlineIcon : offlineIcon),

        isLeaf: children.length === 0,
        children: children.length > 0 ? children : undefined,
      };
    });
};

async function getScreen() {
  const res = await getScreenList();

  data.value = transformToTree(res, '0');
}
getScreen();

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    async onClick() {
      const item = option.item as any;

      if (item.nodeType === '0') return;
      await gridApi.formApi.setValues({
        app: item.app,
        stream: item.stream,
      });

      const a = await gridApi.formApi.getValues();
      gridApi.reload(a);
    },
  };
};

// const state = playerModalAPI.useStore();
const item = ref();
const title = ref();
// 播放器model
const player = ref<any>();
const [playerModal, playerModalAPI] = useVbenModal({
  // 连接抽离的组件
  draggable: true,
  footer: false,
  onOpened: () => {
    player.value.replay(item.value.playUrl);
  },
});

function openPlayer(i: any) {
  item.value = i;
  title.value = `【${i.fileName}】录像回放`;
  playerModalAPI.open();
}
function download_file(row: any) {
  const d = {
    fileName: row.fileName,
    source: row.playUrl,
  };
  const link = document.createElement('a');
  link.href = d.source;
  link.download = d.fileName; // 设定下载文件名
  link.setAttribute('target', '_blank'); // 在新窗口打开
  document.body.append(link);
  link.click();
  link.remove();
}
</script>

<template>
  <div class="screen-container">
    <NLayout has-sider position="absolute">
      <NLayoutSider
        :collapsed-width="0"
        bordered
        collapse-mode="width"
        content-style="padding: 24px;"
        show-trigger="arrow-circle"
      >
        <NSpace vertical>
          <NCollapse :default-expanded-names="['1']">
            <NCollapseItem name="1" title="媒体列表">
              <NInputGroup>
                <NInput v-model:value="pattern" placeholder="搜索" />
                <NButton @click="getScreen">
                  <template #icon>
                    <span class="icon-[ant-design--reload-outlined]"> </span>
                  </template>
                  刷新
                </NButton>
              </NInputGroup>
              <NTree
                :data="data"
                :node-props="nodeProps"
                :pattern="pattern"
                :show-irrelevant-nodes="showIrrelevantNodes"
                block-line
                show-line
              />
            </NCollapseItem>
          </NCollapse>
        </NSpace>
      </NLayoutSider>
      <NLayoutContent>
        <Grid>
          <template #fileName="{ row }">
            <NText type="info">
              {{ row.fileName }}
            </NText>
          </template>
          <template #fileSize="{ row }">
            <NText type="info">
              {{ formatBytes(Number(row.fileSize)) }}
            </NText>
          </template>
          <template #timeLen="{ row }">
            {{ timeFormat(Number(row.timeLen)) }}
          </template>
          <template #startTime="{ row }">
            {{ dateFormat(row.startTime) }}
          </template>

          <template #action="{ row }">
            <NPopover trigger="hover">
              <template #trigger>
                <NButton
                  circle
                  quaternary
                  type="primary"
                  @click="openPlayer(row)"
                >
                  <template #icon>
                    <MsPlay />
                  </template>
                </NButton>
              </template>
              <span>播放流</span>
            </NPopover>
            <NPopover trigger="hover">
              <template #trigger>
                <NButton
                  circle
                  quaternary
                  type="primary"
                  @click="download_file(row)"
                >
                  <template #icon>
                    <mdownload />
                  </template>
                </NButton>
              </template>
              <span>下载</span>
            </NPopover>
          </template>
        </Grid>
      </NLayoutContent>
    </NLayout>

    <playerModal :title="title" class="h-[600px] w-[800px]">
      <easyPlayer ref="player" :is-live="false" class="h-3/3" />
    </playerModal>
  </div>
</template>

<style scoped>
.screen-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
