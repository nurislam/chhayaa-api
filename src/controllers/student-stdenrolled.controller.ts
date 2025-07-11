import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Student,
  Stdenrolled,
} from '../models';
import {StudentRepository} from '../repositories';

export class StudentStdenrolledController {
  constructor(
    @repository(StudentRepository) protected studentRepository: StudentRepository,
  ) { }

  @get('/students/{id}/stdenrolleds', {
    responses: {
      '200': {
        description: 'Array of Student has many Stdenrolled',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Stdenrolled)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Stdenrolled>,
  ): Promise<Stdenrolled[]> {
    return this.studentRepository.stdenrolleds(id).find(filter);
  }

  @post('/students/{id}/stdenrolleds', {
    responses: {
      '200': {
        description: 'Student model instance',
        content: {'application/json': {schema: getModelSchemaRef(Stdenrolled)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Student.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stdenrolled, {
            title: 'NewStdenrolledInStudent',
            exclude: ['id'],
            optional: ['studentId']
          }),
        },
      },
    }) stdenrolled: Omit<Stdenrolled, 'id'>,
  ): Promise<Stdenrolled> {
    return this.studentRepository.stdenrolleds(id).create(stdenrolled);
  }

  @patch('/students/{id}/stdenrolleds', {
    responses: {
      '200': {
        description: 'Student.Stdenrolled PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Stdenrolled, {partial: true}),
        },
      },
    })
    stdenrolled: Partial<Stdenrolled>,
    @param.query.object('where', getWhereSchemaFor(Stdenrolled)) where?: Where<Stdenrolled>,
  ): Promise<Count> {
    return this.studentRepository.stdenrolleds(id).patch(stdenrolled, where);
  }

  @del('/students/{id}/stdenrolleds', {
    responses: {
      '200': {
        description: 'Student.Stdenrolled DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Stdenrolled)) where?: Where<Stdenrolled>,
  ): Promise<Count> {
    return this.studentRepository.stdenrolleds(id).delete(where);
  }
}
