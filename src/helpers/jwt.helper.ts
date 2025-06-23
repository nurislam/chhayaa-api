import * as jwt from 'jsonwebtoken';

export const createAToken = (payload: any, expiresIn?: string) => {
  const options: jwt.SignOptions = expiresIn
    ? {expiresIn: parseInt(expiresIn)}
    : {};
  return jwt.sign(
    payload as string | Buffer | object,
    process.env?.JWT_SECRET ?? '',
    options,
  );
};

export const verifyAToken = (token: string) => {
  return jwt.verify(token, process.env?.JWT_SECRET ?? '');
};
