import crypto from 'crypto';

const random = (chars: string, length: number): string => {
  let result = '';
  const charactersLength = chars.length;

  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const string = {
  random,
  sha256: (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const hasher = crypto.createHmac('sha256', random(chars, 10));
    const hash = hasher.update(random(chars, 10)).digest('hex');

    return hash;
  },
};
