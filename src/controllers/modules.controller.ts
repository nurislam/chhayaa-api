import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Modules} from '../models';
import {ModulesRepository} from '../repositories';

export class ModulesController {
  constructor(
    @repository(ModulesRepository)
    public modulesRepository: ModulesRepository,
  ) {}

  @authenticate({strategy: 'jwt-token', options: {roles: ['admin']}})
  @post('/modules')
  @response(200, {
    description: 'Modules model instance',
    content: {'application/json': {schema: getModelSchemaRef(Modules)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Modules, {
            title: 'NewModules',
            exclude: ['id'],
          }),
        },
      },
    })
    modules: Omit<Modules, 'id'>,
  ): Promise<Modules> {
    modules.createdBy = currentUserProfile.id;
    return this.modulesRepository.create(modules);
  }

  @get('/modules/count')
  @response(200, {
    description: 'Modules model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Modules) where?: Where<Modules>): Promise<Count> {
    return this.modulesRepository.count(where);
  }

  @get('/modules')
  @response(200, {
    description: 'Array of Modules model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Modules, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Modules) filter?: Filter<Modules>,
  ): Promise<Modules[]> {
    return this.modulesRepository.find(filter);
  }

  @patch('/modules')
  @response(200, {
    description: 'Modules PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Modules, {partial: true}),
        },
      },
    })
    modules: Modules,
    @param.where(Modules) where?: Where<Modules>,
  ): Promise<Count> {
    return this.modulesRepository.updateAll(modules, where);
  }

  @get('/modules/{id}')
  @response(200, {
    description: 'Modules model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Modules, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Modules, {exclude: 'where'})
    filter?: FilterExcludingWhere<Modules>,
  ): Promise<Modules> {
    return this.modulesRepository.findById(id, filter);
  }

  @patch('/modules/{id}')
  @response(204, {
    description: 'Modules PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Modules, {partial: true}),
        },
      },
    })
    modules: Modules,
  ): Promise<void> {
    await this.modulesRepository.updateById(id, modules);
  }

  @put('/modules/{id}')
  @response(204, {
    description: 'Modules PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() modules: Modules,
  ): Promise<void> {
    await this.modulesRepository.replaceById(id, modules);
  }

  @del('/modules/{id}')
  @response(204, {
    description: 'Modules DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.modulesRepository.deleteById(id);
  }
}
