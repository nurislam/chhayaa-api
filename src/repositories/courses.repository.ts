import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Courses, CoursesRelations, Category} from '../models';
import {CategoryRepository} from './category.repository';

export class CoursesRepository extends DefaultCrudRepository<
  Courses,
  typeof Courses.prototype.id,
  CoursesRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Courses.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Courses, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
