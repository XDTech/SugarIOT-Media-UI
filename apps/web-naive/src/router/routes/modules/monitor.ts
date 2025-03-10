import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'tdesign:system-setting',
      order: 2,
      title: '系统监控',
    },
    name: 'monitor',
    path: '/monitor',
    children: [
      {
        name: '系统信息',
        path: '/monitor/info',
        component: () => import('#/views/monitor/info.vue'),
        meta: {
          icon: 'material-symbols:chat-info-outline-sharp',
          title: '系统信息',
        },
      },
    ],
  },
];

export default routes;
