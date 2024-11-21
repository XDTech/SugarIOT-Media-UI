import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park:devices',
      keepAlive: true,
      order: 900,
      title: '国标管理',
    },
    name: 'gb',

    path: '/gb',
    children: [
      {
        meta: {
          icon: 'icon-park:surveillance-cameras',
          title: '国标设备',
        },
        path: '/gb/device',
        component: () => import('#/views/node/zlm/index.vue'),
      },
    ],
  },
];

export default routes;
