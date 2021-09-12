import bcrypt from 'bcrypt';

import { EncrypterProvider } from '@/application/providers';

export class EncrypterAdapter implements EncrypterProvider {
  public async hash(text: string): Promise<string> {
    const hash = await bcrypt.hash(text, 10);

    return hash;
  }

  public async compare(text: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(text, hash);

    return result;
  }
}
