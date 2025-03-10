<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { Page, useVbenModal } from '@vben/common-ui';
import {
  antdDelete,
  antdEdit,
  MdiPlus,
  MdiRefresh,
  MdiRestart,
} from '#/icons/index';

import moment from 'moment';
import {
  NBadge,
  NButton,
  NCard,
  NEmpty,
  NGrid,
  NGridItem,
  NPagination,
  NPopconfirm,
  NSpin,
  NTag,
  NText,
  NTooltip,
  useMessage,
} from 'naive-ui';

import { fetchDelDevice, fetchDeviceList, fetchSyncInfo } from '#/api/core/gb';

import ChannelListModal from '../components/channel-list-modal.vue';
import DeviceInfoModal from '../components/device-info-modal.vue';
import RegisterModal from '../components/register-modal.vue';

const q = ref({
  pi: 1,
  ps: 10,
});

const pageSizes = [
  {
    label: '10 每页',
    value: 10,
  },
  {
    label: '20 每页',
    value: 20,
  },
  {
    label: '30 每页',
    value: 30,
  },
  {
    label: '40 每页',
    value: 40,
  },
];

const totalItems = ref(0);

const message = useMessage();

const [visible, { setTrue: openModal }] = useBoolean();
const title = ref('新增国标设备');
const operator = ref('add');

const [loadingFlag, { setTrue: openLoading, setFalse: closeLoading }] =
  useBoolean();

const [regModal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: RegisterModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = modalApi.getData();
      if (d.refresh) {
        getList();
      }
    }
  },
});

const [infoModal, infoModalApi] = useVbenModal({
  footer: false,
});

// get list

const deviceList = ref<any[]>([]);

// device info
const deviceId = ref();
const infoTitle = ref('');
// ======end======
async function getList() {
  openLoading();
  const data = await fetchDeviceList(q.value);

  deviceList.value = data.data;
  totalItems.value = data.total;

  setTimeout(() => closeLoading(), 200);
}

getList();

function openRegister() {
  operator.value = 'add';
  title.value = '新增节点';
  modalApi.setState({ title: title.value });
  modalApi.setData({ operator: operator.value });
  modalApi.open();
}

function registerDevice() {}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text); // 将文本写入剪贴板

    message.success('复制成功');
  } catch {
    message.success('复制失败');
  }
}

function getContent(type: string) {
  switch (type) {
    case 'ip_camera': {
      return 'IP Camera';
    }
    case 'nvr': {
      return 'NVR';
    }

    default: {
      return '';
    }
  }
}

function getStatus(item: any) {
  const online = h(
    NTooltip,
    { trigger: 'hover' },
    {
      trigger: () =>
        h(
          NBadge,
          {
            processing: true,
            type: 'success',
            offset: [10, 0] as const,
          },
          {
            default: () => item.name,
            value: () =>
              h('span', {
                class: 'icon-[line-md--sunny-twotone-loop]',
              }),
          },
        ),
      default: () => `在线`,
    },
  );
  const offline = h(
    NTooltip,
    { trigger: 'hover' },
    {
      trigger: () =>
        h(
          NBadge,
          {
            processing: true,
            type: 'error',
            offset: [10, 0] as const,
          },
          {
            default: () => item.name,
            value: () =>
              h('span', {
                class: 'icon-[line-md--hazard-lights-off-loop]',
              }),
          },
        ),
      default: () => '离线',
    },
  );
  return item.status === '1' ? online : offline;
}

async function syncInfo(item: any) {
  try {
    await fetchSyncInfo(item.id);
    message.success('操作成功');
  } catch {
    return Promise<true>;
  } finally {
    // 重新获取列表
  }
}
async function delDevice(item: any) {
  openLoading();
  try {
    await fetchDelDevice(item.id);
    message.success('操作成功');
  } catch {
    return Promise<true>;
  } finally {
    // 重新获取列表
    getList();
  }
}

