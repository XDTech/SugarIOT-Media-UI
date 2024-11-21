import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park:online-meeting',
      keepAlive: true,
      order: 1150,
      title: 'Onvif管理',
    },
    name: 'onvif',

    path: '/onvif',
    children: [
      {
        meta: {
          icon: 'icon-park:network-tree',
          title: 'Onvif设备',
        },
        path: '/onvif/device',
        component: () => import('#/views/node/zlm/index.vue'),
      },
    ],
  },
];

export default routes;
