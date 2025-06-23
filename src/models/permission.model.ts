import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Group} from './group.model';
import {Modules} from './modules.model';

@model({name: 'permissions'})
export class Permission extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: false, // allows undefined
  })
  actions?: string | null;

  @property({
    type: 'date',
  })
  createdAt?: Date;

  @belongsTo(() => Group)
  groupId: number;

  @belongsTo(() => Modules)
  moduleId: number;

  constructor(data?: Partial<Permission>) {
    super(data);
  }
}

export interface PermissionRelations {
  // describe navigational properties here
}

export type PermissionWithRelations = Permission & PermissionRelations;
