import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Courses, CoursesRelations, Category, Lessons, Instructor, Stdenrolled} from '../models';
import {CategoryRepository} from './category.repository';
import {LessonsRepository} from './lessons.repository';
import {InstructorRepository} from './instructor.repository';
import {StdenrolledRepository} from './stdenrolled.repository';

export class CoursesRepository extends DefaultCrudRepository<
  Courses,
  typeof Courses.prototype.id,
  CoursesRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Courses.prototype.id>;

  public readonly lessons: HasManyRepositoryFactory<Lessons, typeof Courses.prototype.id>;

  public readonly instructor: BelongsToAccessor<Instructor, typeof Courses.prototype.id>;

  public readonly stdenrolleds: HasManyRepositoryFactory<Stdenrolled, typeof Courses.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('LessonsRepository') protected lessonsRepositoryGetter: Getter<LessonsRepository>, @repository.getter('InstructorRepository') protected instructorRepositoryGetter: Getter<InstructorRepository>, @repository.getter('StdenrolledRepository') protected stdenrolledRepositoryGetter: Getter<StdenrolledRepository>,
  ) {
    super(Courses, dataSource);
    this.stdenrolleds = this.createHasManyRepositoryFactoryFor('stdenrolleds', stdenrolledRepositoryGetter,);
    this.registerInclusionResolver('stdenrolleds', this.stdenrolleds.inclusionResolver);
    this.instructor = this.createBelongsToAccessorFor('instructor', instructorRepositoryGetter,);
    this.registerInclusionResolver('instructor', this.instructor.inclusionResolver);
    this.lessons = this.createHasManyRepositoryFactoryFor('lessons', lessonsRepositoryGetter,);
    this.registerInclusionResolver('lessons', this.lessons.inclusionResolver);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
