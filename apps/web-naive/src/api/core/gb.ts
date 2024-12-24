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
