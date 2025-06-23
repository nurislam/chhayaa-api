import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Category} from '../models/category.model';
import {Company} from '../models/company.model';
import {Product} from '../models/product.model';
import {CategoryRepository} from './category.repository';
import {CompanyRepository} from './company.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id
> {
  public readonly category: BelongsToAccessor<Category, typeof Product.prototype.id>;
  public readonly company: BelongsToAccessor<Company, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('CategoryRepository') protected getCategoryRepository: Getter<CategoryRepository>,
    @repository.getter('CompanyRepository') protected getCompanyRepository: Getter<CompanyRepository>,
  ) {
    super(Product, dataSource);

    this.category = this.createBelongsToAccessorFor('category', getCategoryRepository);
    this.registerInclusionResolver('category', this.category.inclusionResolver);

    this.company = this.createBelongsToAccessorFor('company', getCompanyRepository);
    this.registerInclusionResolver('company', this.company.inclusionResolver);
  }
}
