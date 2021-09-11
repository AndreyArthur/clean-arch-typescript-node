import { User } from '@/entities';

type Session = {
  id: string;
  userId: string;
  token: string;
  expirationTime: number;
};

type Post = {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

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
