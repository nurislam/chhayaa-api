import {Entity, model, property} from '@loopback/repository';

@model({name: 'company'})
export class Company extends Entity {
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
  })
  address?: string;

  @property({
    type: 'string',
  })
  imageUrl?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updatedAt?: string;

  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'string',
    default: 'active',
  })
  status?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted?: boolean;

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  // describe navigational properties here if needed
}

export type CompanyWithRelations = Company & CompanyRelations;
