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
import {Shipping} from '../models/shipping.model';
import {ShippingRepository} from '../repositories/shipping.repository';

export class ShippingController {
  constructor(
    @repository(ShippingRepository)
    public shippingRepository: ShippingRepository,
  ) {}

  @authenticate('jwt-token')
  @post('/shipping')
  @response(200, {
    description: 'Shipping model instance',
    content: {'application/json': {schema: getModelSchemaRef(Shipping)}},
  })
  async create(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shipping, {title: 'NewShipping'}),
        },
      },
    })
    shipping: Shipping,
  ): Promise<Shipping> {
    shipping.createdBy = currentUserProfile.id;
    return this.shippingRepository.create(shipping);
  }

  @get('/shipping/count')
  @response(200, {
    description: 'Shipping model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Shipping) where?: Where<Shipping>): Promise<Count> {
    return this.shippingRepository.count(where);
  }


  @get('/shipping')
  @response(200, {
    description: 'Array of Shipping model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Shipping, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Shipping) filter?: Filter<Shipping>,
  ): Promise<Shipping[]> {
    return this.shippingRepository.find(filter);
  }

  @patch('/shipping')
  @response(200, {
    description: 'Shipping PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shipping, {partial: true}),
        },
      },
    })
    shipping: Shipping,
    @param.where(Shipping) where?: Where<Shipping>,
  ): Promise<Count> {
    return this.shippingRepository.updateAll(shipping, where);
  }

  @get('/shipping/{id}')
  @response(200, {
    description: 'Shipping model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Shipping, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Shipping, {exclude: 'where'}) filter?: FilterExcludingWhere<Shipping>,
  ): Promise<Shipping> {
    return this.shippingRepository.findById(id, filter);
  }

  @patch('/shipping/{id}')
  @response(204, {
    description: 'Shipping PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shipping, {partial: true}),
        },
      },
    })
    shipping: Shipping,
  ): Promise<void> {
    await this.shippingRepository.updateById(id, shipping);
  }

  @put('/shipping/{id}')
  @response(204, {
    description: 'Shipping PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() shipping: Shipping,
  ): Promise<void> {
    await this.shippingRepository.replaceById(id, shipping);
  }

  @del('/shipping/{id}')
  @response(204, {
    description: 'Shipping DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.shippingRepository.deleteById(id);
  }
}
