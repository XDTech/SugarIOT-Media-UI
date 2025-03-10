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
  NIcon,
  NSpace,
  NUpload,
  type TreeInst,
  type TreeOption,
  type UploadFileInfo,
} from 'naive-ui';

import { useVbenForm, z } from '#/adapter/form';
import { message } from '#/adapter/naive';
import {
  createUser,
  getDepartmentList,
  getPermissionList,
  getRole,
  getRoleList,
} from '#/api';
import { getBaseUrl } from '#/utils/base';
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

async function fetchRoleList() {
  const data = await getRoleList(null);
  const promise1 = new Promise((resolve, _) => {
    resolve(data);
  });
  return promise1;
}
async function fetchDepartmentList() {
  const data = await getDepartmentList(null);
  const promise1 = new Promise((resolve, _) => {
    resolve(listToTree(data));
  });
  return promise1;
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
      fieldName: 'avatar',

      formItemClass: 'col-start-2',
      componentProps: {
        placeholder: '请选择头像',
      },
    },

    {
      component: 'Input',
      fieldName: 'name',
      label: '姓名',
      componentProps: {
        placeholder: '请输入姓名',
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
      componentProps: {
        placeholder: '请输入用户名',
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'password',
      label: '密码',
      componentProps: {
        type: 'password',
        placeholder: '请输入密码',
        'show-password-on': 'mousedown',
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'confirmPwd',
      label: '确认密码',
      componentProps: {
        type: 'password',
        placeholder: '请输入密码',
        'show-password-on': 'mousedown',
      },
      rules: z
        .string()
        .min(1, { message: '请确认密码' })
        .refine(
          async (value) => {
            const f = await formApi.getValues();
            if (f.password !== value) {
              return false;
            }
            return true;
          },
          {
            message: '两次密码不一致',
          },
        ),
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      componentProps: {
        placeholder: '请输入邮箱',
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '电话',
      componentProps: {
        placeholder: '请输入电话',
      },
    },
    {
      component: 'Input',
      fieldName: 'postName',
      label: '岗位',
      componentProps: {
        placeholder: '请输入岗位',
      },
    },

    {
      component: 'ApiTreeSelect',
      fieldName: 'departmentId',
      label: '部门',
      componentProps: {
        placeholder: '请选择部门',
        api: fetchDepartmentList,
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        filterable: true,
        checkable: true,
      },
    },

    {
      component: 'ApiTreeSelect',
      fieldName: 'roles',
      label: '角色',
      componentProps: {
        placeholder: '请选择角色',
        api: fetchRoleList,
        labelField: 'name',
        valueField: 'id',
        multiple: true,
        childrenField: 'children',
        filterable: true,
        checkable: true,
        'ax-tag-count': 2,
      },
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

    await createUser(f);

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
function handleFinish({
  file,
  event,
}: {
  event?: ProgressEvent;
  file: UploadFileInfo;
}) {
  try {
    const res = JSON.parse((event?.target as XMLHttpRequest).response);

    formApi.setFieldValue('avatar', res.msg);
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <Modal class="h-[600px] w-[800px]">
    <Form>
      <template #avatar="slotProps">
        <NUpload
          :action="`${getBaseUrl()}/file/upload`"
          list-type="image-card"
          v-bind="slotProps"
          :max="1"
          name="file"
          @finish="handleFinish"
        />
      </template>
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
