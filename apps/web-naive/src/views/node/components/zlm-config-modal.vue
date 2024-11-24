<!-- eslint-disable unused-imports/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

const [configModal, configModalAPI] = useVbenModal({
  // 连接抽离的组件
  // connectedComponent: zlmFormModal,
  footer: false,
  onOpenChange: (open) => {},
});
</script>

<template>
  <configModal class="h-[600px] w-[800px]" title="高级配置">
    我这辈子最疯狂的事，发生在我在 Amazon 当软件工程师的时候，故事是这样的：<br /><br />
    那时我和女朋友住在一起，正在家里远程工作。忽然同事给我发来了紧急消息：”我们的服务出现了
    SEV 2 级别的故障！需要所有的人马上协助！“我们组的应用全挂掉了。<br /><br />
    当我还在费力的寻找修复方法的时候，忽然闻到隔壁房间的的焦味，防火报警器开始鸣叫。
  </configModal>
</template>
