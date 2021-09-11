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

const title = (): string => {
  const chars = 'abcdef ';

  return string.random(chars, 20);
};

const content = (): string => {
  const chars = 'abcdef ';

  return string.random(chars, 64);
};

const sha256 = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  return string.random(chars, 64);
};

export const generators = {
  username,
  password,
  title,
  content,
  sha256,
};
