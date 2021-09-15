import { User, Session, Post } from '@/core/entities';

type Data = {
  users: User[];
  sessions: Session[];
  posts: Post[];
};

export const data: Data = {
  users: [],
  sessions: [],
  posts: [],
};
