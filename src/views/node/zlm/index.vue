<script setup lang="ts">
import { useBoolean } from '~/packages/hooks/src';
import ZlmAddEdit from '../component/zlm-add-edit.vue';

const { bool: visible, setTrue: openModal } = useBoolean();
function add() {
  console.log(visible.value);
  openModal();
}
</script>

<template>
  <div>
    <div class="overflow-hidden">
      <NCard title="ZLM节点" :bordered="false" class="h-full card-wrapper" content-class="overflow-hidden">
        <template #header-extra>
          <NButton size="small" ghost type="primary" @click="add">
            <template #icon>
              <IconIcRoundPlus />
            </template>
            新增
          </NButton>
        </template>

        <NGrid cols="1 s:2 l:4" :x-gap="12" :y-gap="24" responsive="screen" item-responsive>
          <NGridItem>
            <NCard title="ZLM Media Server">
              <template #header-extra>
                <!--
 <div>
                  <NBadge dot type="error" />
                  <span class="d-span">离线</span>
                </div>
-->
                <div>
                  <NBadge dot type="success" />
                  <span class="d-span">在线</span>
                </div>
              </template>
              <template #cover>
                <img class="c-img" src="https://raw.githubusercontent.com/ZLMediaKit/ZLMediaKit/master/www/logo.png" />
              </template>
              <div>
                <NTag class="c-tag" size="small" type="info">192.168.1.6</NTag>
              </div>
            </NCard>
          </NGridItem>
        </NGrid>
      </NCard>
    </div>

    <ZlmAddEdit v-model:visible="visible"></ZlmAddEdit>
  </div>
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
</style>
