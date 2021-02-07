import { Crypt } from 'modules/auth/crypt';
import { ValueTransformer } from 'typeorm';

export class PasswordTransformer implements ValueTransformer {
  from(value: string) {
    return value;
  }

  async to(value: string) {
    return await Crypt.hashString(value);
  }
}
