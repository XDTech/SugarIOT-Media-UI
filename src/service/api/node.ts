import { request } from '../request';

export function fetchCreateNode(form: any) {
  return request({
    url: '/node',
    method: 'post',
    data: form
  });
}
