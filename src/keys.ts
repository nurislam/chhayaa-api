import {UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {PasswordHasher} from './helpers';
import {User} from './models';
import {Credentials} from './repositories';
import {QueueService} from './services';
export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'helpers.PasswordHasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace QueueBindings {
  export const QUEUE_SERVICE =
    BindingKey.create<QueueService>('services.queue');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
}
