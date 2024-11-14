<script setup lang="ts">
defineOptions({
  name: 'MenuOperateModal'
});

export type OperateType = NaiveUI.TableOperateType | 'addChild';

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeDrawer() {
  visible.value = false;
}
</script>

<template>
  <NModal v-model:show="visible" preset="card" class="w-800px">
    <NScrollbar class="h-480px pr-20px"></NScrollbar>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">关闭</NButton>
        <NButton type="primary">提交</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
