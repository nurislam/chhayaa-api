import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {log} from 'console';
import {Permission} from '../models';
import {PermissionRepository} from '../repositories';
import {PermissionResponse} from '../types/permission';

export class PermissionController {
  constructor(
    @repository(PermissionRepository)
    public permissionRepository: PermissionRepository,
  ) {}

  @authenticate('jwt-token')
  @post('/permissions')
  @response(200, {
    description: 'Permission model instance',
    content: {'application/json': {schema: getModelSchemaRef(Permission)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permission, {
            title: 'NewPermission',
            exclude: ['id'],
          }),
        },
      },
    })
    permission: Omit<Permission, 'id'>,
  ): Promise<Permission> {
    log(permission);
    return this.permissionRepository.create(permission);
  }

  @get('/permissions/count')
  @response(200, {
    description: 'Permission model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Permission) where?: Where<Permission>,
  ): Promise<Count> {
    return this.permissionRepository.count(where);
  }

  @get('/permissions')
  @response(200, {
    description: 'Array of Permission model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Permission, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Permission) filter?: Filter<Permission>,
  ): Promise<Permission[]> {
    return this.permissionRepository.find(filter);
  }

  @patch('/permissions')
  @response(200, {
    description: 'Permission PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permission, {partial: true}),
        },
      },
    })
    permission: Permission,
    @param.where(Permission) where?: Where<Permission>,
  ): Promise<Count> {
    return this.permissionRepository.updateAll(permission, where);
  }

  @authenticate('jwt-token')
  @get('/permissions/modules')
  @response(200, {
    description: 'Array of Permission model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Permission, {includeRelations: true}),
        },
      },
    },
  })
  async findPermissionsByModuleIdsAndGroupId(
    @param({
      name: 'moduleIds',
      in: 'query',
      required: true,
      schema: {
        type: 'array',
        items: {type: 'number'},
      },
    })
    moduleIds: number[],
    @param.query.number('groupId', {required: true}) groupId: number,
    @param.filter(Permission, {exclude: 'where'})
    filter?: FilterExcludingWhere<Permission>,
  ): Promise<PermissionResponse[]> {
    const permissions = await this.permissionRepository.find({
      where: {
        and: [
          {moduleId: {inq: moduleIds}},
          {groupId: groupId},
          {
            and: [{actions: {neq: null}}, {actions: {neq: ''}}],
          },
        ],
      },
      ...filter,
    });

    return permissions.map(({id, actions, groupId, moduleId}) => ({
      id: id as number,
      actions: actions ? actions.split(',') : [],
      groupId,
      moduleId,
    }));
  }

  @authenticate('jwt-token')
  @get('/permissions/checkpermission/{moduleId}/{groupId}')
  @response(200, {
    description: 'Array of Permission model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Permission, {includeRelations: true}),
        },
      },
    },
  })
  async checkingModuleGroup(
    @param.path.string('moduleId') moduleId: number,
    @param.path.string('groupId') groupId: number,
    @param.filter(Permission, {exclude: 'where'})
    filter?: FilterExcludingWhere<Permission>,
  ): Promise<any | any[]> {
    try {
      let clientFilter: Filter<Permission> = filter || {};
      const where: Where<Permission> = {moduleId, groupId};

      clientFilter.where = where;

      return this.permissionRepository.findOne(clientFilter);
    } catch (error) {
      console.error('Error fetching  Permission:', error);
      throw new HttpErrors.InternalServerError('Unable to fetch Permission');
    }
  }

  @authenticate('jwt-token')
  @get('/permissions/{id}')
  @response(200, {
    description: 'permission model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Permission, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: number,
    @param.filter(Permission, {exclude: 'where'})
    filter?: FilterExcludingWhere<Permission>,
  ): Promise<Permission> {
    return this.permissionRepository.findById(id, filter);
  }

  @patch('/permissions/{id}')
  @response(204, {
    description: 'Permission PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permission, {partial: true}),
        },
      },
    })
    permission: Permission,
  ): Promise<void> {
    await this.permissionRepository.updateById(id, permission);
  }

  @put('/permissions/{id}')
  @response(204, {
    description: 'Permission PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() permission: Permission,
  ): Promise<void> {
    await this.permissionRepository.replaceById(id, permission);
  }

  @del('/permissions/{id}')
  @response(204, {
    description: 'Permission DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.permissionRepository.deleteById(id);
  }
}
