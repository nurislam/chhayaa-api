import bcrypt from 'bcrypt';

export class PasswordHasher {
  constructor() {}

  async getHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async validatePassword(rawPassword: string, hashPassword: string) {
    return bcrypt.compare(rawPassword, hashPassword);
  }
}
