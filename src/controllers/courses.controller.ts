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
import {Courses} from '../models';
import {CoursesRepository} from '../repositories';

export class CoursesController {
  constructor(
    @repository(CoursesRepository)
    public coursesRepository: CoursesRepository,
  ) {}

  @post('/courses')
  @response(200, {
    description: 'Courses model instance',
    content: {'application/json': {schema: getModelSchemaRef(Courses)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Courses, {
            title: 'NewCourses',
            exclude: ['id'],
          }),
        },
      },
    })
    courses: Omit<Courses, 'id'>,
  ): Promise<Courses> {
    return this.coursesRepository.create(courses);
  }

  @get('/courses/count')
  @response(200, {
    description: 'Courses model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Courses) where?: Where<Courses>): Promise<Count> {
    return this.coursesRepository.count(where);
  }

  @get('/courses')
  @response(200, {
    description: 'Array of Courses model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Courses, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Courses) filter?: Filter<Courses>,
  ): Promise<Courses[]> {
    return this.coursesRepository.find(filter);
  }

  @patch('/courses')
  @response(200, {
    description: 'Courses PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Courses, {partial: true}),
        },
      },
    })
    courses: Courses,
    @param.where(Courses) where?: Where<Courses>,
  ): Promise<Count> {
    return this.coursesRepository.updateAll(courses, where);
  }

  @get('/courses/{id}')
  @response(200, {
    description: 'Courses model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Courses, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Courses, {exclude: 'where'})
    filter?: FilterExcludingWhere<Courses>,
  ): Promise<Courses> {
    return this.coursesRepository.findById(id, filter);
  }

  @patch('/courses/{id}')
  @response(204, {
    description: 'Courses PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Courses, {partial: true}),
        },
      },
    })
    courses: Courses,
  ): Promise<void> {
    await this.coursesRepository.updateById(id, courses);
  }

  @put('/courses/{id}')
  @response(204, {
    description: 'Courses PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() courses: Courses,
  ): Promise<void> {
    await this.coursesRepository.replaceById(id, courses);
  }

  @del('/courses/{id}')
  @response(204, {
    description: 'Courses DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.coursesRepository.deleteById(id);
  }
}
