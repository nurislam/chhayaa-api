import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export type ForgetPasswordData = {
  email: string;
};
export type Credentials = {
  username: string;
  password: string;
};
export type UpdateCredentials = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.email,
  UserRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(User, dataSource);

    (this.modelClass as any).observe('persist', async (ctx: any) => {
      ctx.data.modified = new Date();
    });
  }
}
