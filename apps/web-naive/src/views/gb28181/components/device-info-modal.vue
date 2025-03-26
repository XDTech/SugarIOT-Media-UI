<script lang="ts" setup>
import { ref } from 'vue';

import { useUserStore } from '@vben/stores';

import moment from 'moment';
import {
  NDescriptions,
  NDescriptionsItem,
  NDivider,
  NTabPane,
  NTabs,
  NText,
} from 'naive-ui';

import { fetchDeviceInfo, fetchSystemConfig } from '#/api/core/gb';

const userStore = useUserStore();
const deviceId = defineModel();
const tenantCode = ref(userStore.userInfo?.tenantCode);
const defaultDevice = {
  id: '',
  name: '',
  deviceId: '',
  pwd: '',
  deviceType: '',
  nodeId: '',
  nodeHost: '',
  nodePort: '',
  host: '',
  port: '',
  transport: '',
  status: '0', // 默认状态
  deviceName: '',
  manufacturer: '',
  firmware: '',
  netType: '',
  model: '',
  channel: 0, // 默认通道为 0
  syncTime: '',
};

const device = ref<any>(defaultDevice);

const defaultConfig = {
  domain: '',
  id: '',
  ip: '',
  port: '',
  pwd: '',
  remoteIp: '',
};
const config = ref(defaultConfig);
async function getDeviceInfo() {
  device.value = await fetchDeviceInfo(deviceId.value);
}
getDeviceInfo();

async function getConfig() {
  config.value = await fetchSystemConfig();
}

getConfig();
function getContent(type: string) {
  switch (type) {
    case 'ip_camera': {
      return 'IP Camera';
    }
    case 'nvr': {
      return 'NVR';
    }

    default: {
      return '';
    }
  }
}
</script>

<template>
  <NTabs animated type="line">
    <NTabPane name="oasis" tab="基本信息">
      <NDescriptions bordered label-placement="top">
        <NDescriptionsItem label="设备名称">
          <NText depth="3"> {{ device.name }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="设备ID">
          <NText depth="3"> {{ device.deviceId }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="设备类型">
          <NText depth="3">
            {{ getContent(device.deviceType) }}
          </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="IP">
          <NText depth="3"> {{ device.host || '暂未同步' }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="Port">
          <NText depth="3"> {{ device.port }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="型号">
          <NText depth="3"> {{ device.model }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="厂家">
          <NText depth="3"> {{ device.manufacturer }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="状态">
          <NText depth="3">
            {{ device.status === '1' ? '在线' : '离线' }}
          </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="传输方式">
          <NText depth="3"> {{ device.transport }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="通道数量">
          <NText depth="3"> {{ device.channel }} </NText>
        </NDescriptionsItem>

        <NDescriptionsItem label="固件版本">
          <NText depth="3">
            {{ device.firmware }}
          </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="密码">
          <NText depth="3">
            {{ device.pwd }}
          </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="同步时间">
          <NText depth="3">
            {{
              device.syncTime
                ? `${moment(device.syncTime).format('YYYY/MM/DD HH:mm:ss')}`
                : '暂未同步 '
            }}
          </NText>
        </NDescriptionsItem>
      </NDescriptions>
    </NTabPane>
    <NTabPane name="the beatles" tab="国标对接">
      <NDivider title-placement="center"> SIP服务器配置 </NDivider>

      <NDescriptions :column="4" bordered label-placement="top">
        <NDescriptionsItem label="SIP服务器ID">
          <NText depth="3"> {{ config.id }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="SIP服务器域">
          <NText depth="3"> {{ config.domain }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="SIP服务器地址">
          <NText depth="3">
            {{
              device.netType === 'private_type' ? config.ip : config.remoteIp
            }}
          </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="SIP服务器端口">
          <NText depth="3">
            {{ config.port }}
          </NText>
        </NDescriptionsItem>
      </NDescriptions>

      <NDivider title-placement="center"> 设备配置 </NDivider>

      <NDescriptions :column="4" bordered label-placement="top">
        <NDescriptionsItem label="SIP用户名">
          <NText depth="3"> {{ device.deviceId }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="SIP用户认证ID">
          <NText depth="3"> {{ device.deviceId }} </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="密码">
          <NText depth="3">
            {{ device.pwd ? device.pwd : config.pwd }}
          </NText>
        </NDescriptionsItem>
        <NDescriptionsItem label="心跳周期">
          <NText depth="3"> 1-60(秒) </NText>
        </NDescriptionsItem>
      </NDescriptions>

      <NDivider title-placement="center"> 通道配置 </NDivider>

      <NDescriptions :column="4" bordered label-placement="top">
        <NDescriptionsItem label="通道编码">
          <NText depth="3"> {{ `${tenantCode}0000132+{7位流水号}` }} </NText>
        </NDescriptionsItem>
      </NDescriptions>
    </NTabPane>
    <NTabPane name="jay chou" tab="日志" />
  </NTabs>
</template>

<style scoped></style>
