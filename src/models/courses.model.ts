import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Category} from './category.model';

@model({name: 'courses'})
export class Courses extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  identifier: string;

  @property({
    type: 'number',
    required: false,
  })
  TotalStudents: number;

  @property({
    type: 'number',
    required: false,
  })
  totalLesson: number;

  @property({
    type: 'string',
    required: false,
  })
  featured: string;

  @property({
    type: 'string',
    required: false,
  })
  imageUrl?: string;

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
    type: 'string',
    default: false,
  })
  status: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt: string;

  @belongsTo(() => Category)
  categoryId: number;
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
