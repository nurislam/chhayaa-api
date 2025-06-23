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
import {Company} from '../models/company.model';
import {CompanyRepository} from '../repositories/company.repository';

export class CompanyController {
  constructor(
    @repository(CompanyRepository)
    public companyRepository: CompanyRepository,
  ) {}

  @authenticate('jwt-token')
  @post('/companies')
  @response(200, {
    description: 'Company model instance',
    content: {'application/json': {schema: getModelSchemaRef(Company)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {
            title: 'NewCompany',
          }),
        },
      },
    })
    company: Company,
  ): Promise<Company> {
    return this.companyRepository.create(company);
  }

  @get('/companies/count')
  @response(200, {
    description: 'Company model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Company) where?: Where<Company>): Promise<Count> {
    return this.companyRepository.count(where);
  }

  @get('/companies')
  @response(200, {
    description: 'Array of Company model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Company, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Company) filter?: Filter<Company>,
  ): Promise<Company[]> {
    return this.companyRepository.find(filter);
  }

  @patch('/companies')
  @response(200, {
    description: 'Company PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {partial: true}),
        },
      },
    })
    company: Company,
    @param.where(Company) where?: Where<Company>,
  ): Promise<Count> {
    return this.companyRepository.updateAll(company, where);
  }

  @get('/companies/{id}')
  @response(200, {
    description: 'Company model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Company, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Company, {exclude: 'where'})
    filter?: FilterExcludingWhere<Company>,
  ): Promise<Company> {
    return this.companyRepository.findById(id, filter);
  }

  @patch('/companies/{id}')
  @response(204, {
    description: 'Company PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {partial: true}),
        },
      },
    })
    company: Company,
  ): Promise<void> {
    await this.companyRepository.updateById(id, company);
  }

  @put('/companies/{id}')
  @response(204, {
    description: 'Company PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() company: Company,
  ): Promise<void> {
    await this.companyRepository.replaceById(id, company);
  }

  @del('/companies/{id}')
  @response(204, {
    description: 'Company DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
  ): Promise<{success: boolean; message: string}> {
    await this.companyRepository.updateById(id, {
      deleted: true,
      status: 'inactive',
    });
    return {
      success: true,
      message: `Company with id ${id} deleted successfully`,
    };
  }
}
