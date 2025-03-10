import type { RouteRecordRaw } from 'vue-router';

import { SvgZlmLogoIcon } from '#/icons';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'icon-park:triangle-round-rectangle',
      keepAlive: true,
      order: 800,
      title: '节点管理',
    },
    name: 'node',

    path: '/node',
    children: [
      {
        meta: {
          icon: SvgZlmLogoIcon,
          title: 'ZLM管理',
        },
        name: 'zlmManager',
        path: '/node/zlm',
        component: () => import('#/views/node/zlm/index.vue'),
      },
    ],
  },
];

export default routes;
