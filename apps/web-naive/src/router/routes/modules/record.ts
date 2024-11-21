import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park:record-player',
      keepAlive: true,
      order: 1100,
      title: '录像管理',
    },
    name: 'record',

    path: '/record',
    children: [
      {
        meta: {
          icon: 'icon-park:videocamera-one',
          title: '录像回放',
        },
        path: '/record/video',
        component: () => import('#/views/node/zlm/index.vue'),
      },
    ],
  },
];

export default routes;
