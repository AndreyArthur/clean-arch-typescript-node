import { User } from '@/core/entities';
import { date, string, uuid } from '@/infra/helpers';

const username = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  return string.random(chars, 8);
};

const password = (): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  return `${string.random(alphabet, 4)}${string.random(numbers, 4)}`;
};

const bcrypt = (): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const chars = `${alphabet}${alphabet.toUpperCase()}${numbers}`;

  return `$2b$10$${string.random(chars, 53)}`;
};

const user = (
  givenUser?: Partial<User>,
): User => ({
  id: givenUser?.id || uuid.v4(),
  username: givenUser?.username || username(),
  password: givenUser?.password || bcrypt(),
  createdAt: givenUser?.createdAt || date.utc(),
  updatedAt: givenUser?.updatedAt || date.utc(),
});

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
  user,
  content,
  sha256,
};
