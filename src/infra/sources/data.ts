import { SessionModel, UserModel, PostModel } from '@/application/models';

type Data = {
  users: UserModel[];
  sessions: SessionModel[];
  posts: PostModel[];
};

export const data: Data = {
  users: [],
  sessions: [],
  posts: [],
};
