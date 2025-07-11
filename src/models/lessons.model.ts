import {Entity, model, property} from '@loopback/repository';

@model({name: 'lessons'})
export class Lessons extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  details?: string;

  @property({
    type: 'string',
    required: true,
  })
  identifier: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt?: string;

  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'boolean',
    default: '0',
  })
  deleted: boolean;

  @property({
    type: 'number',
  })
  courseId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Lessons>) {
    super(data);
  }
}

export interface LessonsRelations {
  // describe navigational properties here
}

export type LessonsWithRelations = Lessons & LessonsRelations;
