import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Instructor, InstructorRelations} from '../models';

export class InstructorRepository extends DefaultCrudRepository<
  Instructor,
  typeof Instructor.prototype.id,
  InstructorRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Instructor, dataSource);
  }
}
