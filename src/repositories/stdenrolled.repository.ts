import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Stdenrolled, StdenrolledRelations} from '../models';

export class StdenrolledRepository extends DefaultCrudRepository<
  Stdenrolled,
  typeof Stdenrolled.prototype.id,
  StdenrolledRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Stdenrolled, dataSource);
  }
}
