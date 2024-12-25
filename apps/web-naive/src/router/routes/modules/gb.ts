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
        component: () => import('#/views/gb28181/device/index.vue'),
      },
      {
        meta: {
          icon: 'icon-park:ranking-list',
          title: '通道管理',
        },
        name: 'gbChannel',
        path: '/gb/channel',
        component: () => import('#/views/gb28181/channel/index.vue'),
      },
      {
        meta: {
          icon: 'icon-park:inbox-upload-r',
          title: '国标级联',
        },
        name: 'cascade',
        path: '/gb/cascade',
        component: () => import('#/views/gb28181/channel/index.vue'),
      },
    ],
  },
];

export default routes;
