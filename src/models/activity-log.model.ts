import {Entity, belongsTo, model, property} from '@loopback/repository';
import {User} from './user.model';

@model({name: 'activity_logs'})
export class ActivityLog extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: false,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
  })
  campaignId?: string;

  @property({
    type: 'string', // Values ['delete_screenshot', 'update_suppression_status', 'update_suppression_num_of_page']
  })
  action: string;

  @property({
    type: 'string',
  })
  rowData?: string;

  @property({
    type: 'string',
  })
  metaData?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt?: Date;

  @belongsTo(() => User, undefined, {required: false})
  userId?: string;

  constructor(data?: Partial<ActivityLog>) {
    super(data);
  }
}

export interface ActivityLogRelations {
  // describe navigational properties here
}

export type ActivityLogWithRelations = ActivityLog & ActivityLogRelations;
