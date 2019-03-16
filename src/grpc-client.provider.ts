import {ClientGrpcProxy, ClientProxyFactory, GrpcOptions} from '@nestjs/microservices';
import {Provider} from '@nestjs/common';
import {getServiceToken, getToken} from './utils';
import {GrpcClientPackageServices, GrpcOptionsOptions} from './grpc-client.interface';
import {
  GrpcClientPackageNotFound,
  GrpcClientPackageServiceNotFound,
} from './exceptions';
import { GRPC_CLIENT_MODULE_OPTIONS } from './constant';
import { GrpcClientPackageConfigNotFound } from './exceptions/grpc-client-package-config-not-found';

const clients: Map<string, ClientGrpcProxy> = new Map();

/**
 * grpc 客户端提供者
 */
export class GrpcClientProvider {

  /**
   * 获取连接
   * @param options grpc连接配置
   * @param isAsyncInject 是否是异步依赖注入配置
   */
  static register(options: GrpcOptions[], isAsyncInject?: boolean): Provider[] {
    const providers: Provider[] = [];
    for (const option of options) {
      // grcp 的模块名
      const packageName = option.options.package;
      const providerToken = getToken(packageName);
      // 如果已经创建，则直接返回已经创建的
      if (clients.get(packageName)) {
        providers.push({
          provide: providerToken,
          useValue: clients.get(packageName),
        });
      } else if (isAsyncInject) {
        providers.push({
          provide: providerToken,
          useFactory: (configs: GrpcOptionsOptions[]) => {
            const config = configs.find(item => item.package === packageName);
            if (!config) {
              throw new GrpcClientPackageConfigNotFound(packageName);
            }
            option.options = {...option.options, ...config};
            // 创建连接
            const client: any = ClientProxyFactory.create(option);
            clients.set(packageName, client);
            return client;
          },
          inject: [GRPC_CLIENT_MODULE_OPTIONS],
        });
      } else {
        const client: any = ClientProxyFactory.create(option);
        clients.set(packageName, client);
        providers.push({
          provide: providerToken,
          useValue: client,
        });
      }
    }
    return providers;
  }

  /**
   * 获取服务
   * @param services
   */
  static getServices(services: GrpcClientPackageServices[]): Provider[] {

    const providers: Provider[] = [];
    for (const service of services) {
      for (const serviceName of service.services) {
        providers.push({
          provide: getServiceToken(service.package, serviceName),
          useFactory: (client: ClientGrpcProxy) => {
            if (!client) {
              throw new GrpcClientPackageNotFound(service.package);
            }
            const grpcService = client.getService(serviceName);
            if (!grpcService) {
              throw new GrpcClientPackageServiceNotFound(service.package, serviceName);
            }
            return grpcService;
          },
          inject: [getToken(service.package)],
        });
      }
    }
    return providers;
  }
}
