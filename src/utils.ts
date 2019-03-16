import { TOKEN_PREFIX } from './constant';

/**
 * 生成grpc客户端token
 * @param token
 */
export function getToken(token: string) {
  return TOKEN_PREFIX + token;
}

/**
 * 生成 grpc server的token
 * @param packageName
 * @param serviceName
 */
export function getServiceToken(packageName: string, serviceName: string) {
  return getToken(packageName) + '_' + serviceName;
}

