import {SchemaObject} from '@loopback/rest';
import {getEmailPattern, getUUUIDPattern} from '../../util/global-functions';

export interface LoginCredential {
  id: 'string';
  email: 'string';
  password: 'string';
}

const UserLoginSchema: SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      maxLength: 40,
      minLength: 1,
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 30,
    },
  },
};
export const UserProfileSchema: SchemaObject = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {type: 'string'},
    password: {type: 'string'},
  },
};
export const UserLoginRequestBody = {
  description: 'The input of login',
  required: true,
  content: {
    'application/json': {schema: UserLoginSchema},
  },
};

const RefreshTokenSchema: SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
    },
  },
};

export const RefreshTokenRequestBody = {
  description: 'The input of refresh token',
  required: true,
  content: {
    'application/json': {schema: RefreshTokenSchema},
  },
};

const ForgetPasswordSchema: SchemaObject = {
  type: 'object',
  required: ['email'],
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      pattern: getEmailPattern(),
      errorMessage: 'Invalid email',
    },
  },
};
export const ForgetPasswordRequestBody = {
  content: {
    'application/json': {
      schema: ForgetPasswordSchema,
    },
  },
  description: 'The input of forget password',
  required: true,
};

const UpdateCredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['oldPassword', 'newPassword', 'newPasswordConfirm'],
  properties: {
    oldPassword: {
      type: 'string',
    },
    newPassword: {
      type: 'string',
      minLength: 8,
    },
    newPasswordConfirm: {
      type: 'string',
      minLength: 8,
    },
  },
};
export const UpdateCredentialsRequestBody = {
  description: 'The input of change pass function',
  required: true,
  content: {
    'application/json': {schema: UpdateCredentialsSchema},
  },
};

const UpdateProfileSchema: SchemaObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    firstName: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: 'string',
      maxLength: 40,
      pattern: getEmailPattern(),
      errorMessage: 'Invalid email',
    },
  },
};
export const UpdateProfileRequestBody = {
  description: 'The input of update profile',
  required: true,
  content: {
    'application/json': {schema: UpdateProfileSchema},
  },
};

const CreateNewPasswordSchema: SchemaObject = {
  type: 'object',
  additionalProperties: false,
  required: ['token', 'password'],
  properties: {
    token: {
      type: 'string',
      pattern: getUUUIDPattern(),
      errorMessage: 'Invalid token in request body',
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 30,
    },
  },
};
export const CreateNewPasswordRequestBody = {
  content: {
    'application/json': {
      schema: CreateNewPasswordSchema,
    },
  },
  description: 'The input of create new password',
  required: true,
};

export type CreateNewPasswordData = {
  password: string;
  token: string;
};
