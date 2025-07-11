import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Stdenrolled} from '../models';
import {StdenrolledRepository} from '../repositories';

export class StdenrolledController {
  constructor(
    @repository(StdenrolledRepository)
    public stdenrolledRepository : StdenrolledRepository,
  ) {}

  @post('/stdenrolleds')
  @response(200, {
    description: 'Stdenrolled model instance',
    content: {'application/json': {schema: getModelSchemaRef(Stdenrolled)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stdenrolled, {
            title: 'NewStdenrolled',
            exclude: ['id'],
          }),
        },
      },
    })
    stdenrolled: Omit<Stdenrolled, 'id'>,
  ): Promise<Stdenrolled> {
    return this.stdenrolledRepository.create(stdenrolled);
  }

  @get('/stdenrolleds/count')
  @response(200, {
    description: 'Stdenrolled model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Stdenrolled) where?: Where<Stdenrolled>,
  ): Promise<Count> {
    return this.stdenrolledRepository.count(where);
  }

  @get('/stdenrolleds')
  @response(200, {
    description: 'Array of Stdenrolled model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Stdenrolled, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Stdenrolled) filter?: Filter<Stdenrolled>,
  ): Promise<Stdenrolled[]> {
    return this.stdenrolledRepository.find(filter);
  }

  @patch('/stdenrolleds')
  @response(200, {
    description: 'Stdenrolled PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stdenrolled, {partial: true}),
        },
      },
    })
    stdenrolled: Stdenrolled,
    @param.where(Stdenrolled) where?: Where<Stdenrolled>,
  ): Promise<Count> {
    return this.stdenrolledRepository.updateAll(stdenrolled, where);
  }

  @get('/stdenrolleds/{id}')
  @response(200, {
    description: 'Stdenrolled model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Stdenrolled, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Stdenrolled, {exclude: 'where'}) filter?: FilterExcludingWhere<Stdenrolled>
  ): Promise<Stdenrolled> {
    return this.stdenrolledRepository.findById(id, filter);
  }

  @patch('/stdenrolleds/{id}')
  @response(204, {
    description: 'Stdenrolled PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stdenrolled, {partial: true}),
        },
      },
    })
    stdenrolled: Stdenrolled,
  ): Promise<void> {
    await this.stdenrolledRepository.updateById(id, stdenrolled);
  }

  @put('/stdenrolleds/{id}')
  @response(204, {
    description: 'Stdenrolled PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() stdenrolled: Stdenrolled,
  ): Promise<void> {
    await this.stdenrolledRepository.replaceById(id, stdenrolled);
  }

  @del('/stdenrolleds/{id}')
  @response(204, {
    description: 'Stdenrolled DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.stdenrolledRepository.deleteById(id);
  }
}
