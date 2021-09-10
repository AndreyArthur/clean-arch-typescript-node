import { string } from '@/helpers';

const username = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  return string.random(chars, 8);
};

const password = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  return `${string.random(alphabet, 4)}${string.random(numbers, 4)}`;
};

export const generators = {
  username,
  password,
};
