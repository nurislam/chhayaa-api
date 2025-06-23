import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Category} from './category.model';
import {Company} from './company.model';

@model({name: 'products'})
export class Product extends Entity {
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
    unique: true,
  })
  identifier: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    required: true,
    scale: 2,
    precision: 10,
  })
  price: number;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  sku: string;

  @property({
    type: 'number',
    required: true,
  })
  stockQuantity: number;

  @property({
    type: 'string',
  })
  imageUrl?: string;

  @property({
    type: 'number',
    scale: 2,
    precision: 10,
  })
  weight?: number;

  @property({
    type: 'string',
  })
  dimensions?: string;

  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'string',
    default: 'active',
    enum: ['active', 'inactive'],
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
    updateFn: 'now',
  })
  updatedAt?: string;

  @belongsTo(() => Category, {name: 'category'})
  categoryId: number;

  @belongsTo(() => Company, {name: 'company'})
  companyId: number;
}

export interface ProductRelations {
  // define navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
