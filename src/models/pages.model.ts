import {Entity, model, property} from '@loopback/repository';

@model({name: 'pages'})
export class Pages extends Entity {
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
  title: string;

  @property({
    type: 'string',
    required: false,
  })
  photo: string;

  @property({
    type: 'string',
    required: true,
  })
  identifier: string;

  @property({
    type: 'string',
  })
  content?: string;

  @property({
    type: 'number',
    length: 1,
    required: false,
  })
  status: number;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt?: Date;

  @property({
    type: 'string',
    required: false,
    length: 36,
  })
  createdBy: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updatedAt?: Date;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Pages>) {
    super(data);
  }
}

export interface PagesRelations {
  // describe navigational properties here
}

export type PagesWithRelations = Pages & PagesRelations;
