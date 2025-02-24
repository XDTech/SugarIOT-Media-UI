import { useUserStore } from '@vben/stores';

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
