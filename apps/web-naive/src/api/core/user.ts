import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

export async function getUserInfo(id: string) {
  return requestClient.get(`/user/${id}`);
}

export async function createUser(form: any) {
  return requestClient.post('/user', form);
}
export async function updateUser(form: any) {
  return requestClient.put('/user', form);
}

export async function updateUserAccount(id: string, username: string) {
  return requestClient.put('/user/account', null, { params: { id, username } });
}

export async function updateUserPwd(id: string, pwd: string) {
  return requestClient.put('/user/pwd', null, { params: { id, pwd } });
}

export async function getUserPageList(form: any) {
  return requestClient.get('/user/page/list', { params: form });
}

export async function deleteUser(id: string) {
  return requestClient.delete(`/user/${id}`);
}
