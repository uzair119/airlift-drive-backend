import * as bcrypt from 'bcrypt';
import {UnauthorizedException} from "@nestjs/common";

export class Crypt {
  static saltRounds = 10;

  static async hashString(input: string): Promise<string> {
    return await bcrypt.hash(input, this.saltRounds);
  }

  static async compare(plainString: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainString, hash);
  }

  static async validateHash(hash: string, password: string): Promise<boolean> {
    const response = await Crypt.compare(password, hash);
    if (!response) {
      throw new UnauthorizedException();
    }
    return response;
  }

  static async validateHashForIntellicon(hash: string): Promise<boolean> {
    if (!hash) {
      throw new UnauthorizedException('auth token not provided');
    }
    const apiKey: string = 'Intellicon';
    const response = await Crypt.compare(apiKey, hash);
    if (!response) {
      throw new UnauthorizedException();
    }
    return response;
  }

}
