import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Category} from './category.model';
import {Instructor} from './instructor.model';
import {Lessons} from './lessons.model';

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
    type: 'string',
    required: true,
  })
  content: string;

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
  level: string;

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

  @property({
    type: 'number',
    required: false,
  })
  price: number;

  @property({
    type: 'string',
    required: false,
  })
  duration: string;

  @property({
    type: 'string',
    required: false,
  })
  language: string;

  @property({
    type: 'string',
    required: false,
  })
  certificate: string;

  @property({
    type: 'number',
    required: false,
  })
  rating: number;

  @belongsTo(() => Category)
  categoryId: number;

  @belongsTo(() => Instructor)
  instructorId: number;

  @hasMany(() => Lessons, {keyTo: 'courseId'})
  lessons: Lessons[];
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
