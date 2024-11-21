import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park:system',
      keepAlive: true,
      order: 1200,
      title: '系统设置',
    },
    name: 'system',

    path: '/system',
    children: [
      {
        meta: {
          icon: 'icon-park:user',
          title: '用户管理',
        },
        path: '/gb/device',
        component: () => import('#/views/node/zlm/index.vue'),
      },
    ],
  },
];

export default routes;
