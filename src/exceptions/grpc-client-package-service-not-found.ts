/**
 * cant`t find service in package
 */
export class GrpcClientPackageServiceNotFound extends Error {
  constructor(packageName: string, serviceName: string) {
    super();
    this.message = `this service: ${serviceName} not exists in package: ${packageName}`;
    this.name = 'GrpcClientPackageServiceNotFound';
  }
}
