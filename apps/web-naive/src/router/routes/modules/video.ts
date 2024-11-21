import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park:video-conference',
      keepAlive: true,
      order: 1000,
      title: '视频广场',
    },
    name: 'video',

    path: '/video',
    children: [
      {
        meta: {
          icon: 'icon-park:data-screen',
          title: '分屏视频',
        },
        name: 'screen',
        path: '/video/screen',
        component: () => import('#/views/node/zlm/index.vue'),
      },
    ],
  },
];

export default routes;
