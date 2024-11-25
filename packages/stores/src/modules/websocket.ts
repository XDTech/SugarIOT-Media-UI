import { ref } from 'vue';

import { useWebSocket } from '@vueuse/core';
import { defineStore } from 'pinia';

// https://vueuse.vuejs.ac.cn/core/usewebsocket/#type-declarations
export const useWebSocketStore = defineStore('websocket', () => {
  // 使用 useWebSocket hook
  type ConnectFunction = () => void;
  type DisconnectFunction = () => void;
  type SendMessageFunction = (message: any) => void;
  // 使用 ref 创建 WebSocket 相关的状态变量
  const connect = ref<ConnectFunction | undefined>(undefined);
  const disconnect = ref<DisconnectFunction | undefined>(undefined);
  const latestMessage = ref<any>(null);
  const readyState = ref<any | undefined>(undefined);
  const sendMessage = ref<SendMessageFunction | undefined>(undefined);

  const host = 'ws://localhost:8899/websocket/';
  const isConnected = ref(false); // 添加连接状态标志

  function initwebsocket(token: any) {
    // if (isConnected.value) {
    //   console.warn('WebSocket 已经连接，跳过初始化');
    //   return;
    // }
    const url = host + token;
    const {
      close: d1,
      data: lm,
      open: c1,
      send: s,
      status: rs,
    } = useWebSocket(url, {
      autoReconnect: {
        delay: 5000,
      },
      onDisconnected: (event) => {
        console.error('WebSocket 断开', event);
      },
      onError: (event) => {
        console.error('WebSocket error', event);
      },
    });
    // 赋值到响应式变量中

    //

    // /
    connect.value = c1;
    disconnect.value = d1;
    latestMessage.value = lm;
    readyState.value = rs;
    sendMessage.value = s;
    isConnected.value = true;
  }

  function refreshWebSocket(_token: string) {
    // disconnect.value?.();
    // const url = host + token;
    // connect.value?.();
  }

  // 自定义的重置方法
  function $reset() {
    disconnect.value?.();
    connect.value = undefined;
    disconnect.value = undefined;
    latestMessage.value = undefined;
    readyState.value = undefined;
    sendMessage.value = undefined;
  }
  return {
    $reset,
    connect,
    disconnect,
    initwebsocket,
    latestMessage,
    readyState,
    refreshWebSocket,
    sendMessage,
  };
});
