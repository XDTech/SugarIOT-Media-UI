import { requestClient } from '#/api/request';

/**
 * 获取部门列表
 */
export async function getOsInfo() {
  return requestClient.get('/monitor');
}
