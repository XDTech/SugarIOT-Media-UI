<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchCreateNode } from '@/service/api';

defineOptions({
  name: 'MenuOperateModal'
});

export type OperateType = NaiveUI.TableOperateType | 'add';

// model 开关
const visible = defineModel<boolean>('visible', {
  default: false
});

function closeDrawer() {
  visible.value = false;
}

// 定义基本接收属性
interface Props {
  title: string;
  /** the type of operation */
  operateType: OperateType;
}

const props = defineProps<Props>();

// form
const Model = {
  name: '',
  ip: '',
  types: 'zlm',
  httpPort: '',
  httpsPort: ``
};

const model = ref(Model);

const { defaultRequiredRule } = useFormRules();
const { formRef, validate, restoreValidation } = useNaiveForm();
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const rules = {
  name: defaultRequiredRule,
  ip: defaultRequiredRule,
  types: defaultRequiredRule,
  httpPort: defaultRequiredRule,
  httpsPort: defaultRequiredRule
};

async function handleSubmit() {
  await validate();

  // 提交
  const res = await fetchCreateNode(model.value);
  console.log(res);
}
</script>

<template>
  <NModal v-model:show="visible" preset="card" :title="props.title" class="w-800px">
    <NScrollbar class="h-480px pr-20px">
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi span="24 m:12" label="名称" path="name">
            <NInput v-model:value="model.name" placeholder="请输入名称" />
          </NFormItemGi>
          <NFormItemGi span="24 m:12" label="IP" path="ip">
            <NInput v-model:value="model.ip" type="text" placeholder="请输入IP" />
          </NFormItemGi>

          <NFormItemGi span="24 m:12" label="HTTP端口" path="httpPort">
            <NInput
              v-model:value="model.httpPort"
              type="text"
              :allow-input="onlyAllowNumber"
              placeholder="请输入http端口"
            />
          </NFormItemGi>

          <NFormItemGi span="24 m:12" label="HTTPS端口" path="httpsPort">
            <NInput
              v-model:value="model.httpsPort"
              type="text"
              :allow-input="onlyAllowNumber"
              placeholder="请输入https端口"
            />
          </NFormItemGi>
        </NGrid>
      </NForm>
    </NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">关闭</NButton>
        <NButton type="primary" @click="handleSubmit">提交</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
