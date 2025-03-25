import { requestClient } from '#/api/request';

export async function getScreenList() {
  return requestClient.get('/screen/list');
}
