import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {
  Instructor,
  InstructorsWithRelations,
} from '../models/instructors.model';

export class InstructorRepository extends DefaultCrudRepository<
  Instructor,
  typeof Instructor.prototype.id,
  InstructorsWithRelations
> {
  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(Instructor, dataSource);
  }
}
