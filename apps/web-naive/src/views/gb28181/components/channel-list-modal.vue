<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { MsPlay } from '@vben/icons';

import { NButton, NPopover, NTag } from 'naive-ui';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { fetchChannelInvite, fetchChannelList } from '#/api/core/gb';

const deviceId = ref();
const list = ref();
const [Modal, modalApi] = useVbenModal({
  footer: false,

  onOpened: () => {},
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const d = modalApi.getData<Record<string, any>>();
      deviceId.value = d?.id;
      getChannelList();
    }
  },
});

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { align: 'left', title: '通道名称', field: 'channelName', width: 100 },
    { align: 'left', title: '通道ID', field: 'channelCode', width: 200 },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    {
      title: '更新时间',
      field: 'syncTime',
      width: 200,
      formatter: 'formatDateTime',
    },
    {
      title: '生产厂家',
      field: 'manufacturer',
      width: 150,
    },

    {
      field: 'model',
      title: '类型',
      width: 100,
    },
    {
      field: 'address',
      title: '地址',
      width: 100,
    },
    // {
    //   field: 'action',
    //   fixed: 'right',
    //   slots: { default: 'action' },
    //   title: '操作',
    //   width: 300,
    // },
  ],
  exportConfig: {},

  height: 'auto', // 如果设置为 auto，则必须确保存在父节点且不允许存在相邻元素，否则会出现高度闪动问题
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  sortConfig: {
    multiple: true,
  },
  // proxyConfig: {
  //   enabled: true,
  //   autoLoad: true,
  //   response: {
  //     result: 'data',
  //     total: 'total',
  //   },
  //   ajax: {
  //     query: async () => {
  //       const data = await fetchChannelList(deviceId.value);

  //       return {
  //         data,
  //         total: data.length,
  //       };
  //     },
  //   },
  // },
};

const [Grid, formApi] = useVbenVxeGrid({ gridOptions });
async function getChannelList() {
  const data = await fetchChannelList(deviceId.value);
  list.value = data;
  formApi.grid.reloadData(list.value);
}

// async function openPlayer(row: Record<string, any>) {
//   // 跳转到播放器
//   // router.push(`/player/${row.id}`);

//   try {
//     await fetchChannelInvite(row.id);
//   } catch (error) {
//     console.error(error);
//   }
// }

// const state = playerModalAPI.useStore();
const item = ref();
const title = ref();
const showModal = ref(false);
async function openPlayer(row: any) {
  try {
    await fetchChannelInvite(row.id);
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div>
    <Modal class="h-[600px] w-[800px]" title="通道列表">
      <Grid>
        <template #status="{ row }">
          <NTag
            v-if="row.status === 'online'"
            round
            size="small"
            type="success"
          >
            在线
          </NTag>
          <NTag v-if="row.status === 'offline'" round size="small" type="error">
            离线
          </NTag>
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
        </template>
      </Grid>
      <!-- <PlayerComponent v-model:model-value="item" types="gb" /> -->
    </Modal>
  </div>
</template>

<style scoped></style>
