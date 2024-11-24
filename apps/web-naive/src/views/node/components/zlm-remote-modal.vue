<!-- eslint-disable perfectionist/sort-imports -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { preferences } from '@vben/preferences';
import { useVbenModal } from '@vben/common-ui';

import { fetchNodeItemConfig } from '#/api';
import { reactive, ref, watch } from 'vue';

const data = ref([]);
const jsonThemes = ref<any>(preferences.theme.mode);

const state = reactive({
  showLength: false,
  showLine: true,
  showLineNumber: true,
  showDoubleQuotes: true,
  collapsedOnClickBrackets: true,
  deep: 4,
  showIcon: true,
  showKeyValueSpace: true,
});

const [remoteModal, remoteModalAPI] = useVbenModal({
  footer: false,
  onOpenChange: async (open) => {
    if (!open) {
      data.value = [];
      return;
    }
    const dt = remoteModalAPI.getData();
    // 获取远程配置
    jsonThemes.value = preferences.theme.mode;

    try {
      const res = await fetchNodeItemConfig(dt.id);
      data.value = res;
    } catch {}
  },
});

watch(
  () => preferences.theme.mode,
  (newVal) => {
    jsonThemes.value = newVal;
  },
);
</script>

<template>
  <remoteModal class="h-[600px] w-[800px]" title="远程配置">
    <VueJsonPretty
      v-model:data="data"
      :collapsed-on-click-brackets="state.collapsedOnClickBrackets"
      :deep="state.deep"
      :show-double-quotes="state.showDoubleQuotes"
      :show-icon="state.showIcon"
      :show-key-value-space="state.showKeyValueSpace"
      :show-length="state.showLength"
      :show-line="state.showLine"
      :show-line-number="state.showLineNumber"
      :theme="jsonThemes"
    />
  </remoteModal>
</template>
