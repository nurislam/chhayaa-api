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
import {Instructor} from '../models';
import {InstructorRepository} from '../repositories';

export class InstructorsController {
  constructor(
    @repository(InstructorRepository)
    public instructorRepository: InstructorRepository,
  ) { }

  @post('/instructors')
  @response(200, {
    description: 'Instructor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Instructor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instructor, {
            title: 'NewInstructor',
            exclude: ['id'],
          }),
        },
      },
    })
    instructor: Omit<Instructor, 'id'>,
  ): Promise<Instructor> {
    return this.instructorRepository.create(instructor);
  }

  @get('/instructors/count')
  @response(200, {
    description: 'Instructor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Instructor) where?: Where<Instructor>,
  ): Promise<Count> {
    return this.instructorRepository.count(where);
  }

  @get('/instructors')
  @response(200, {
    description: 'Array of Instructor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Instructor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Instructor) filter?: Filter<Instructor>,
  ): Promise<Instructor[]> {
    return this.instructorRepository.find(filter);
  }

  @patch('/instructors')
  @response(200, {
    description: 'Instructor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instructor, {partial: true}),
        },
      },
    })
    instructor: Instructor,
    @param.where(Instructor) where?: Where<Instructor>,
  ): Promise<Count> {
    return this.instructorRepository.updateAll(instructor, where);
  }

  @get('/instructors/details/{identifier}')
  @response(200, {
    description: 'Course model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Instructor, {includeRelations: true}),
      },
    },
  })
  async findByIdentifier(
    @param.path.string('identifier') identifier: string,
    @param.filter(Instructor, {exclude: 'where'})
    filter?: FilterExcludingWhere<Instructor>,
  ): Promise<Instructor> {
    const courseData = await this.instructorRepository.findOne({
      where: {identifier, deleted: false},
    });

    if (!courseData) {
      throw new HttpErrors.NotFound(
        `Page with identifier "${identifier}" not found.`,
      );
    }

    return courseData;
  }

  @get('/instructors/{id}')
  @response(200, {
    description: 'Instructor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Instructor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Instructor, {exclude: 'where'}) filter?: FilterExcludingWhere<Instructor>
  ): Promise<Instructor> {
    return this.instructorRepository.findById(id, filter);
  }

  @patch('/instructors/{id}')
  @response(204, {
    description: 'Instructor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instructor, {partial: true}),
        },
      },
    })
    instructor: Instructor,
  ): Promise<void> {
    await this.instructorRepository.updateById(id, instructor);
  }

  @put('/instructors/{id}')
  @response(204, {
    description: 'Instructor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() instructor: Instructor,
  ): Promise<void> {
    await this.instructorRepository.replaceById(id, instructor);
  }

  @del('/instructors/{id}')
  @response(204, {
    description: 'Instructor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.instructorRepository.deleteById(id);
  }
}
