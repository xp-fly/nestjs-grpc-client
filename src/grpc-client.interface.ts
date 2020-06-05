/**
 * grpc 的服务配置
 */
import { GrpcOptions } from '@nestjs/microservices';

export interface GrpcOptionsOptions extends Pick<GrpcOptions, 'options'> {
  url: string;
  maxSendMessageLength?: number;
  maxReceiveMessageLength?: number;
  credentials?: any;
  protoPath?: string;
  package: string;
  protoLoader?: string;
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
