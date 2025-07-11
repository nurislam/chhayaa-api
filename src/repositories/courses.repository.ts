import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Category, Courses, CoursesRelations, Instructor, Lessons} from '../models';
import {CategoryRepository} from './category.repository';
import {InstructorRepository} from './instructor.repository';
import {StdenrolledRepository} from './stdenrolled.repository';
import {LessonsRepository} from './lessons.repository';

export class CoursesRepository extends DefaultCrudRepository<
  Courses,
  typeof Courses.prototype.id,
  CoursesRelations
> {
  public readonly category: BelongsToAccessor<
    Category,
    typeof Courses.prototype.id
  >;

  public readonly instructor: BelongsToAccessor<
    Instructor,
    typeof Courses.prototype.id
  >;

  public readonly lessons: HasManyRepositoryFactory<Lessons, typeof Courses.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
    @repository.getter('InstructorRepository')
    protected instructorRepositoryGetter: Getter<InstructorRepository>,
    @repository.getter('StdenrolledRepository')
    protected stdenrolledRepositoryGetter: Getter<StdenrolledRepository>, @repository.getter('LessonsRepository') protected lessonsRepositoryGetter: Getter<LessonsRepository>,
  ) {
    super(Courses, dataSource);
    this.lessons = this.createHasManyRepositoryFactoryFor('lessons', lessonsRepositoryGetter,);
    this.registerInclusionResolver('lessons', this.lessons.inclusionResolver);
    this.instructor = this.createBelongsToAccessorFor(
      'instructor',
      instructorRepositoryGetter,
    );
    this.registerInclusionResolver(
      'instructor',
      this.instructor.inclusionResolver,
    );
    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
