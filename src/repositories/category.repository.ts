import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Category, CategoryRelations} from '../models/category.model';


export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Category, dataSource);
  }
}
