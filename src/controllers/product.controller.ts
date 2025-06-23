import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Product} from '../models/product.model';
import {ProductRepository} from '../repositories/product.repository';

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  @authenticate('jwt-token')
  @post('/products')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(Product)},
    },
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {title: 'NewProduct'}),
        },
      },
    })
    product: Product,
  ): Promise<Product> {
    product.createdBy = currentUserProfile.id;
    return this.productRepository.create(product);
  }

  @get('/products')
  @response(200, {
    description: 'Array of Product model instances with related data',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  @get('/products/{id}')
  @response(200, {
    description: 'Product model instance with related data',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Product, {exclude: 'where'})
    filter?: FilterExcludingWhere<Product>,
  ): Promise<Product> {
    return this.productRepository.findById(id, filter);
  }

  @get('/products/details/{identifier}')
  @response(200, {
    description: 'Product model instance with related data',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async details(
    @param.path.string('identifier') identifier: string,
    @param.filter(Product, {exclude: 'where'})
    filter?: FilterExcludingWhere<Product>,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      include: [
        {
          relation: 'category',
          scope: {
            fields: {id: true, categoryName: true},
          },
        },
        {
          relation: 'company',
          scope: {
            fields: {id: true, name: true},
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

  @patch('/products/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Product,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productRepository.updateById(id, {
      deleted: true,
      status: 'inactive',
    });
  }
}
