export enum SocketMsgEnum {
  gbOffline = 'gbOffline',
  gbOnline = 'gbOnline',
  mediaOffline = 'mediaOffline',
  mediaOnline = 'mediaOnline',
  networkSpeed = 'networkSpeed',
}

// 定义SocketMsgBean对应的接口
export interface SocketMsgBean {
  types: SocketMsgEnum;
  time: Date;
  msg: string;
  data: any;
}

export enum PTZEnum {
  panLeft = 'panLeft',
  panRight = 'panRight',
  stop = 'stop',
  tiltDown = 'tiltDown',
  tiltUp = 'tiltUp',
  zoomIn = 'zoomIn',
  zoomOut = 'zoomOut',
}
