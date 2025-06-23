import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Category} from './category.model';
import {Tag} from './tag.model';

@model({name: 'posts'})
export class Post extends Entity {
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
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'string',
    required: true,
  })
  identifier: string;

  @property({
    type: 'string',
    required: false,
  })
  featured: string;

  @property({
    type: 'string',
    required: false,
  })
  imageUrl?: string;

  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: 'boolean',
    default: '0',
  })
  deleted: boolean;

  @property({
    type: 'string',
    default: false,
  })
  postStatus: string;

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

  @belongsTo(() => Category, {name: 'category'})
  categoryId: number;

  @hasMany(() => Tag, {keyTo: 'postId'})
  tags: Tag[];

  constructor(data?: Partial<Post>) {
    super(data);
  }
}

export interface PostRelations {
  // describe navigational properties here
  tags?: Tag[];
}

export type PostWithRelations = Post & PostRelations;
