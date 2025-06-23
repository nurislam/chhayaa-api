import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Pages, PagesRelations} from '../models';

export class PagesRepository extends DefaultCrudRepository<
  Pages,
  typeof Pages.prototype.id,
  PagesRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Pages, dataSource);
  }
}
