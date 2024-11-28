import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park:surveillance-cameras-one',
      keepAlive: true,
      order: 950,
      title: '流媒体管理',
    },
    name: 'stream',

    path: '/stream',
    children: [
      {
        meta: {
          icon: 'icon-park:pull-requests',
          title: '拉流代理',
        },
        name: 'pullStream',
        path: '/stream/pull',
        component: () => import('#/views/stream/stream-pull.vue'),
      },
      {
        meta: {
          icon: 'icon-park:invert-camera',
          title: '推流管理',
        },
        name: 'pushStream',
        path: '/stream/push',
        component: () => import('#/views/node/zlm/index.vue'),
      },
    ],
  },
];

export default routes;
