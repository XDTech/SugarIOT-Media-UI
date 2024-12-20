import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park:devices',
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
        name: 'gbDevice',
        path: '/gb/device',
        component: () => import('#/views/gb2312/device/index.vue'),
      },
      {
        meta: {
          icon: 'icon-park:ranking-list',
          title: '通道管理',
        },
        name: 'gbChannel',
        path: '/gb/channel',
        component: () => import('#/views/gb2312/channel/index.vue'),
      },
    ],
  },
];

export default routes;
