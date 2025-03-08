import { h } from 'vue';

import { ShieldIcon } from '@vben/icons';
import { useUserStore } from '@vben/stores';

import { NIcon, NText } from 'naive-ui';

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

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text); // 将文本写入剪贴板
    return true;
  } catch {
    return false;
  }
}

export function getStreamPrefix() {
  return `${userStore.userInfo?.tenantCode}_`;
}
