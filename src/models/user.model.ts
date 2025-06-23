import {Entity, model, property} from '@loopback/repository';

@model({name: 'users', settings: {hiddenProperties: ['password']}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    length: 36,
    required: false,
    defaultFn: 'uuidv4',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'number',
    required: true,
  })
  groupId: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string', // Values: ['admin', 'user']
    default: 'user',
  })
  role: string;

  @property({
    type: 'boolean',
  })
  expiredPass: boolean;

  @property({
    type: 'boolean',
    default: true,
  })
  isVerified: boolean;

  @property({
    type: 'string',
  })
  createdBy?: string;

  @property({
    type: 'date',
    required: false,
    defaultFn: 'now',
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: false,
    defaultFn: 'now',
  })
  updatedAt: Date;

  @property({
    type: 'string',
    default: 'active',
  })
  status: string;

  @property({
    type: 'number',
    default: 0,
  })
  deleted: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
