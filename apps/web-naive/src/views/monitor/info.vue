<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NGrid,
  NGridItem,
  NTable,
} from 'naive-ui';
import Numeral from 'numeral';

import { getOsInfo } from '#/api';

interface JVM {
  jdkVersion: string;
  jvmTotalMemory: string;
  jvmRuntime: string;
  jvmUseMemory: string;
  jvmMemory: string;
  jdkHome: string;
  jvmFreeMemory: string;
}

interface OS {
  osInfo: string;
  osArch: string;
  osName: string;
}

interface Memory {
  remainingMemory: string;
  useMemory: string;
  totalMemory: string;
  memoryUsage: string;
}

interface Cpu {
  cpuUserUse: string;
  totalCpu: number;
  cpuSysUse: string;
  cpuUseRate: string;
}
interface Disk {
  name: string;
  total: string;
  available: string;
  used: string;
  usageRate: string;
}

interface SystemInfo {
  jvm: JVM;
  os: OS;
  memory: Memory;
  cpu: Cpu;
  disk: Disk[];
}

const osInfo = ref<SystemInfo>();

async function systemInfo() {
  osInfo.value = await getOsInfo();
}

onMounted(() => {
  systemInfo();
});

function numberRate(value: any) {
  return Numeral(value).format('0%');
}
</script>

<template>
  <Page>
    <!---cpu 内存--->
    <NGrid :cols="2" :x-gap="12" :y-gap="8">
      <NGridItem>
        <NCard title="CPU">
          <NDescriptions :column="4" bordered label-placement="top">
            <NDescriptionsItem>
              <template #label> CPU核数 </template>
              {{ osInfo?.cpu.totalCpu }}
            </NDescriptionsItem>
            <NDescriptionsItem label="CPU系统使用率">
              {{ numberRate(osInfo?.cpu.cpuSysUse) }}
            </NDescriptionsItem>
            <NDescriptionsItem label="CPU用户使用率">
              {{ numberRate(osInfo?.cpu.cpuUserUse) }}
            </NDescriptionsItem>

            <NDescriptionsItem label="CPU当前使用率">
              {{ numberRate(osInfo?.cpu.cpuUseRate) }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
      </NGridItem>
      <NGridItem>
        <NCard title="内存">
          <NDescriptions :column="4" bordered label-placement="top">
            <NDescriptionsItem>
              <template #label> 总内存 </template>
              {{ osInfo?.memory.totalMemory }}
            </NDescriptionsItem>
            <NDescriptionsItem label="已用内存">
              {{ osInfo?.memory.useMemory }}
            </NDescriptionsItem>
            <NDescriptionsItem label="剩余内存">
              {{ osInfo?.memory.remainingMemory }}
            </NDescriptionsItem>

            <NDescriptionsItem label="内存使用率">
              {{ numberRate(osInfo?.memory.memoryUsage) }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
      </NGridItem>
    </NGrid>
    <NGrid :cols="1" :x-gap="12" :y-gap="8" class="grid-space">
      <NGridItem>
        <NCard title="服务器信息">
          <NDescriptions :column="3" bordered label-placement="top">
            <NDescriptionsItem>
              <template #label> 系统信息 </template>
              {{ osInfo?.os.osInfo }}
            </NDescriptionsItem>
            <NDescriptionsItem label="系统名称">
              {{ osInfo?.os.osName }}
            </NDescriptionsItem>
            <NDescriptionsItem label="系统架构">
              {{ osInfo?.os.osArch }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
      </NGridItem>
    </NGrid>

    <NGrid :cols="1" :x-gap="12" :y-gap="8" class="grid-space">
      <NGridItem>
        <NCard title="JVM信息">
          <NDescriptions :column="3" bordered label-placement="top">
            <NDescriptionsItem>
              <template #label> JDK版本 </template>
              {{ osInfo?.jvm.jdkVersion }}
            </NDescriptionsItem>
            <NDescriptionsItem label="JVM内存总量">
              {{ osInfo?.jvm.jvmTotalMemory }}
            </NDescriptionsItem>
            <NDescriptionsItem label="JVM已使用内存">
              {{ osInfo?.jvm.jvmUseMemory }}
            </NDescriptionsItem>
            <NDescriptionsItem label="JVM空闲空间">
              {{ osInfo?.jvm.jvmFreeMemory }}
            </NDescriptionsItem>
            <NDescriptionsItem label="JVM使用率">
              {{ numberRate(osInfo?.jvm.jvmMemory) }}
            </NDescriptionsItem>

            <NDescriptionsItem label="运行时长">
              {{ osInfo?.jvm.jvmRuntime }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
      </NGridItem>
    </NGrid>
    <NGrid :cols="1" :x-gap="12" :y-gap="8" class="grid-space">
      <NGridItem>
        <NCard title="磁盘信息">
          <NTable :bordered="false" :single-line="false">
            <thead>
              <tr>
                <th>磁盘名称</th>
                <th>总量</th>
                <th>可用</th>
                <th>已使用</th>
                <th>使用率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in osInfo?.disk" :key="index">
                <td>
                  {{ item.name }}
                </td>
                <td>{{ item.total }}</td>
                <td>{{ item.available }}</td>
                <td>{{ item.used }}</td>
                <td>{{ numberRate(item.usageRate) }}</td>
              </tr>
            </tbody>
          </NTable>
        </NCard>
      </NGridItem>
    </NGrid>
  </Page>
</template>

<style scoped>
.grid-space {
  margin-top: 10px;
}
</style>
