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
