<!-- eslint-disable unused-imports/no-unused-vars -->
<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';

import type { SocketMsgBean } from '../model/index';

import { computed, ref, watch } from 'vue';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { NBadge, NFlex, NText, NTooltip } from 'naive-ui';

import { notification } from '#/adapter/naive';
import { useAuthStore, useWebSocketStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

import { SocketMsgEnum } from '../model/index';

const notifications = ref<NotificationItem[]>([
  // {
  //   avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
  //   date: '3小时前',
  //   isRead: true,
  //   message: '描述信息描述信息描述信息',
  //   title: '收到了 14 份新周报',
  // },
  // {
  //   avatar: 'https://avatar.vercel.sh/1',
  //   date: '刚刚',
  //   isRead: false,
  //   message: '描述信息描述信息描述信息',
  //   title: '朱偏右 回复了你',
  // },
  // {
  //   avatar: 'https://avatar.vercel.sh/1',
  //   date: '2024-01-01',
  //   isRead: false,
  //   message: '描述信息描述信息描述信息',
  //   title: '曲丽丽 评论了你',
  // },
  // {
  //   avatar: 'https://avatar.vercel.sh/satori',
  //   date: '1天前',
  //   isRead: false,
  //   message: '描述信息描述信息描述信息',
  //   title: '代办提醒',
  // },
]);

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { destroyWatermark, updateWatermark } = useWatermark();
// eslint-disable-next-line no-unused-vars
const showDot = computed(() =>
  notifications.value.some((item) => !item.isRead),
);

const uploadSpeed = ref('0.00KB');
const downloadSpeed = ref('0.00KB');

const menus = computed(() => [
  // {
  //   handler: () => {
  //     openWindow(VBEN_DOC_URL, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: BookOpenText,
  //   text: $t('ui.widgets.document'),
  // },
  // {
  //   handler: () => {
  //     openWindow(VBEN_GITHUB_URL, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: MdiGithub,
  //   text: 'GitHub',
  // },
  // {
  //   handler: () => {
  //     openWindow(`${VBEN_GITHUB_URL}/issues`, {
  //       target: '_blank',
  //     });
  //   },
  //   icon: CircleHelp,
  //   text: $t('ui.widgets.qa'),
  // },
]);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}

// eslint-disable-next-line no-unused-vars
function handleNoticeClear() {
  notifications.value = [];
}

// eslint-disable-next-line no-unused-vars
function handleMakeAll() {
  notifications.value.forEach((item) => (item.isRead = true));
}

watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);

function procressSocketMsg(data: SocketMsgBean) {
  switch (data.types) {
    case SocketMsgEnum.gbOffline: {
      notification.error({
        content: '国标设备离线',
        description: `【${data.msg}】国标已离线`,
        duration: 3000,
      });
      break;
    }
    case SocketMsgEnum.gbOnline: {
      notification.success({
        content: '国标设备上线',
        description: `【${data.msg}】国标设备已上线`,
        duration: 3000,
      });
      break;
    }

    case SocketMsgEnum.mediaOffline: {
      notification.error({
        content: '服务离线',
        description: `【${data.msg}】实例已离线，请检查配置`,
        duration: 3000,
      });
      break;
    }
    case SocketMsgEnum.mediaOnline: {
      notification.success({
        content: '服务上线',
        description: `【${data.msg}】实例已上线`,
        duration: 3000,
      });
      break;
    }
    case SocketMsgEnum.networkSpeed: {
      uploadSpeed.value = data.data.uploadSpeed;
      downloadSpeed.value = data.data.downloadSpeed;
      break;
    }
  }
}
// ws 客户端

const { latestMessage } = useWebSocketStore();

watch(latestMessage, (msg: MessageEvent) => {
  const info = msg.data;

  if (info) {
    const data: SocketMsgBean = JSON.parse(info);

    procressSocketMsg(data);
  }
});
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :description="userStore.userInfo?.email"
        :menus
        :text="userStore.userInfo?.name"
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <!-- <template #notification>
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @clear="handleNoticeClear"
        @make-all="handleMakeAll"
      />
    </template> -->
    <template #header-right-49>
      <NFlex style="margin-right: 10px" vertical>
        <NFlex>
          <NBadge dot processing style="margin-top: 3px" type="success" />
          <span class="icon-[line-md--uploading-loop]"></span>
          <NTooltip trigger="hover">
            <template #trigger>
              <NText depth="3"> {{ uploadSpeed }} </NText>
            </template>
            上行速度
          </NTooltip>
        </NFlex>

        <NFlex>
          <NBadge dot processing style="margin-top: 3px" type="info" />
          <span class="icon-[line-md--downloading-loop]"></span>
          <NTooltip trigger="hover">
            <template #trigger>
              <NText depth="3">
                {{ downloadSpeed }}
              </NText>
            </template>
            下载速度
          </NTooltip>
        </NFlex>
      </NFlex>
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
