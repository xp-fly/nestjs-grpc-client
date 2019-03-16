import {GrpcOptions} from "@nestjs/common/interfaces/microservices/microservice-configuration.interface";
import {Transport} from "@nestjs/common/enums/transport.enum";
import {join} from "path";

const TOKEN_PREFIX = 'GRPC_CLIENT_TOKEN_'

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
