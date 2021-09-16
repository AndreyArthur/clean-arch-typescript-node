import { Session, Post } from '@/core/entities';
import { UserModel } from '@/application/models';

type Data = {
  users: UserModel[];
  sessions: Session[];
  posts: Post[];
};

export const data: Data = {
  users: [],
  sessions: [],
  posts: [],
};
