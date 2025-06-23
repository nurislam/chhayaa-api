import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Group, Modules, Permission, PermissionRelations} from '../models';
import {GroupRepository} from './group.repository';
import {ModulesRepository} from './modules.repository';

export class PermissionRepository extends DefaultCrudRepository<
  Permission,
  typeof Permission.prototype.id,
  PermissionRelations
> {
  public readonly group: BelongsToAccessor<
    Group,
    typeof Permission.prototype.id
  >;

  public readonly modules: BelongsToAccessor<
    Modules,
    typeof Permission.prototype.id
  >;

  public readonly module: BelongsToAccessor<
    Modules,
    typeof Permission.prototype.id
  >;

  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('GroupRepository')
    protected groupRepositoryGetter: Getter<GroupRepository>,
    @repository.getter('ModulesRepository')
    protected modulesRepositoryGetter: Getter<ModulesRepository>,
  ) {
    super(Permission, dataSource);
    this.module = this.createBelongsToAccessorFor(
      'module',
      modulesRepositoryGetter,
    );
    this.registerInclusionResolver('module', this.module.inclusionResolver);

    this.group = this.createBelongsToAccessorFor(
      'group',
      groupRepositoryGetter,
    );
    this.registerInclusionResolver('group', this.group.inclusionResolver);
  }
}
