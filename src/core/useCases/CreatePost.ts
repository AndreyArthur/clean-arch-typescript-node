import { Post } from '@/core/entities';

export type CreatePostDTO = {
  title: string;
  content: string;
  userId: string;
};

export interface CreatePost {
  execute: ({ userId, title, content }: CreatePostDTO) => Promise<Post>;
}
