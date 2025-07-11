import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Stdenrolled, Student, StudentRelations} from '../models';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {
  public readonly stdenrolleds: HasManyRepositoryFactory<
    Stdenrolled,
    typeof Student.prototype.id
  >;

  constructor(@inject('datasources.mysqlDb') dataSource: MysqlDbDataSource) {
    super(Student, dataSource);
  }
}
