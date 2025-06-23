import {Entity, model, property} from '@loopback/repository';

@model({name: 'categories'})
export class Category extends Entity {
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
    type: 'number',
    default: null,
  })
  parentId?: number;

  @property({
    type: 'string',
    required: true,
  })
  categoryName: string;

  @property({
    type: 'string',
    required: false,
  })
  categoryType?: string;

  @property({
    type: 'string',
  })
  categoryDescription?: string;

  @property({
    type: 'string',
  })
  imageUrl?: string;

  @property({
    type: 'string',
  })
  createdBy?: string;

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
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
