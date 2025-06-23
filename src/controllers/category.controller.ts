import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Category} from '../models/category.model';
import {CategoryRepository} from '../repositories/category.repository';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  @authenticate('jwt-token')
  @post('/categories')
  @response(200, {
    description: 'Category model instance',
    content: {'application/json': {schema: getModelSchemaRef(Category)}},
  })
  async create(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {title: 'NewCategory'}),
        },
      },
    })
    category: Category,
  ): Promise<Category> {
    return this.categoryRepository.create(category);
  }

  @get('/categories/count')
  @response(200, {
    description: 'Category model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Category) where?: Where<Category>): Promise<Count> {
    return this.categoryRepository.count(where);
  }

  @get('/categories')
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Category, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.categoryRepository.find(filter);
  }

  @patch('/categories')
  @response(200, {
    description: 'Category PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.updateAll(category, where);
  }

  @get('/categories/{id}')
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Category, {exclude: 'where'})
    filter?: FilterExcludingWhere<Category>,
  ): Promise<Category> {
    return this.categoryRepository.findById(id, filter);
  }

  @patch('/categories/{id}')
  @response(200, {
    description: 'Category PATCH success',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, {includeRelations: true}),
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
  ): Promise<void> {
    await this.categoryRepository.updateById(id, category);
  }

  @put('/categories/{id}')
  @response(200, {
    description: 'Category PUT success',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, {includeRelations: true}),
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() category: Category,
  ): Promise<Category> {
    await this.categoryRepository.replaceById(id, category);
    return this.categoryRepository.findById(id);
  }

  @del('/categories/{id}')
  @response(200, {
    description: 'Category DELETE success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {type: 'boolean'},
            message: {type: 'string'},
          },
        },
      },
    },
  })
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<{success: boolean; message: string}> {
    await this.categoryRepository.updateById(id, {
      deleted: true,
      status: 'inactive',
    });
    return {
      success: true,
      message: `Category with id ${id} deleted successfully`,
    };
  }
}
