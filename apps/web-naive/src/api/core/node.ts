import { requestClient } from '#/api/request';

export async function fetchCreateNode(form: any) {
  return requestClient.post('/node', form);
}

export async function fetchUpdateNode(form: any) {
  return requestClient.put('/node', form);
}

export async function fetchNodeItem(id: string) {
  return requestClient.get(`/node/${id}`);
}

export async function deleteNodeItem(id: string) {
  return requestClient.delete(`/node/${id}`);
}

export async function syncConfig(id: string) {
  return requestClient.put(`/node/sync/${id}`);
}

export async function fetchNodeList(type: string = '') {
  const arr: any[] = [];

  const data = await requestClient.get(`/node/list`);

  if (data) {
    data.forEach((item: any) => {
      if (item.types === type) {
        arr.push(item);
      }
    });
  }

  return arr;
}
