import { requestClient } from '#/api/request';

/**
 * 获取权限
 */
export async function getPermissionList(form: any) {
  return requestClient.get('/permission/list', { params: form });
}

export async function createPermission(form: any) {
  return requestClient.post('/permission', form);
}

export async function updatePermission(form: any) {
  return requestClient.put('/permission', form);
}
export async function deletePermission(id: string) {
  return requestClient.delete(`/permission/${id}`);
}
export async function getPermission(id: string) {
  return requestClient.get(`/permission/${id}`);
}
