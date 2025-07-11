import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Student, StudentRelations, Stdenrolled} from '../models';
import {StdenrolledRepository} from './stdenrolled.repository';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {

  public readonly stdenrolleds: HasManyRepositoryFactory<Stdenrolled, typeof Student.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('StdenrolledRepository') protected stdenrolledRepositoryGetter: Getter<StdenrolledRepository>,
  ) {
    super(Student, dataSource);
    this.stdenrolleds = this.createHasManyRepositoryFactoryFor('stdenrolleds', stdenrolledRepositoryGetter,);
    this.registerInclusionResolver('stdenrolleds', this.stdenrolleds.inclusionResolver);
  }
}
