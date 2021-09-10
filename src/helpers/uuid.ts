import { string } from '@/helpers';

export const uuid = {
  v4: () => {
    const chars = 'abcdef0123456789';

    return `${
      string.random(chars, 8)
    }-${
      string.random(chars, 4)
    }-${
      string.random(chars, 4)
    }-${
      string.random(chars, 4)
    }-${
      string.random(chars, 12)
    }`
  },
};
