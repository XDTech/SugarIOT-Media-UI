export enum SocketMsgEnum {
  mediaOffline = 'mediaOffline',
  mediaOnline = 'mediaOnline',
}

// 定义SocketMsgBean对应的接口
export interface SocketMsgBean {
  types: SocketMsgEnum;
  time: Date;
  msg: string;
}