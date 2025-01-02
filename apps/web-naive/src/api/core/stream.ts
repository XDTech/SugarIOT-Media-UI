import { requestClient } from '#/api/request';

export async function fetchCreatePull(form: any) {
  return requestClient.post('/stream/pull', form);
}

export async function fetchPullList(form: any) {
  return requestClient.get('/stream/pull/page/list', { params: form });
}

export async function fetchPullItem(id: any) {
  return requestClient.get(`/stream/pull/${id}`);
}

export async function fetchUpdatePull(form: any) {
  return requestClient.put('/stream/pull', form);
}

export async function fetchDelPull(id: string) {
  return requestClient.delete(`/stream/pull/${id}`);
}

export async function fetchClosePull(id: string) {
  return requestClient.delete(`/stream/pull/close/proxy/${id}`);
}

export async function fetchProxyPull(id: string) {
  return requestClient.post(`/stream/pull/proxy/${id}`);
}
export async function fetchProxyAddress(id: string) {
  return requestClient.get(`/stream/pull/proxy/address/${id}`);
}

// ====推流列表

export async function fetchPushList(form: any) {
  return requestClient.get('/stream/push/page/list', { params: form });
}

export async function fetchPushAddr(id: any) {
  return requestClient.get(`/stream/push/addr/${id}`);
}

export async function fetchClosePush(id: string) {
  return requestClient.post(`/stream/push/close/${id}`);
}

export async function fetchDeletePush(id: string) {
  return requestClient.delete(`/stream/push/${id}`);
}

export async function fetchPushItem(id: any) {
  return requestClient.get(`/stream/push/${id}`);
}

export async function fetchUpdatePushItem(id: any, name: string) {
  return requestClient.put(`/stream/push/${id}?name=${name}`);
}
