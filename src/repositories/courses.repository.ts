import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Courses, CoursesRelations} from '../models';

export class CoursesRepository extends DefaultCrudRepository<
  Courses,
  typeof Courses.prototype.id,
  CoursesRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Courses, dataSource);
  }
}
