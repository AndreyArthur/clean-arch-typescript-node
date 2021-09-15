import { Post } from '@/core/entities';

export type PostsRepositoryCreateDTO = {
  userId: string;
  content: string;
  title: string;
};

export interface PostsRepository {
  create: ({ userId, content, title }: PostsRepositoryCreateDTO) => Post;
  save: (post: Post) => Promise<void>;
  findManyByUserId: (userId: string) => Promise<Post[]>;
}
