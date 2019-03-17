## Description

NestJs 的 grpc 客户端模块。nestjs自带的@Client() 需要传入rpc服务的地址，不能通过配置去注入这个地址。所以有了这个项目，可以注入远程服务的地址来生成 grpc 客户端

## Basic useage

hello.proto

```proto

syntax = "proto3";

package hello;

service OrderService {
    rpc say (string) returns (string) {}
}


```

### connections

- GrpcClientModule.register(options: GrpcOptions):DynamicModule   
  初始化grpc客户端。返回客户端提供者
- GrpcClientModule.registerAsync(options: GrpcOptions, injectOption: GrpcClientModuleAsyncOptions) DynamicModule    
  异步依赖初始化grpc客户端的连接。injectOption 为依赖的提供者

```typescript
import {Module} from '@nestjs/common';
import {GrpcClientModule} from "nestjs-grpc-client";
import {Transport} from "@nestjs/common/enums/transport.enum";
import {join} from "path";

@Module({
  imports: [
    GrpcClientModule.register([
      {
        transport: Transport.GRPC,
          options: {
            url: '0.0.0.0:8888',
            package: 'hello',
            protoPath: join(__dirname, 'hello.proto'),
            loader: {
              arrays: true
            }
          }
      }
    ]),
    TestModule
  ],
})
export class AppModule {
}
```

```typescript

import {Module} from '@nestjs/common';
import {GrpcClientModule} from "nestjs-grpc-client";
import {Transport} from "@nestjs/common/enums/transport.enum";
import {join} from "path";
import {ConfigModule, ConfigService} from 'nestjs-configure';

@Module({
  imports: [
    ConfigModule.load(),
    GrpcClientModule.registerAsync([
      {
        transport: Transport.GRPC,
          options: {
            package: 'hello',
            protoPath: join(__dirname, 'hello.proto'),
            loader: {
              arrays: true
            }
          }
      }
    ], {
      useFactory: (configService) => configService.get('grpcOptions'),
      inject: [ConfigService],
    }),
    TestModule
  ],
})
export class AppModule {
}

// bootstrap.yml

grpcOptions:
  -
    package: hello
    url: 127.0.0.1:8888

```

### decorators

- InjectGrpcClient(packageName: strint)  
  return ClientGrpcProxy。注入 grpc 客户端连接。全局，可以在任何地方使用，接受proto文件中定义的 package
- InjectGrpcClientService(packageName: string, serviceName: string)
  返回proto中定一个的service。注入 grpc 中的service

```typescript

import {Injectable} from "@nestjs/common";
import {InjectGrpcClient} from "nestjs-grpc-client";
import {ClientGrpcProxy} from "@nestjs/microservices";

@Injectable()
export class TestService {

  constructor(
    @InjectGrpcClient('hello') private grpcClient: ClientGrpcProxy,
  ) {
  }

  async hello() {
    const helloService: any = this.grpcClient.getService('HelloService');
    return await helloService.say('hello');
  }
}


```

```typescript

import {Injectable} from "@nestjs/common";
import {InjectGrpcClientService} from "nestjs-grpc-client";
import {ClientGrpcProxy} from "@nestjs/microservices";

@Injectable()
export class UserService {

  constructor(
    @InjectGrpcClientService('hello', 'HelloService') private helloService,
  ) {
  }

  async hello() {
    return await this.helloService.say('hello');
  }
}


```
