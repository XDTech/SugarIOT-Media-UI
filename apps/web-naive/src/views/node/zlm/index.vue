<script lang="ts" setup>
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';

import { h, nextTick, ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { Page } from '@vben/common-ui';
import {
  antdDelete,
  antdEdit,
  antdSync,
  MdiPlus,
  MdiRefresh,
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
  useMessage,
} from 'naive-ui';

import { dialog } from '#/adapter/naive';
import { deleteNodeItem, fetchNodeList, syncConfig } from '#/api';

const message = useMessage();

const [visible, { setTrue: openModal }] = useBoolean();

const [loadingFlag, { setTrue: openLoading, setFalse: closeLoading }] =
  useBoolean();

const title = ref('新增节点');
const operator = ref('add');

const types = ref('zlm');
function add() {
  console.warn(visible.value);
  operator.value = 'add';
  openModal();
}

// get list

const nodeList = ref<any[]>([]);

async function getList() {
  openLoading();
  const data = await fetchNodeList(types.value);

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
  console.warn(key, option);
}

function createOption(): DropdownMixedOption[] {
  return [
    {
      label: '配置服务',
      key: 'config',
      props: {
        id: currentId.value,
        onClick: async () => {
          const d = dialog.warning({
            title: '是否同步配置？',
            content: '自动同步当前配置到远程流媒体服务器',
            positiveText: '确认',
            onPositiveClick: async () => {
              d.loading = true;
              try {
                const { data, error, response } = await syncConfig(
                  currentId.value,
                );

                if (error) {
                  message.error(response.data.msg);
                  return;
                }
                message.success(data.msg);
                getList();
              } catch {
                d.loading = false;
              }
            },
          });
        },
      },
      icon: () => h(antdSync),
    },
    {
      label: '编辑',
      key: 'edit',
      props: {
        id: currentId.value,
        onClick: () => {
          operator.value = 'edit';
          title.value = '编辑节点';
          openModal();
        },
      },
      icon: () => h(antdEdit),
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
                const { data, error, response } = await deleteNodeItem(
                  currentId.value,
                );

                if (error) {
                  message.error(response.data.msg);
                  return;
                }
                message.success(data.msg);
                getList();
              } catch {
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
          cols="1 s:2 l:4"
          item-responsive
          responsive="screen"
        >
          <NGridItem v-for="item in nodeList" :key="item.id">
            <NCard
              :title="item.name"
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
                <NTag class="c-tag" size="small" type="info">
                  {{ item.ip }}
                </NTag>
              </div>
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
