import qs from 'qs';

import { requestClient } from '#/api/request';

export async function fetchDeviceList(form: any) {
  const data = await requestClient.get(`/gb/device/page/list`, {
    params: form,
  });

  return data;
}

export async function fetchCreateDevice(form: any) {
  return requestClient.post('/gb/device/register', form);
}

export async function fetchDeviceInfo(deviceId: any) {
  return requestClient.get(`/gb/device/${deviceId}`);
}

export async function fetchUpdateDevice(form: any) {
  return requestClient.put('/gb/device/register', form);
}
export async function fetchSyncInfo(deviceId: any) {
  return requestClient.get(`/gb/device/sync/info/catalog/${deviceId}`);
}
export async function fetchDelDevice(deviceId: any) {
  return requestClient.delete(`/gb/device/${deviceId}`);
}

export async function fetchChannelList(deviceId: any) {
  return requestClient.get(`/gb/channel/list/${deviceId}`);
}

export async function fetchChannelInvite(channelId: any) {
  return requestClient.get(`/gb/channel/invite/${channelId}`);
}

export async function fetchChannelPageList(form: any) {
  const data = await requestClient.get(`/gb/channel/page/list`, {
    params: form,
  });

  return data;
}

export async function fetchSystemConfig() {
  return requestClient.get('/gb/device/system/config');
}

export async function fetchSendBye(channelId: string) {
  return requestClient.post(`/gb/channel/send/bye/${channelId}`);
}

export async function fetchDelChannel(channelId: any) {
  return requestClient.delete(`/gb/channel/${channelId}`);
}

export async function fetchChannel(channelId: any) {
  return requestClient.get(`/gb/channel/${channelId}`);
}

export async function fetchUpdateChannel(channel: any) {
  return requestClient.put(`/gb/channel`, null, {
    params: channel,
  });
}

export async function fetchPtz(
  deviceCode: any,
  channelCode: any,
  directions: any,
  speed: any,
) {
  const param = qs.stringify({ directions }, { arrayFormat: 'repeat' });
  return requestClient.get(
    `/gb/channel/ptz/${deviceCode}/${channelCode}/${speed}?${param}`,
  );
}
