import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Courses extends Entity {
  @property({
    type: 'number',
  })
  id?: number;

  @property({
    type: 'string',
  })
  identifier?: string;

  @property({
    type: 'number',
  })
  categoryId?: number;

  @property({
    type: 'number',
  })
  instructorId?: number;

  @property({
    type: 'string',
  })
  title?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Courses>) {
    super(data);
  }
}

export interface CoursesRelations {
  // describe navigational properties here
}

export type CoursesWithRelations = Courses & CoursesRelations;
