import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Option, OptionRelations} from '../models';

export class OptionRepository extends DefaultCrudRepository<
  Option,
  typeof Option.prototype.id,
  OptionRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Option, dataSource);
  }
}
