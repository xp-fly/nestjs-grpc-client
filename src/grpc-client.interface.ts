/**
 * grpc 的服务配置
 */
import { GrpcOptions } from '@nestjs/microservices';

export type PickType<T, U extends keyof T> = T[U];

export type GrpcOptionsOptions = Pick<PickType<GrpcOptions, 'options'>,
  'maxSendMessageLength' | 'maxReceiveMessageLength' | 'credentials' | 'package' | 'protoLoader'> & {
    url: string,
    protoPath?: string,
  }

export interface GrpcClientPackageServices {
  package: string; // 模块名
  services: string[]; // 服务名数组
}

/**
 * 异步依赖注入的 options
 */
export interface GrpcClientModuleAsyncOptions {
  useFactory?: (...args: any[]) => GrpcOptionsOptions[]; // 生成options的构造函数
  inject?: any[]; // 注入
}
