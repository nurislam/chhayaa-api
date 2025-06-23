import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {ActivityLog, ActivityLogRelations} from '../models';

export class ActivityLogRepository extends DefaultCrudRepository<
  ActivityLog,
  typeof ActivityLog.prototype.id,
  ActivityLogRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(ActivityLog, dataSource);
  }
}
