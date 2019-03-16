/**
 * 不存在 package 对应的client
 */
export class GrpcClientPackageNotFound extends Error {
  constructor(packageName: string) {
    super();
    this.message = `the package\`s client not exist, please register first. package: ${packageName}`;
    this.name = 'GrpcClientPackageConfigNotFound';
  }
}
