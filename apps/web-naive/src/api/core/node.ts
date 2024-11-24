import { requestClient } from '#/api/request';

export async function fetchCreateNode(form: any) {
  return requestClient.post('/node/zlm', form);
}

export async function fetchUpdateNode(form: any) {
  return requestClient.put('/node/zlm', form);
}

export async function fetchNodeItem(id: string) {
  return requestClient.get(`/node/zlm/${id}`);
}

export async function fetchNodeItemConfig(id: string) {
  return requestClient.get(`/node/zlm/remote/${id}`);
}

export async function deleteNodeItem(id: string) {
  return requestClient.delete(`/node/zlm/${id}`);
}

export async function syncConfig(id: string) {
  return requestClient.put(`/node/zlm/sync/${id}`);
}

export async function fetchNodeList() {
  const data = await requestClient.get(`/node/zlm/list`);

  return data;
}
