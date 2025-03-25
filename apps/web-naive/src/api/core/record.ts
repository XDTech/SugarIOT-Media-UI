import { requestClient } from '#/api/request';

export async function getRecordList(form: any) {
  return requestClient.get('/record/page/list', { params: form });
}
