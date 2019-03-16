/**
 * 不存在 package 对应的 url 配置
 */
export class GrpcClientPackageConfigNotFound extends Error {
  constructor(packageName: string) {
    super();
    this.message = `cant find package url in inject config. package: ${packageName}`;
    this.name = 'GrpcClientPackageConfigNotFound';
  }
}
