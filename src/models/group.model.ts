import {Entity, model, property} from '@loopback/repository';

@model({name: 'groups'})
export class Group extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  name?: string;

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
    type: 'boolean',
    default: false,
  })
  deleted: boolean;

  constructor(data?: Partial<Group>) {
    super(data);
  }
}

export interface GroupRelations {
  // describe navigational properties here
}

export type GroupWithRelations = Group & GroupRelations;
