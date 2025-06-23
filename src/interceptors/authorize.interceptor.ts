import {AuthenticationBindings} from '@loopback/authentication';
import {User} from '@loopback/authentication-jwt';
import {
  Getter,
  /* inject, */
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('Auth', {tags: {name: 'Authorize'}})
export class AuthorizeInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: any,

    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private getCurrentUser: Getter<User>,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      const roles = this.metadata?.[0]?.options?.roles;
      if (roles?.length) {
        const user = await this.getCurrentUser();
        if (!roles.includes(user.role))
          throw new HttpErrors.Unauthorized('Access denied!');
      }

      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
