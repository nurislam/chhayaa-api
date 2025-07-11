import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Lessons, LessonsRelations} from '../models';

export class LessonsRepository extends DefaultCrudRepository<
  Lessons,
  typeof Lessons.prototype.id,
  LessonsRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Lessons, dataSource);
  }
}
