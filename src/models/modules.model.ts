import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Permission} from './permission.model';

@model({name: 'modules'})
export class Modules extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  slug: string;

  @property({
    type: 'string',
    required: false,
  })
  icon: string;

  @property({
    type: 'number',
    length: 5,
    required: false,
  })
  ordering: number;

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

  @hasMany(() => Permission, {keyTo: 'moduleId'})
  permissions: Permission[];

  @belongsTo(() => Modules)
  parentId: number;

  @hasMany(() => Modules, {keyTo: 'parentId'})
  children: Modules[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Modules>) {
    super(data);
  }
}

export interface ModulesRelations {
  // describe navigational properties here
}

export type ModulesWithRelations = Modules & ModulesRelations;
