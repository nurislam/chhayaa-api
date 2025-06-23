import {Entity, model, property} from '@loopback/repository';

@model({name: 'settings'})
export class Option extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: false,
  })
  option_name?: string;

  @property({
    type: 'string',
    required: false,
  })
  option_value?: string;

  @property({
    type: 'string',
    required: false,
  })
  createdBy?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  status?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted?: boolean;

  @property({
    type: 'string',
  })
  createdAt?: string;

  @property({
    type: 'string',
  })
  updatedAt?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Option>) {
    super(data);
  }
}

export interface OptionRelations {
  // describe navigational properties here
}

export type OptionWithRelations = Option & OptionRelations;
