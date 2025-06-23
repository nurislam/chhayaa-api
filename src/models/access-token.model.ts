import {Entity, model, property} from '@loopback/repository';

@model({name: 'accesstokens'})
export class AccessToken extends Entity {
  @property({
    type: 'string',
    id: true, // this is not auto-generated as it needs to be cryptographically secure
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: false,
  })
  ipAddress: string;

  @property({
    type: 'string',
    required: false,
  })
  deviceInfo: string;

  @property({
    type: 'boolean',
    required: false,
  })
  isLoggedIn: boolean;

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
  lastAccess: Date;

  @property({
    type: 'date',
    required: true,
  })
  expiredAt: Date;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AccessToken>) {
    super(data);
  }
}

export interface AccessTokenRelations {
  // describe navigational properties here
}

export type AccessTokenWithRelations = AccessToken & AccessTokenRelations;
