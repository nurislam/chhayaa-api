import {Entity, model, property} from '@loopback/repository';

@model({name: 'instructors'})
export class Instructor extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  identifier: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  designation?: string;

  @property({
    type: 'string',
  })
  content?: string;

  @property({
    type: 'number',
    jsonSchema: {
      minimum: 0,
      maximum: 5,
    },
  })
  rating?: number;

  @property({
    type: 'number',
    default: 0,
  })
  totalCourse?: number;

  @property({
    type: 'boolean',
    default: false,
  })
  featured?: boolean;

  @property({
    type: 'string',
  })
  imageUrl?: string;

  @property({
    type: 'string',
    default: 'active',
  })
  status?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt?: string;

  @property({
    type: 'date',
  })
  updatedAt?: string;

  @property({
    type: 'string',
  })
  createdBy?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted?: boolean;

  constructor(data?: Partial<Instructor>) {
    super(data);
  }
}

export interface InstructorRelations {
  // describe navigational properties here
}

export type InstructorWithRelations = Instructor & InstructorRelations;
