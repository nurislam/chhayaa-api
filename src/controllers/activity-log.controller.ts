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
import {ActivityLog} from '../models';
import {ActivityLogRepository} from '../repositories';

export class ActivityLogController {
  constructor(
    @repository(ActivityLogRepository)
    public activityLogRepository : ActivityLogRepository,
  ) {}

  @post('/activity-logs')
  @response(200, {
    description: 'ActivityLog model instance',
    content: {'application/json': {schema: getModelSchemaRef(ActivityLog)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivityLog, {
            title: 'NewActivityLog',
            exclude: ['id'],
          }),
        },
      },
    })
    activityLog: Omit<ActivityLog, 'id'>,
  ): Promise<ActivityLog> {
    return this.activityLogRepository.create(activityLog);
  }

  @get('/activity-logs/count')
  @response(200, {
    description: 'ActivityLog model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ActivityLog) where?: Where<ActivityLog>,
  ): Promise<Count> {
    return this.activityLogRepository.count(where);
  }

  @get('/activity-logs')
  @response(200, {
    description: 'Array of ActivityLog model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ActivityLog, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ActivityLog) filter?: Filter<ActivityLog>,
  ): Promise<ActivityLog[]> {
    return this.activityLogRepository.find(filter);
  }

  @patch('/activity-logs')
  @response(200, {
    description: 'ActivityLog PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivityLog, {partial: true}),
        },
      },
    })
    activityLog: ActivityLog,
    @param.where(ActivityLog) where?: Where<ActivityLog>,
  ): Promise<Count> {
    return this.activityLogRepository.updateAll(activityLog, where);
  }

  @get('/activity-logs/{id}')
  @response(200, {
    description: 'ActivityLog model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ActivityLog, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ActivityLog, {exclude: 'where'}) filter?: FilterExcludingWhere<ActivityLog>
  ): Promise<ActivityLog> {
    return this.activityLogRepository.findById(id, filter);
  }

  @patch('/activity-logs/{id}')
  @response(204, {
    description: 'ActivityLog PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivityLog, {partial: true}),
        },
      },
    })
    activityLog: ActivityLog,
  ): Promise<void> {
    await this.activityLogRepository.updateById(id, activityLog);
  }

  @put('/activity-logs/{id}')
  @response(204, {
    description: 'ActivityLog PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() activityLog: ActivityLog,
  ): Promise<void> {
    await this.activityLogRepository.replaceById(id, activityLog);
  }

  @del('/activity-logs/{id}')
  @response(204, {
    description: 'ActivityLog DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.activityLogRepository.deleteById(id);
  }
}
