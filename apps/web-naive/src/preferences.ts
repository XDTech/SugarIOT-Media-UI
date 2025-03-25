import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    loginExpiredMode: 'modal',
  },
  copyright: {
    date: '2025',
    companyName: '潍坊信达胜宇信息科技有限公司',
    companySiteLink: 'https://xdsy.tech',
    enable: true,
    icp: '鲁ICP备2022033289号-1',
    icpLink: 'https://beian.miit.gov.cn',
  },
  theme: {
    mode: 'auto',
  },
});
