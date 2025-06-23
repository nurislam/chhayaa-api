import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/context';
import {Getter, repository} from '@loopback/repository';
import {HttpErrors, RedirectRoute, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {UserRepository} from '../repositories';

export class JWTTokenAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt-token';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private tokenService: TokenService,
    @repository.getter(UserRepository)
    private userRepositoryGetter: Getter<UserRepository>,
  ) {}

  async authenticate(
    request: Request,
  ): Promise<UserProfile | RedirectRoute | undefined> {
    const userRepository = await this.userRepositoryGetter();

    const token: string = this.extractCredentials(request);
    let userProfile: UserProfile = await this.tokenService.verifyToken(token);

    const userInfo = await userRepository.findById(userProfile.id);
    userProfile = {
      ...userProfile,
      email: userInfo.email,
      role: userInfo.role,
    };

    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example : Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid Authorization token.`,
      );
    const token = parts[1];

    return token;
  }
}
