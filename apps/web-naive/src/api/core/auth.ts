import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    isLogin: boolean; // 表示是否登录
    loginDevice: string; // 登录设备信息
    loginId: string; // 登录用户 ID
    loginType: string; // 登录类型
    sessionTimeout: string; // 会话超时时间
    tag: null | string; // 标签，可以为空
    tokenActiveTimeout: string; // Token 活跃超时时间
    tokenName: string; // Token 名称
    tokenSessionTimeout: string; // Token 会话超时时间
    tokenTimeout: string; // Token 总超时时间
    tokenValue: string; // Token 值
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/login/user', null, {
    params: { username: data.username, password: data.password },
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/user/codes');
}
