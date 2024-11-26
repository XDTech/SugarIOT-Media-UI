<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script lang="ts" setup>
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';

import { h, nextTick, ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { Page, useVbenModal } from '@vben/common-ui';
import {
  antdDelete,
  antdEdit,
  antdSync,
  MdiMonitorEye,
  MdiPlus,
  MdiRefresh,
  MdiWebSync,
} from '@vben/icons';

import {
  NBadge,
  NButton,
  NCard,
  NDropdown,
  NEmpty,
  NGrid,
  NGridItem,
  NSpin,
  NTag,
  NText,
  NTooltip,
  useMessage,
} from 'naive-ui';

import { dialog } from '#/adapter/naive';
import { deleteNodeItem, fetchNodeList, syncConfig } from '#/api';

import ZlmConfigModal from '../components/zlm-config-modal.vue';
import zlmFormModal from '../components/zlm-form-modal.vue';
import ZlmRemoteModal from '../components/zlm-remote-modal.vue';

const [zlmModal, zlmModalAPI] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: zlmFormModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = zlmModalAPI.getData();
      if (d.refresh) {
        getList();
      }
    }
  },
});

const [configModal, configModalAPI] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ZlmConfigModal,
  onOpenChange: (open) => {
    if (!open) {
      // 接收子组件消息
      const d = configModalAPI.getData();
      if (d.refresh) {
        getList();
      }
    }
  },
});

// 远程组件
const [remoteModal, remoteModalAPI] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ZlmRemoteModal,
  onOpenChange: (open) => {},
});
const message = useMessage();

const [visible, { setTrue: openModal }] = useBoolean();

const [loadingFlag, { setTrue: openLoading, setFalse: closeLoading }] =
  useBoolean();

const title = ref('新增节点');
const operator = ref('add');

function add() {
  operator.value = 'add';
  title.value = '新增节点';
  zlmModalAPI.setState({ title: title.value });
  zlmModalAPI.setData({ operator: operator.value });
  zlmModalAPI.open();
}

// get list

const nodeList = ref<any[]>([]);

async function getList() {
  openLoading();
  const data = await fetchNodeList();

  nodeList.value = data;

  setTimeout(() => closeLoading(), 200);
}

getList();
// option

const showDropdownRef = ref(false);
const xRef = ref(0);
const yRef = ref(0);
const currentId = ref('');

function handleContextMenu(e: MouseEvent, c_id: string) {
  e.preventDefault(); // 阻止浏览器默认的右键菜单行为

  showDropdownRef.value = false; // 隐藏自定义右键菜单（如果当前菜单正在显示）
  currentId.value = ''; // 记录点击的节点 id
  nextTick().then(() => {
    // 在下一次 DOM 更新完成后执行以下操作
    showDropdownRef.value = true; // 重新显示自定义右键菜单
    currentId.value = c_id; // 记录点击的节点 id
    xRef.value = e.clientX; // 设置菜单的 X 坐标（基于鼠标点击位置）
    yRef.value = e.clientY; // 设置菜单的 Y 坐标（基于鼠标点击位置）
  });
}
function onClickoutside() {
  showDropdownRef.value = false;
}
function handleSelect(key: number | string, option: any) {
  showDropdownRef.value = false;
}

function createOption(): DropdownMixedOption[] {
  return [
    {
      label: '基本配置',
      key: 'edit',
      props: {
        id: currentId.value,
        onClick: () => {
          operator.value = 'edit';
          title.value = '编辑配置';
          zlmModalAPI.setState({ title: title.value });
          zlmModalAPI.setData({
            operator: operator.value,
            id: currentId.value,
          });
          zlmModalAPI.open();
        },
      },
      icon: () => h(antdEdit),
    },
    {
      label: '高级配置',
      key: 'config',
      props: {
        id: currentId.value,
        onClick: async () => {
          configModalAPI.setData({
            id: currentId.value,
          });
          configModalAPI.open();
          // const d = dialog.warning({
          //   title: '是否同步配置？',
          //   content: '自动同步当前配置到远程流媒体服务器',
          //   positiveText: '确认',
          //   onPositiveClick: async () => {
          //     d.loading = true;
          //     try {
          //       const { data, error, response } = await syncConfig(
          //         currentId.value,
          //       );

          //       if (error) {
          //         message.error(response.data.msg);
          //         return;
          //       }
          //       message.success(data.msg);
          //       getList();
          //     } catch {
          //       d.loading = false;
          //     }
          //   },
          // });
        },
      },
      icon: () => h(antdSync),
    },

    {
      label: '远程配置',
      key: 'remote',
      props: {
        id: currentId.value,
        onClick: () => {
          remoteModalAPI.setData({
            id: currentId.value,
          });
          remoteModalAPI.open();
        },
      },
      icon: () => h(MdiMonitorEye),
    },
    {
      label: '配置同步',
      key: 'sync',
      props: {
        id: currentId.value,
        onClick: async () => {
          const d = dialog.warning({
            title: '是否进行配置同步？',
            content: '自动同步当前数据库的配置到远程流媒体服务器',
            positiveText: '确认',
            onPositiveClick: async () => {
              d.loading = true;
              try {
                await syncConfig(currentId.value);

                message.success('同步成功');
                getList();
              } catch (error: any) {
                message.error(error.msg);
              } finally {
                d.loading = false;
              }
            },
          });
        },
      },
      icon: () => h(MdiWebSync),
    },
    {
      label: '删除',
      key: 'delete',
      props: {
        id: currentId.value,
        onClick: async () => {
          const d = dialog.warning({
            title: '删除节点',
            content: '删除流媒体服务器',
            positiveText: '确认',
            onPositiveClick: async () => {
              d.loading = true;
              try {
                await deleteNodeItem(currentId.value);

                message.success('删除成功');
                getList();
              } finally {
                d.loading = false;
              }
            },
          });
        },
      },
      icon: () => h(antdDelete),
    },
  ];
}
</script>

