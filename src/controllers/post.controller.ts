import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Post} from '../models';
import {PostRepository} from '../repositories';
import {CategoryRepository} from '../repositories/category.repository';
import {TagRepository} from '../repositories/tag.repository';
import {filterMatchingProperties} from '../util/global-functions';
export class PostController {
  constructor(
    @repository(PostRepository)
    public postRepository: PostRepository,
    @repository(CategoryRepository)
    public CategoryRepository: CategoryRepository,
    @repository(TagRepository)
    public TagRepository: TagRepository,
  ) {}

  @authenticate('jwt-token')
  @post('/posts')
  @response(200, {
    description: 'Post model instance',
    content: {'application/json': {schema: getModelSchemaRef(Post)}},
  })
  async create(
    @requestBody()
    data: {
      title: string;
      content: string;
      identifier: string;
      featured: string;
      categoryId: number;
      tagNames: string[];
    },
  ): Promise<any> {
    try {
      const postData = filterMatchingProperties<Post>(new Post(), data);
      const savedPost = await this.postRepository.create(postData);
      return savedPost;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpErrors.BadRequest(
          `Duplicate entry for identifier: '${data.identifier}'`,
        );
      }

      throw new HttpErrors.InternalServerError(
        'Failed to create post. Please try again later.',
      );
    }
  }

  @get('/posts/count')
  @response(200, {
    description: 'Post model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Post) where?: Where<Post>): Promise<Count> {
    return this.postRepository.count(where);
  }

  @get('/posts')
  @response(200, {
    description: 'Array of Post model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Post, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Post) filter?: Filter<Post>): Promise<Post[]> {
    return this.postRepository.find(filter);
  }

  @patch('/posts')
  @response(200, {
    description: 'Post PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    post: Post,
    @param.where(Post) where?: Where<Post>,
  ): Promise<Count> {
    return this.postRepository.updateAll(post, where);
  }

  @get('/posts/{id}')
  @response(200, {
    description: 'Post model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Post, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Post, {exclude: 'where'}) filter?: FilterExcludingWhere<Post>,
  ): Promise<Post> {
    return this.postRepository.findById(id, filter);
  }

  @get('/posts/details/{identifier}')
  @response(200, {
    description: 'Post model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Post, {includeRelations: true}),
      },
    },
  })
  async findByIdentifier(
    @param.path.string('identifier') identifier: string,
    @param.filter(Post, {exclude: 'where'}) filter?: FilterExcludingWhere<Post>,
  ): Promise<Post> {
    const product = await this.postRepository.findOne({
      include: [
        {
          relation: 'category',
          scope: {fields: {id: true, identifier: true, categoryName: true}},
        },
        {
          relation: 'tags',
          scope: {
            fields: {id: true, identifier: true, postId: true, name: true},
          },
        },
      ],
      where: {identifier, deleted: false},
    });
    if (!product) {
      throw new Error(`Product with identifier ${identifier} not found`);
    }
    return product;
  }
  @get('/posts/category/{identifier}')
  @response(200, {
    description: 'Post model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Post, {includeRelations: true}),
      },
    },
  })
  async findByCatIdentifier(
    @param.path.string('identifier') identifier: string,
    @param.filter(Post, {exclude: 'where'}) filter?: FilterExcludingWhere<Post>,
  ): Promise<{categoryName?: string; products?: Post[]}> {
    const cat = await this.CategoryRepository.findOne({
      where: {identifier, deleted: false},
    });

    if (cat) {
      const products = await this.postRepository.find({
        include: [
          {
            relation: 'category',
            scope: {fields: {id: true, identifier: true, categoryName: true}},
          },
          {
            relation: 'tags',
            scope: {
              fields: {id: true, identifier: true, postId: true, name: true},
            },
          },
        ],
        where: {categoryId: cat?.id, deleted: false, postStatus: 'published'},
      });

      return {
        categoryName: cat?.categoryName,
        products: products,
      };
    }

    return {
      categoryName: undefined,
      products: [],
    };
  }

  @get('/posts/tag/{identifier}')
  @response(200, {
    description: 'Post model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Post, {includeRelations: true}),
      },
    },
  })
  async findByTagIdentifier(
    @param.path.string('identifier') identifier: string,
    @param.filter(Post, {exclude: 'where'}) filter?: FilterExcludingWhere<Post>,
  ): Promise<{tagName?: string; products?: Post[]}> {
    if (!identifier) {
      throw new Error('Identifier is required');
    }
    const tags = await this.TagRepository.find({
      where: {identifier, deleted: false},
    });

    // Extract all postIds from the tag list
    const postIds = tags.map(tag => tag.postId);

    // Fetch products using postIds
    if (postIds.length > 0) {
      const products = await this.postRepository.find({
        include: [
          {
            relation: 'category',
            scope: {
              fields: {id: true, identifier: true, categoryName: true},
            },
          },
          {
            relation: 'tags',
            scope: {
              fields: {id: true, identifier: true, postId: true, name: true},
            },
          },
        ],
        where: {
          id: {inq: postIds}, // Use 'inq' for filtering by an array of IDs
          deleted: false,
          postStatus: 'published',
        },
      });

      // Return result
      return {
        tagName: tags && tags[0]?.name, // Just using the first tag name (optional logic)
        products: products && products.length > 0 ? products : [],
      };
    } else {
      return {
        tagName: undefined,
        products: [],
      };
    }
  }

  @patch('/posts/{identifier}')
  @response(204, {
    description: 'Post PATCH success',
  })
  async updateByIdentifier(
    @param.path.string('identifier') identifier: string,
    @requestBody()
    data: {
      title: string;
      content: string;
      identifier: string;
      featured: string;
      categoryId: number;
      tagNames: string[];
    },
  ): Promise<void> {
    try {
      const postToUpdate = await this.postRepository.findOne({
        where: {identifier},
      });
      if (!postToUpdate) {
        throw new HttpErrors.NotFound(
          `Post with identifier '${identifier}' not found`,
        );
      }
      const postData = filterMatchingProperties<Post>(new Post(), data);

      const updatePost = await this.postRepository.updateById(
        postToUpdate.id,
        postData,
      );
      return updatePost;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpErrors.BadRequest(
          `Post with identifier: '${data.identifier}'`,
        );
      }

      throw new HttpErrors.InternalServerError(`Post update error: '${error}'`);
    }
  }

  @patch('/posts/{id}')
  @response(204, {
    description: 'Pages PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    post: Post,
  ): Promise<void> {
    await this.postRepository.updateById(id, post);
  }

  @put('/posts/{id}')
  @response(204, {
    description: 'Post PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() post: Post,
  ): Promise<void> {
    await this.postRepository.replaceById(id, post);
  }

  @del('/posts/{id}')
  @response(204, {
    description: 'Post DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.postRepository.updateById(id, {
      deleted: true,
      postStatus: 'deleted',
    });
  }
}
