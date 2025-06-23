import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Post} from './post.model'; // Make sure the Post model is imported correctly

@model({name: 'tags'})
export class Tag extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  identifier: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => Post, {name: 'post'})
  postId: number;

  @property({
    type: 'string',
    default: 'active',
  })
  status: string;

  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'boolean',
    default: 0,
  })
  deleted: boolean;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt: string;

  constructor(data?: Partial<Tag>) {
    super(data);
  }
}

export interface TagRelations {
  post?: Post;
}

export type TagWithRelations = Tag & TagRelations;
