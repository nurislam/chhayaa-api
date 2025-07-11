import {Entity, model, property, hasMany} from '@loopback/repository';
import {Stdenrolled} from './stdenrolled.model';

@model({name: 'students'})
export class Student extends Entity {
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
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  content?: string;

  @property({
    type: 'string',
  })
  TotalCourse?: string;

  @property({
    type: 'string',
  })
  featured?: string;

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

  @hasMany(() => Stdenrolled)
  stdenrolleds: Stdenrolled[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
