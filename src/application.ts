require('dotenv').config();
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  // RefreshTokenServiceBindings,
  // RefreshtokenService,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTTokenAuthenticationStrategy} from './authentication-strategies/jwt-token.strategy';
import {MysqlDbDataSource} from './datasources';
import {PasswordHasher} from './helpers';
import {PasswordHasherBindings, QueueBindings} from './keys';
import {MySequence} from './sequence';
import {QueueService} from './services';

export {ApplicationConfig};

export class LoopbackTemplateApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // create bindings
    this.setUpBindings();

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    // registerAuthenticationStrategy(this, BasicAuthenticationStrategy);
    registerAuthenticationStrategy(this, JWTTokenAuthenticationStrategy);
  }

  setUpBindings(): void {
    // To set jwt token expiry time
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      process.env?.JWT_SECRET ?? 'dsf#$%dfsdvtdgd$%^',
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      process.env?.ACCESS_TOKEN_EXPIRATION_TIME ?? '1d',
    );
    // this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(
    //   process.env.REFRESH_EXPIRATION_TIME || '529200',
    // );
    // this.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(
    //   process.env.JWT_SECRET || 'dsf#$%dfsdvtdgd$%^',
    // );
    // this.bind(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE).toClass(
    //   RefreshtokenService,
    // );

    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(PasswordHasher);
    this.bind(QueueBindings.QUEUE_SERVICE).toClass(QueueService);
    this.bind('datasources.refreshdb').toClass(MysqlDbDataSource);
  }
}
