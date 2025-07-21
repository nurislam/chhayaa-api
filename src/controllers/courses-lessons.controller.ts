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
  Courses,
  Lessons,
} from '../models';
import {CoursesRepository} from '../repositories';

export class CoursesLessonsController {
  constructor(
    @repository(CoursesRepository) protected coursesRepository: CoursesRepository,
  ) { }

  @get('/courses/{id}/lessons', {
    responses: {
      '200': {
        description: 'Array of Courses has many Lessons',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Lessons)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Lessons>,
  ): Promise<Lessons[]> {
    return this.coursesRepository.lessons(id).find(filter);
  }

  @post('/courses/{id}/lessons', {
    responses: {
      '200': {
        description: 'Courses model instance',
        content: {'application/json': {schema: getModelSchemaRef(Lessons)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Courses.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lessons, {
            title: 'NewLessonsInCourses',
            exclude: ['id'],
            optional: ['courseId']
          }),
        },
      },
    }) lessons: Omit<Lessons, 'id'>,
  ): Promise<Lessons> {
    return this.coursesRepository.lessons(id).create(lessons);
  }

  @patch('/courses/{id}/lessons', {
    responses: {
      '200': {
        description: 'Courses.Lessons PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lessons, {partial: true}),
        },
      },
    })
    lessons: Partial<Lessons>,
    @param.query.object('where', getWhereSchemaFor(Lessons)) where?: Where<Lessons>,
  ): Promise<Count> {
    return this.coursesRepository.lessons(id).patch(lessons, where);
  }

  @del('/courses/{id}/lessons', {
    responses: {
      '200': {
        description: 'Courses.Lessons DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Lessons)) where?: Where<Lessons>,
  ): Promise<Count> {
    return this.coursesRepository.lessons(id).delete(where);
  }
}
