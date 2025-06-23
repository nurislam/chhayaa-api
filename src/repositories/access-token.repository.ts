import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {AccessToken, AccessTokenRelations} from '../models';

export class AccessTokenRepository extends DefaultCrudRepository<
  AccessToken,
  typeof AccessToken.prototype.id,
  AccessTokenRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(AccessToken, dataSource);
  }

  async updateLogout(token: string, id: string) {
    await this.updateAll({isLoggedIn: false}, {id: token, userId: id});
    return true;
  }

  getTokenFromHeader(authorizationHeader: string) {
    return authorizationHeader.replace('Bearer ', '').trim();
  }
}
