import { requestClient } from '#/api/request';

/**
 * 获取部门列表
 */
export async function getDepartmentList(form: any) {
  return requestClient.get('/department/list', { params: form });
}

export async function createDepartment(form: any) {
  return requestClient.post('/department', form);
}

export async function updateDepartment(form: any) {
  return requestClient.put('/department', form);
}
export async function deleteDepartment(id: string) {
  return requestClient.delete(`/department/${id}`);
}
export async function getDepartment(id: string) {
  return requestClient.get(`/department/${id}`);
}