<template>
  <Page
    content-class="flex flex-col gap-4"
    description="ZLMediaKit流媒体列表，可以实时查看服务状态，右键展开菜单进行维护。"
    title="ZLM管理"
  >
    <template #extra>
      <NButton type="primary" @click="add">
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

    <NCard>
      <NSpin :show="loadingFlag">
        <NGrid
          :x-gap="12"
          :y-gap="24"
          cols="1 s:2 l:4 xxl:5"
          item-responsive
          responsive="screen"
        >
          <NGridItem v-for="item in nodeList" :key="item.id">
            <NCard
              :title="item.name"
              style="width: 300px"
              @contextmenu="
                (event: MouseEvent) => handleContextMenu(event, item.id)
              "
            >
              <template #header-extra>
                <div v-if="!item.online">
                  <NBadge dot type="error" />
                  <span class="d-span">离线</span>
                </div>

                <div v-if="item.online">
                  <NBadge dot type="success" />
                  <span class="d-span">在线</span>
                </div>
              </template>
              <template #cover>
                <img class="c-img" src="/static/zlm.png" />
              </template>
              <div>
                <NTooltip>
                  <template #trigger>
                    <NText depth="3" style="font-size: 12px" tag="div">
                      心跳检测同步时间：{{
                        item.syncHeartbeatTime
                          ? new Date(item.syncHeartbeatTime).toLocaleString()
                          : '无法同步，请检查配置'
                      }}
                    </NText>
                  </template>
                  监听ZLM实例保活上报，当前每{{ item.aliveInterval }}秒同步一次
                </NTooltip>
                <NTooltip placement="bottom">
                  <template #trigger>
                    <NText depth="3" style="font-size: 12px" tag="div">
                      配置文件同步时间：{{
                        item.syncConfigTime
                          ? new Date(item.syncConfigTime).toLocaleString()
                          : '无法同步，请检查配置'
                      }}
                    </NText>
                  </template>
                  将数据库配置同步到ZLM实例的时间
                </NTooltip>
              </div>

              <template #footer>
                <NTooltip trigger="hover">
                  <template #trigger>
                    <NTag class="c-tag" size="small" type="info">
                      <template #icon>
                        <span class="icon-[mdi--ip-outline]"></span>
                      </template>
                      {{ item.ip }}
                    </NTag>
                  </template>
                  ZLM所在服务器IP
                </NTooltip>

                <NTooltip trigger="hover">
                  <template #trigger>
                    <NTag class="c-tag" size="small" type="success">
                      <template #icon>
                        <span
                          class="icon-[mdi--file-powerpoint-box-outline]"
                        ></span>
                      </template>
                      {{ item.httpPort }}
                    </NTag>
                  </template>
                  ZLM服务的http端口
                </NTooltip>
                <NTooltip trigger="hover">
                  <template #trigger>
                    <NTag class="c-tag" size="small" type="warning">
                      <template #icon>
                        <span
                          class="icon-[mdi--file-powerpoint-box-outline]"
                        ></span>
                      </template>
                      {{ item.httpsPort }}
                    </NTag>
                  </template>
                  ZLM服务的https端口
                </NTooltip>
              </template>
            </NCard>
          </NGridItem>
        </NGrid>

        <NEmpty v-if="nodeList.length === 0" class="c-empty" />
      </NSpin>
    </NCard>
    <NDropdown
      :on-clickoutside="onClickoutside"
      :options="createOption()"
      :show="showDropdownRef"
      :x="xRef"
      :y="yRef"
      trigger="manual"
      @select="handleSelect"
    />

    <zlmModal />
    <configModal />
    <remoteModal />
  </Page>
</template>

<style scoped>
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