function editInfo(id: any) {
  operator.value = 'edit';
  title.value = '编辑配置';
  modalApi.setState({ title: title.value });
  modalApi.setData({
    operator: operator.value,
    id,
  });
  modalApi.open();
}

// channel list
const [channelModal, channelApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ChannelListModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = modalApi.getData();
      if (d.refresh) {
        getList();
      }
    }
  },
});

function openChannelList(id: any) {
  channelApi.setData({ id });
  channelApi.open();
}

// 分页

function pageUpdate(pi: any) {
  getList();
}
function pageUpdateSize(ps: any) {
  getList();
}

const pageCount = computed(() => {
  return Math.ceil(totalItems.value / q.value.ps);
});

// info modal
function openInfo(item: any) {
  deviceId.value = item.id;
  infoTitle.value = `【${item.name}】国标设备信息`;
  infoModalApi.open();
}
</script>

<template>
  <Page description="注册的国标设备" title="国标设备">
    <template #extra>
      <NButton type="primary" @click="openRegister">
        <template #icon>
          <MdiPlus />
        </template>
        新增
      </NButton>
      <NButton class="c-btn" type="default" @click="getList">
        <template #icon>
          <MdiRefresh />
        </template>
        刷新
      </NButton>
    </template>

    <NSpin :show="loadingFlag">
      <template #icon>
        <span class="icon-[svg-spinners--6-dots-scale-middle]"> </span>
      </template>
      <NCard v-if="deviceList.length > 0">
        <NGrid
          :x-gap="12"
          :y-gap="24"
          cols="1  m:2  l:4"
          item-responsive
          responsive="screen"
        >
          <NGridItem v-for="item in deviceList" :key="item.id">
            <NCard
              :segmented="{ content: true, footer: 'soft', action: false }"
              :title="
                () => {
                  return getStatus(item);
                }
              "
              hoverable
              style="width: 100%; min-width: 330px"
            >
              <!-- <NWatermark
                :content="getContent(item.deviceType)"
                :font-size="16"
                :height="100"
                :line-height="16"
                :rotate="-15"
                :width="100"
                :x-offset="12"
                :y-offset="28"
                selectable
              > -->
              <template #header-extra>
                <NTooltip trigger="hover">
                  <template #trigger>
                    <NTag :bordered="true" round size="small" type="info">
                      {{ getContent(item.deviceType) }}
                      <template #icon>
                        <span class="icon-[logos--google-meet]"></span>
                      </template>
                    </NTag>
                  </template>
                  设备类型
                </NTooltip>
              </template>
              <!-- </NWatermark> -->

              <div>
                <NText depth="3"> 设备ID: </NText>
                <NTag
                  style="cursor: pointer"
                  type="success"
                  @click="copyToClipboard(item.deviceId)"
                >
                  {{ item.deviceId }}
                </NTag>
              </div>
              <div style="margin-top: 10px">
                <NText depth="3"> 设备IP: </NText>
                <NTag type="success">
                  {{ item.host ? `${item.host}:${item.port}` : '暂未注册' }}
                </NTag>
              </div>

              <template #footer>
                <NTooltip trigger="hover">
                  <template #trigger>
                    <NTag class="c-tag" size="small" type="info">
                      <template #icon>
                        <span
                          class="icon-[fluent--channel-share-24-regular]"
                        ></span>
                      </template>

                      {{ item.channel }}
                    </NTag>
                  </template>
                  通道数量
                </NTooltip>
                <NTooltip trigger="hover">
                  <template #trigger>
                    <NTag class="c-tag" size="small" type="info">
                      <template #icon>
                        <span
                          class="icon-[material-symbols-light--warehouse-outline-rounded]"
                        ></span>
                      </template>
                      {{ item.manufacturer }}
                    </NTag>
                  </template>
                  设备厂商
                </NTooltip>

                <NTooltip trigger="hover">
                  <template #trigger>
                    <NTag class="c-tag" size="small" type="info">
                      <template #icon>
                        <span class="icon-[line-md--downloading-loop]"></span>
                      </template>
                      {{ item.transport }}
                    </NTag>
                  </template>
                  传输方式
                </NTooltip>
              </template>
              <template #action>
                <div style="display: flex; gap: 5px; justify-content: flex-end">
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <NButton
                        quaternary
                        size="tiny"
                        style="margin-top: 3px"
                        type="success"
                      >
                        <template #icon>
                          <span
                            class="icon-[line-md--cloud-alt-download-loop]"
                          ></span>
                        </template>
                        {{
                          item.syncTime
                            ? `${moment(item.syncTime).format('YYYY/MM/DD HH:mm:ss')}`
                            : '暂未同步 '
                        }}
                      </NButton>
                    </template>
                    最近同步时间
                  </NTooltip>

                  <NTooltip trigger="hover">
                    <template #trigger>
                      <NButton
                        circle
                        secondary
                        size="small"
                        type="info"
                        @click="openChannelList(item.id)"
                      >
                        <template #icon>
                          <span
                            class="icon-[mdi--video-wireless-outline]"
                          ></span>
                        </template>
                      </NButton>
                    </template>
                    视频通道
                  </NTooltip>

                  <NTooltip trigger="hover">
                    <template #trigger>
                      <NButton
                        circle
                        secondary
                        size="small"
                        type="info"
                        @click="openInfo(item)"
                      >
                        <template #icon>
                          <span
                            class="icon-[mdi--information-slab-circle-outline]"
                          ></span>
                        </template>
                      </NButton>
                    </template>
                    查看国标信息
                  </NTooltip>

                  <NPopconfirm @positive-click="syncInfo(item)">
                    <template #trigger>
                      <NTooltip trigger="hover">
                        <template #trigger>
                          <NButton circle secondary size="small" type="info">
                            <template #icon>
                              <MdiRestart />
                            </template>
                          </NButton>
                        </template>
                        更新通道
                      </NTooltip>
                    </template>
                    同步设备信息以及通道，同步后会发送通知
                  </NPopconfirm>

                  <NButton
                    circle
                    secondary
                    size="small"
                    type="info"
                    @click="editInfo(item.id)"
                  >
                    <template #icon>
                      <antdEdit />
                    </template>
                  </NButton>

                  <NPopconfirm @positive-click="delDevice(item)">
                    <template #trigger>
                      <NButton circle secondary size="small" type="error">
                        <template #icon>
                          <antdDelete />
                        </template>
                      </NButton>
                    </template>
                    确定删除吗
                  </NPopconfirm>
                </div>
              </template>
            </NCard>
          </NGridItem>
        </NGrid>

        <template #footer>
          <NPagination
            v-model:page="q.pi"
            v-model:page-size="q.ps"
            :page-count="pageCount"
            :page-sizes="pageSizes"
            show-size-picker
            style="float: right"
            @update:page="pageUpdate"
            @update:page-size="pageUpdateSize"
          />
        </template>
      </NCard>

      <NCard v-if="deviceList.length === 0">
        <NEmpty class="c-empty" />
      </NCard>
    </NSpin>

    <regModal />
    <channelModal />

    <infoModal :title="infoTitle" class="h-[600px] w-[800px]">
      <DeviceInfoModal :model-value="deviceId" />
    </infoModal>
  </Page>
</template>

<style scoped>
/* <style scoped> 的作用是为当前组件的样式添加作用域，以避免样式污染到其他组件。但由于 scoped
会生成特定的属性选择器（如 data-v-xxxxx）
，这些选择器可能无法正确匹配由第三方库（如 Navia UI）动态生成的 DOM 元素。

这是导致样式未生效的原因。 */

/* ::v-deep 是 Vue 3 的深度选择器，适用于覆盖子组件或动态生成的样式。 */

::v-deep(.n-card__action) {
  padding: 10px;
}

.d-span {
  margin-left: 5px;
}

.c-img {
  height: 100px;
}

.c-tag {
  margin-right: 5px;
}

.c-empty {
  /* margin-top: 10px; */

  /* height: 200px; */
}

.c-btn {
  margin-left: 5px;
}
</style>
