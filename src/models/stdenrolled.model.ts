import {Entity, model, property} from '@loopback/repository';

@model({name: 'stdenrolled'})
export class Stdenrolled extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  courseId?: number;

  @property({
    type: 'number',
  })
  studentId?: number;

  @property({
    type: 'string',
  })
  createdBy?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt: string;

  constructor(data?: Partial<Stdenrolled>) {
    super(data);
  }
}

export interface StdenrolledRelations {
  // describe navigational properties here
}

export type StdenrolledWithRelations = Stdenrolled & StdenrolledRelations;
