import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {GrpcClientProvider} from './grpc-client.provider';
import {GrpcOptions} from '@nestjs/microservices';
import { GrpcClientModuleAsyncOptions } from './grpc-client.interface';
import { GRPC_CLIENT_MODULE_OPTIONS } from './constant';

// 注册为全局模块，可以在任何地方注册连接

@Global()
@Module({})
export class GrpcClientCoreModule {
  /**
   * 注册连接
   * @param options
   */
  static register(options: GrpcOptions[]): DynamicModule {
    const providers = GrpcClientProvider.register(options);
    return {
      module: GrpcClientCoreModule,
      providers,
      exports: providers,
    };
  }

  /**
   * 异步依赖注册
   * @param options
   * @param injectOption
   */
  static registerAsync(options: GrpcOptions[], injectOption: GrpcClientModuleAsyncOptions) {
    const optionProvider = this.createAsyncOptionsProvider(injectOption);
    const providers = GrpcClientProvider.register(options, true);
    return {
      module: GrpcClientCoreModule,
      providers: [
        optionProvider,
        ...providers,
      ],
      exports: providers,
    };
  }

  private static createAsyncOptionsProvider(options: GrpcClientModuleAsyncOptions): Provider {
    return {
      provide: GRPC_CLIENT_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
