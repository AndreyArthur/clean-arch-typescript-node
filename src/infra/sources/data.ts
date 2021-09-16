import { Post } from '@/core/entities';
import { SessionModel, UserModel } from '@/application/models';

type Data = {
  users: UserModel[];
  sessions: SessionModel[];
  posts: Post[];
};

export const data: Data = {
  users: [],
  sessions: [],
  posts: [],
};
