import { Post } from '@/core/entities';

export interface ListPosts {
  execute: (userId: string) => Promise<Post[]>;
}
