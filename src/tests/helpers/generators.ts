import { string } from '@/helpers';

const username = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  return string.random(chars, 8);
};

const password = (): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  return `${string.random(alphabet, 4)}${string.random(numbers, 4)}`;
};

const sha256 = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  return string.random(chars, 64);
}

export const generators = {
  username,
  password,
  sha256,
};
