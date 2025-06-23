import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Modules, ModulesRelations, Permission} from '../models';
import {PermissionRepository} from './permission.repository';

export class ModulesRepository extends DefaultCrudRepository<
  Modules,
  typeof Modules.prototype.id,
  ModulesRelations
> {
  public readonly permissions: HasManyRepositoryFactory<
    Permission,
    typeof Modules.prototype.id
  >;

  public readonly parent: BelongsToAccessor<
    Modules,
    typeof Modules.prototype.id
  >;

  public readonly children: HasManyRepositoryFactory<
    Modules,
    typeof Modules.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('PermissionRepository')
    protected permissionRepositoryGetter: Getter<PermissionRepository>,
    @repository.getter('ModulesRepository')
    protected modulesRepositoryGetter: Getter<ModulesRepository>,
  ) {
    super(Modules, dataSource);
    this.children = this.createHasManyRepositoryFactoryFor(
      'children',
      modulesRepositoryGetter,
    );
    this.registerInclusionResolver('children', this.children.inclusionResolver);
    this.parent = this.createBelongsToAccessorFor(
      'parent',
      modulesRepositoryGetter,
    );
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);
    this.permissions = this.createHasManyRepositoryFactoryFor(
      'permissions',
      permissionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'permissions',
      this.permissions.inclusionResolver,
    );
  }
}
