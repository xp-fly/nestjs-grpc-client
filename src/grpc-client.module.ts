import {DynamicModule, Module} from '@nestjs/common';
import {GrpcOptions} from '@nestjs/microservices';
import {GrpcClientProvider} from './grpc-client.provider';
import { GrpcClientModuleAsyncOptions, GrpcClientPackageServices } from './grpc-client.interface';
import {GrpcClientCoreModule} from './grpc-client-core.module';

@Module({})
export class GrpcClientModule {

  /**
   * 注册获取 grpc 的连接
   * @param options
   */
  static register(options: GrpcOptions[]): DynamicModule {
    return {
      module: GrpcClientModule,
      imports: [GrpcClientCoreModule.register(options)],
    };
  }

  /**
   * 注册获取 grpc 的连接
   * @param options
   * @param injectOption
   */
  static registerAsync(options: GrpcOptions[], injectOption: GrpcClientModuleAsyncOptions): DynamicModule {
    return {
      module: GrpcClientModule,
      imports: [GrpcClientCoreModule.registerAsync(options, injectOption)],
    };
  }

  /**
   * 获取grpc的服务
   * @param services
   */
  static forClientServices(services: GrpcClientPackageServices[]): DynamicModule {
    const providers = GrpcClientProvider.getServices(services);
    return {
      module: GrpcClientModule,
      providers,
      exports: providers,
    };
  }
}
