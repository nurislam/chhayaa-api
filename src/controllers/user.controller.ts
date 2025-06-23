import {
  TokenService,
  UserService,
  authenticate,
} from '@loopback/authentication';
import {
  RefreshTokenServiceBindings,
  RefreshtokenService,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Transaction,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  RestBindings,
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
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {size} from 'lodash';
import moment from 'moment-timezone';
import {PasswordHasher} from '../helpers';
import {userHelper} from '../helpers/index.js';
import {PasswordHasherBindings, QueueBindings} from '../keys';
import {UserServiceBindings} from '../keys.js';
import {User} from '../models';
import {
  AccessTokenRepository,
  ForgetPasswordData,
  UserRepository,
} from '../repositories';
import {TokenRepository} from '../repositories/token.repository';
import {Credentials, UpdateCredentials} from '../repositories/user.repository';
import {QueueService} from '../services';
import {EmailService} from '../services/email.service';
import {useTransaction} from '../util/dbTransaction';
import {OPERATION_SECURITY_SPEC} from '../util/security-spec';
import {
  CreateNewPasswordData,
  CreateNewPasswordRequestBody,
  ForgetPasswordRequestBody,
  LoginCredential,
  RefreshTokenRequestBody,
  UpdateCredentialsRequestBody,
  UpdateProfileRequestBody,
  UserLoginRequestBody,
  UserProfileSchema,
} from './specs/user-controller.specs';
export class UserController {
  constructor(
    @repository(AccessTokenRepository)
    public accessTokenRepository: AccessTokenRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public authtokenService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @repository(TokenRepository)
    public tokenRepository: TokenRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    private passwordHasher: PasswordHasher,
    @inject('services.EmailService')
    public emailService: EmailService,
  ) {}

  @authenticate({strategy: 'jwt-token', options: {roles: ['admin']}})
  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
          }),
        },
      },
    })
    user: User,
  ): Promise<User> {
    const {password, email, firstName, lastName, role, status} = user;

    const lowerCaseEmail = email.toLowerCase();

    const existingUsername = await this.userRepository.findOne({
      where: {
        or: [{email}],
      },
    });
    if (existingUsername)
      throw new HttpErrors.BadRequest('Username already exist');

    const hashPassword = await this.passwordHasher.getHash(password);

    return this.userRepository.create({
      email: lowerCaseEmail,
      firstName,
      lastName,
      password: hashPassword,
      role,
      status,
      isVerified: true,
      createdBy: currentUserProfile.id,
      expiredPass: false,
    });
  }

  @post('/users/forget-password', {
    responses: {
      '200': {
        description: 'Forget password response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async forgetPassword(
    @requestBody(ForgetPasswordRequestBody) body: ForgetPasswordData,
  ) {
    const {email} = body;
    const userInfo = await this.userRepository.findOne({where: {email}});
    if (!userInfo) throw new HttpErrors.NotFound('User not found');
    let tokenInfo = await this.tokenRepository.findOne({
      where: {
        userId: userInfo.id,
        type: 'forget_password',
        expiresAt: {gte: new Date().toISOString()},
      },
    });

    if (!tokenInfo) {
      tokenInfo = await this.tokenRepository.create({
        userId: userInfo.id,
        type: 'forget_password',
        expiresAt: moment().add(1, 'day').toString(),
      });
    }

    try {
      const resetLink = `${process.env.BASE_URL_FORFRONTEND}create-new-password?token=${tokenInfo.id}`;
      //const logoLink = `${process.env.BASE_URL_FORFRONTEND}logo.png`;
      const logoLink =
        'https://res.cloudinary.com/dmf1gdrca/image/upload/v1737520211/logo.png'; //just for testing
      const subject = 'Password Reset Request';
      const emailBody = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Email</title>
      </head>
      <body>
        <div>
          <div
            style="font-size: 15px; color: rgb(47, 41, 54); padding: 0px; font-family: 'Poppins', sans-serif; width: 1226px; margin: 0px;"
          >
            <table
              style="border-radius: 4px; border-spacing: 0px; max-width: 700px; font-family: 'Poppins', sans-serif; border: 1px dotted rgb(199, 208, 212); width: 700px; margin: 15px auto;"
            >
              <tbody>
                <tr>
                  <td style="padding: 0px; text-align: center">
                    <div
                      style="padding: 25px 0px; font-size: 14px; border-bottom: 1px solid rgb(222, 231, 235);"
                    >
                      <div
                        style="padding: 0px 20px; max-width: 600px; margin: 0px auto; text-align: left;"
                      >
                        <table style="width: 600px; margin-bottom: 0px; border-collapse: collapse;">
                          <tbody>
                            <tr>
                              <td width="125px" style="padding: 0px; text-align: center; vertical-align: middle; padding-top:20px;">
                                <h1
                                  style="font-size: 38px; color: rgb(0, 0, 0); letter-spacing: -1px; padding: 0px; font-weight: normal; margin: 0px; line-height: 42px;"
                                >
                                  <a
                                    href="${process.env.BASE_URL_FORFRONTEND}"
                                    style="color: rgb(77, 112, 213); text-decoration-line: none;"
                                    target="_blank"
                                  >
                                    <img
                                      src="${logoLink}"
                                      height="50px"
                                      alt="REALSEO"
                                    />
                                  </a>
                                </h1>
                              </td>
                              <td style="padding: 0px; text-align: right; vertical-align: middle;">
                                <br />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0px; text-align: center">
                    <div
                      style="padding: 0px 20px; max-width: 600px; margin: 0px auto; text-align: left;"
                    >
                      <div style="padding: 30px 0px 20px">
                        You requested a password reset for your REALSEO account.<br /><br />
                        Please visit the following link to enter your new password:<br /><br />
                        <a href="${resetLink}" target="_blank">
                          ${resetLink}
                        </a>
                        <br /><br />
                        If you need any assistance, please contact us at
                        <a href="mailto:support@realseo.com?subject=ResetPassword" style="text-decoration-line: none" target="_blank">
                          support@realseo.com
                        </a>
                        <br /><br />
                         <p><strong>Note:</strong> This password reset link will expire in 24 hours.</p>
                        <p>If you did not request a password reset, no further action is required.</p>
                        <br />
                        <p>Thanks,<br />Web Presence LLC</p>
                      </div>
                    </div>

                    <div
                      style="max-width: 600px; padding: 0px 20px; margin: 0px auto; text-align: left;"
                    >
                      <div style="padding: 20px 0px 40px; border-top: 1px solid rgb(231, 235, 238);">
                        <a
                          href="https://realreview.weightllossdiets.com/login"
                          style="color: rgb(104, 114, 118); float: right; text-decoration-line: none;"
                          target="_blank"
                        >
                          Account Login
                        </a>
                        <a
                          href="https://realreview.weightllossdiets.com"
                          style="color: rgb(104, 114, 118); text-decoration-line: none;"
                          target="_blank"
                        >
                          Help Center
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `;
      await this.emailService.sendCustomEmail(
        userInfo.email,
        subject,
        emailBody,
      );
    } catch (error) {
      console.error('Error while adding email to queue:', error);
    }

    return {
      message: 'An email has sent to your email address to create new password',
    };
  }
  @patch('/users/create-new-password', {
    responses: {
      '200': {
        description: 'Create new password response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async createNewPassword(
    @requestBody(CreateNewPasswordRequestBody) body: CreateNewPasswordData,
  ) {
    return await useTransaction(
      this.userRepository.dataSource,
      async (transaction: Transaction) => {
        const {password, token} = body;

        const tokenInfo = await this.tokenRepository.findOne({
          where: {
            id: token,
            type: 'forget_password',
            expiresAt: {gte: new Date()},
          },
        });
        if (!tokenInfo) throw new HttpErrors.NotFound('Invalid token!');

        const hassPassword = await this.passwordHasher.getHash(password);
        await this.userRepository.updateById(
          tokenInfo.email,
          {
            password: hassPassword,
            isVerified: true,
          },
          {transaction},
        );

        await this.tokenRepository.deleteAll(
          {userId: tokenInfo.id, type: 'forget_password'},
          {transaction},
        );

        return {
          message:
            'You successfully reset your password. Please login your account.',
        };
      },
    );
  }

  @post('/users/login')
  @response(200, {
    description: 'Logged in response content',
  })
  async login(
    @requestBody(UserLoginRequestBody) loginCredential: LoginCredential,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    tokenService: TokenService,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
    refreshTokenService: RefreshtokenService,
    @param.header.string('User-Agent') useragentHeader: string,
  ) {
    const {id, email, password} = loginCredential;

    const existingUser = await this.userRepository.findOne({where: {email}});
    if (!existingUser) {
      throw new HttpErrors.Unauthorized('Invalid Email!');
    }
    // ensure the user exists, and the password is correct
    //const user = await this.userService.verifyCredentials(loginCredential);

    const isValidPassword = await this.passwordHasher.validatePassword(
      password,
      existingUser.password,
    );
    if (!isValidPassword)
      throw new HttpErrors.Unauthorized('Invalid Password!');

    const payload: UserProfile = {
      [securityId]: existingUser.id,
    };
    const accessToken: string = await tokenService.generateToken(payload);

    const {refreshToken} = await refreshTokenService.generateToken(
      payload,
      accessToken,
    );

    return {
      accessToken,
      refreshToken,
      token: accessToken,
      id: existingUser.id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      role: existingUser.role,
      groupId: existingUser.groupId,
      status: existingUser.status,
      expiredPass: existingUser.expiredPass,
    };
  }
  @authenticate({strategy: 'jwt-token', options: {roles: ['admin']}})
  @post('/users/login/{id}', {
    responses: {
      '200': {
        description: 'Login as another user response',
      },
    },
  })
  async loginAsAnotherUser(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @param.header.string('User-Agent') useragentHeader: string,
  ) {
    if (id === currentUserProfile.id) {
      throw new HttpErrors.BadRequest('You are already logged in');
    }

    const userInfo = await this.userRepository.findOne({
      where: {id: id, deleted: 0},
    });

    if (!userInfo) throw new HttpErrors.NotFound('User not found');

    try {
      const user = Object.assign({} as any, userInfo);
      const userType = user as any;
      userType.id = user.id;
      const userProfile = this.userService.convertToUserProfile(userType);

      // create a UUIDv4 Token based on the user profile
      const token = await this.authtokenService.generateToken(userProfile);

      const accessToken = await this.accessTokenRepository.create({
        token: token,
        id: userInfo.id,
        ipAddress: request.ip,
        deviceInfo: useragentHeader,
        isLoggedIn: true,
        expiredAt: moment().add(3, 'days').toDate(),
      });

      return {
        token: token,
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        groupId: userInfo.groupId,
        role: userInfo.role,
        status: userInfo.status,
        refreshToken: currentUserProfile.refreshToken,
        expiredPass: userInfo.expiredPass,
      };
    } catch (err) {
      throw new HttpErrors.InternalServerError(
        'Error converting user to profile',
      );
    }
  }

  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt-token')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {id: currentUserProfile.id, deleted: 0},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
    return user;
  }
  @get('/users/logout', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt-token')
  async logout(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.header.string('Authorization') authorizationHeader: string,
  ): Promise<User | boolean> {
    await this.accessTokenRepository.updateLogout(
      this.accessTokenRepository.getTokenFromHeader(authorizationHeader),
      currentUserProfile.id,
    );
    return true;
  }
  @authenticate('jwt-token')
  @post('/users/changepass', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  async changePassword(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody(UpdateCredentialsRequestBody)
    updateCredentials: UpdateCredentials,
  ): Promise<UserProfile> {
    const invalidCredentialsError = 'Your pssaord invalid password.';

    currentUserProfile.id = currentUserProfile[securityId];

    const foundUser = await this.userRepository.findById(currentUserProfile.id);
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    // check the old password
    const passwordMatched = await this.passwordHasher.validatePassword(
      updateCredentials.oldPassword,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    // make sure the passwords match
    if (
      updateCredentials.newPassword !== updateCredentials.newPasswordConfirm
    ) {
      return Promise.reject('Passwords do not match');
    }

    // update the password
    var newPassHash = await this.passwordHasher.getHash(
      updateCredentials.newPassword,
    );
    await this.userRepository.updateById(currentUserProfile.id, {
      password: newPassHash,
      expiredPass: false,
    });

    // return the current profile
    return currentUserProfile;
  }

  @authenticate('jwt-token')
  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate('jwt-token')
  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  //@authenticate({strategy: 'jwt-token', options: {roles: ['admin']}}) // Only admin can update another users
  @authenticate({strategy: 'jwt-token'})
  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @inject(SecurityBindings.USER)
    @param.where(User)
    where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @authenticate('jwt-token')
  @patch('/users/update', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
      },
    },
  })
  async updateUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody(UpdateProfileRequestBody) userInfo: User,
  ): Promise<void> {
    const {email} = userInfo;

    currentUserProfile.id = currentUserProfile[securityId];

    if (email) {
      const existingUser = await this.userRepository.findOne({
        where: {id: {neq: currentUserProfile.id}, email},
      });
      if (existingUser)
        throw new HttpErrors.BadRequest('Email is in use for another user.');
    }

    const updateData =
      userHelper.prepareUpdateDataForUpdateUserProfile(userInfo);
    if (!size(updateData)) throw new HttpErrors.BadRequest('Nothing to update');

    await this.userRepository.updateById(currentUserProfile.id, updateData);
  }
  @authenticate('jwt-token')
  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @authenticate({strategy: 'jwt-token', options: {roles: ['admin']}})
  @patch('/users/{id}') // Use this method for update user
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    user.updatedAt = new Date(); //Update with date
    await this.userRepository.updateById(id, user);
  }

  @authenticate({strategy: 'jwt-token', options: {roles: ['admin']}})
  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @authenticate({strategy: 'jwt-token', options: {roles: ['admin']}})
  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @get('/refresh')
  @response(200, {
    description: 'Refresh token response',
  })
  async refreshToken(
    @requestBody(RefreshTokenRequestBody) body: {refreshToken: string},
    @inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
    refreshTokenService: RefreshtokenService,
  ) {
    const {refreshToken} = body;
    return refreshTokenService.refreshToken(refreshToken);
  }

  @post('/send-email')
  @response(200, {
    description: 'Email sending response',
  })
  async sendEmail(
    @inject(QueueBindings.QUEUE_SERVICE) queueService: QueueService,
  ) {
    queueService.addedEmailInQueue({
      to: 'ashish.cse.gu@gmail.com',
      html: `<h2>This is test email</h2>`,
      subject: 'Test email',
    });
  }
  @authenticate('jwt-token')
  @get('/users/vendors')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async vendors(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<any | any[]> {
    const vendorsList = await this.userRepository.find(filter);

    const userVendors =
      vendorsList && Array.isArray(vendorsList)
        ? await Promise.all(
            vendorsList.map(async vendor => ({
              id: vendor.id,
              role: vendor.role,
              email: vendor.email,
              firstName: vendor.firstName,
              lastName: vendor.lastName,
              createdAt: vendor.createdAt,
            })),
          )
        : [];

    return userVendors;
  }
}
