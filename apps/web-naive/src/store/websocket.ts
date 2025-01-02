import { ref } from 'vue';
import { useWebSocket } from 'vue-hooks-plus';

import { useAppConfig } from '@vben/hooks';

import { defineStore } from 'pinia';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
export const useWebSocketStore = defineStore('websocket', () => {
  // 使用 useWebSocket hook
  type ConnectFunction = () => void;
  type DisconnectFunction = () => void;
  type SendMessageFunction = (message: any) => void;
  // 使用 ref 创建 WebSocket 相关的状态变量
  const connect = ref<ConnectFunction | undefined>(undefined);
  const disconnect = ref<DisconnectFunction | undefined>(undefined);
  const latestMessage = ref<any>(null);
  const readyState = ref<number | undefined>(undefined);
  const sendMessage = ref<SendMessageFunction | undefined>(undefined);
  const host = `${apiURL}/websocket/`;

  const isConnected = ref(false); // 添加连接状态标志

  function initwebsocket(token: any) {
    // if (isConnected.value) {
    //   console.warn('WebSocket 已经连接，跳过初始化');
    //   return;
    // }

    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    token = String(array[0]);
    const url = host + token;
    const {
      connect: c1,
      disconnect: d1,
      latestMessage: lm,
      readyState: rs,
      sendMessage: send,
    } = useWebSocket(url, {});
    // 赋值到响应式变量中

    //

    // /
    connect.value = c1;
    disconnect.value = d1;
    latestMessage.value = lm;
    readyState.value = rs.value;
    sendMessage.value = send;
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
