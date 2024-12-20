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
