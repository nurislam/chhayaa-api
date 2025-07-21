import {inject} from '@loopback/core';
import * as jwt from 'jsonwebtoken';

export class JWTService {
  constructor(@inject('services.JWT_SECRET_KEY') private secretKey: string) { }

  generateToken(student: any): string {
    const payload = {
      id: student.id,
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
    };
    const token = jwt.sign(payload, this.secretKey, {expiresIn: '1h'});
    return token;
  }
}
