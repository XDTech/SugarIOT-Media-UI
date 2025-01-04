import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getScreenList() {
  return requestClient.get('/screen/list');
}
