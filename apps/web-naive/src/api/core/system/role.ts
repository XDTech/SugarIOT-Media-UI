import { requestClient } from '#/api/request';

/**
 * 获取角色
 */
export async function getRolePageList(form: any) {
  return requestClient.get('/role/page/list', { params: form });
}

export async function getRoleList(form: any) {
  return requestClient.get('/role/list', { params: form });
}

export async function deleteRole(id: string) {
  return requestClient.delete(`/role/${id}`);
}

export async function createRole(form: any) {
  return requestClient.post('/role', form);
}

export async function updateRole(form: any) {
  return requestClient.put('/role', form);
}

export async function getRole(id: string) {
  return requestClient.get(`/role/${id}`);
}
