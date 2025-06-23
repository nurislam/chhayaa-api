import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbDataSource} from '../datasources';
import {Shipping, ShippingRelations} from '../models/shipping.model';


export class ShippingRepository extends DefaultCrudRepository<
  Shipping,
  typeof Shipping.prototype.id,
  ShippingRelations
> {
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
  ) {
    super(Shipping, dataSource);
  }
}
