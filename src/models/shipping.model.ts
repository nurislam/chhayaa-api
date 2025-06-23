import {Entity, model, property} from '@loopback/repository';

@model({ name: 'shipping' })
export class Shipping extends Entity {
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
  shippingAddress: string;

  @property({
    type: 'number',
    required: true,
    scale: 2,
    precision: 10,
  })
  shippingCost: number;

  @property({
    type: 'string',
  })
  trackingNumber?: string;

  @property({
    type: 'string',
  })
  carrier?: string;

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
    type: 'string',
    required: true,
  })
  createdBy: string;

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
}

export interface ShippingRelations {
  // describe navigational properties here
}

export type ShippingWithRelations = Shipping & ShippingRelations;
