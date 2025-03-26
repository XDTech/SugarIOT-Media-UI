import { h } from 'vue';
import useClipboard from 'vue-clipboard3';

import { useUserStore } from '@vben/stores';

import moment from 'moment';
import { NIcon, NText } from 'naive-ui';

import { ShieldIcon } from '#/icons/index';

const { toClipboard } = useClipboard();

export function listToTree(list: any) {
  // 创建一个 Map 来保存所有的节点，以便按 id 查找
  const map = new Map();
  const result: any = [];

  // 1. 遍历所有的节点，构建 map
  list.forEach((item: any) => {
    map.set(item.id, { ...item });
  });

  // 2. 遍历节点并构建树
  list.forEach((item: any) => {
    if (
      item.parentId === null ||
      item.parentId === 0 ||
      item.parentId === '0'
    ) {
      // 如果 parentId 是 null 或 0，说明是根节点

      result.push(map.get(item.id));
    } else {
      // 如果有父节点，将当前节点添加到父节点的 children 中
      const parent = map.get(item.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.suffix = () =>
          h(
            NText,
            { text: true, type: 'primary' },
            { default: () => parent.identity },
          );

        const i = map.get(item.id);

        i.suffix = () =>
          h(
            NText,
            { text: true, type: 'primary' },
            { default: () => i.identity },
          );
        i.prefix = () =>
          h(NIcon, null, {
            default: () => h(ShieldIcon),
          });
        parent.children.push(i);
      }
    }
  });

  return result;
}

const userStore = useUserStore();

export const copyToClipboard = async (text: any) => {
  try {
    await toClipboard(text); // 实现复制
  } catch (error) {
    console.error(error);
  }
};

export function getStreamPrefix() {
  return `${userStore.userInfo?.tenantCode}_`;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}

export function timeFormat(time: number) {
  const duration = moment.duration(time, 'seconds');
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.minutes());
  const seconds = Math.floor(duration.seconds());
  const formattedDuration =
    (hours > 0 ? `${hours}小时 ` : '') +
    (minutes > 0 ? `${minutes}分钟 ` : '') +
    (seconds > 0 ? `${seconds}秒` : '');

  return formattedDuration;
}

export function dateFormat(date: string) {
  return moment.unix(Number(date)).format('YYYY-MM-DD HH:mm:ss');
}
