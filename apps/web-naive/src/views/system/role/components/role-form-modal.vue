<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { h, ref } from 'vue';
import { useBoolean } from 'vue-hooks-plus';

import { useVbenModal } from '@vben/common-ui';
import { MsFolder, MsFolderExpand } from '#/icons/index';

import {
  NButton,
  NCheckbox,
  NIcon,
  NInput,
  NSpace,
  NTree,
  type TreeInst,
  type TreeOption,
} from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import { createRole, getPermissionList, getRole, updateRole } from '#/api';
import { listToTree } from '#/utils/util';

const treeInstRef = ref<null | TreeInst>(null);

const pattern = ref('');
const permissionList = ref([]);
const cascadeFlag = ref(false);
const expandFlag = ref(false);
const selectKey = ref<string[]>([]);
const [loading, { setTrue, setFalse }] = useBoolean(false);
const allKey = ref([]);

async function fetchPermissionList() {
  const data = await getPermissionList(null);
  allKey.value = data.map((s: any) => s.id);
  permissionList.value = listToTree(data);
}
fetchPermissionList();
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
      fieldName: 'permissionIds',
      label: 'permissionIds',
      dependencies: {
        show: false,
        triggerFields: ['none'],
      },
    },

    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      help: '角色名称',
      rules: 'required',
    },

    {
      component: 'Input',
      fieldName: 'identity',
      label: '角色标识',
      componentProps: {
        placeholder: '请输入角色标识',
      },
      help: '角色标识 eg:user',
      rules: 'required',
    },

    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: '序号',
      // defaultValue: 10,
      help: '序号',
      componentProps: {
        placeholder: '请输入序号',
        // min: 1,
        // precision: 1,
      },
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        class: 'w-auto',
        options: [
          {
            label: '启用',
            value: 'normal',
          },
          {
            label: '禁用',
            value: 'locked',
          },
        ],
      },

      defaultValue: 'normal',
      rules: 'required',
    },

    {
      component: 'Input',
      fieldName: 'remarks',
      label: '备注',
      // defaultValue: 10,
      componentProps: {
        type: 'textarea',

        placeholder: '请输入备注',
        autosize: { minRows: 1, maxRows: 6 },
      },
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  footer: false,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      pattern.value = '';
      let f: any = {};
      await fetchPermissionList();
      const d = modalApi.getData<Record<string, any>>();

      if (d.operator === 'edit') {
        f = await getRole(d.id);
      }

      await formApi.setValues({ ...f });

      selectKey.value = f.permissions;
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
    const { keys } = treeInstRef.value!.getCheckedData();

    await formApi.setFieldValue('permissionIds', keys);

    await (d.operator === 'edit' ? updateRole(f) : createRole(f));

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
const updatePrefixWithExpaned = (
  _keys: Array<number | string>,
  _option: Array<null | TreeOption>,
  meta: {
    action: 'collapse' | 'expand' | 'filter';
    node: null | TreeOption;
  },
) => {
  if (!meta.node) return;
  switch (meta.action) {
    case 'collapse': {
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(MsFolder),
        });
      break;
    }
    case 'expand': {
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(MsFolderExpand),
        });
      break;
    }
  }
};

function filterNode(pattern: string, node: TreeOption) {
  const regex = new RegExp(pattern, 'i'); // 'i' 忽略大小写
  return !!regex.test(node.label!);
}

function checkAll() {
  selectKey.value = allKey.value;
}
function cancelAll() {
  selectKey.value = [];
}

function renderSwitcherIcon({ expanded }: { expanded: boolean }) {
  return h(NIcon, null, {
    default: () => h(expanded ? MsFolderExpand : MsFolder),
  });
}

const updateCheckedKeys = (v: string[]) => {
  // console.log('updateCheckedKeys', v);
  selectKey.value = v;
};
</script>

<template>
  <Modal class="h-[500px] w-[500px]">
    <Form>
      <div style="margin-left: 50px">
        <NSpace align="center" item-style="display: flex;">
          <NCheckbox
            label="级联选择"
            @update:checked="
              (checked: boolean) => {
                cascadeFlag = checked;
              }
            "
          />
          <NCheckbox
            label="展开/收缩"
            @update:checked="
              (checked: boolean) => {
                expandFlag = checked;
              }
            "
          />
          <NCheckbox
            label="全选/取消全选"
            @update:checked="
              (checked: boolean) => {
                if (checked) {
                  checkAll();
                } else {
                  cancelAll();
                }
              }
            "
          />
        </NSpace>
        <NSpace :size="24" style="margin-top: 5px; margin-bottom: 5px" vertical>
          <NInput v-model:value="pattern" placeholder="搜索" />
        </NSpace>
        <NTree
          ref="treeInstRef"
          :cascade="cascadeFlag"
          :checked-keys="selectKey"
          :data="permissionList"
          :default-checked-keys="selectKey"
          :default-expand-all="expandFlag"
          :filter="filterNode"
          :pattern="pattern"
          :render-switcher-icon="renderSwitcherIcon"
          block-line
          checkable
          checkbox-placement="right"
          expand-on-click
          key-field="id"
          label-field="name"
          show-line
          @update:checked-keys="updateCheckedKeys"
        />
      </div>
    </Form>

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
