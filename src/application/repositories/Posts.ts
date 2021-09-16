import { Post } from '@/core/entities';

export type PostsRepositoryCreateDTO = {
  userId: string;
  content: string;
  title: string;
};

export type PostsRepositoryFindByUserIdAndIdDTO = {
  userId: string;
  id: string;
};

export type PostsRepositoryUpdateByIdDTO = {
  title?: string;
  content?: string;
};

export interface PostsRepository {
  create: ({ userId, content, title }: PostsRepositoryCreateDTO) => Post;
  save: (post: Post) => Promise<void>;
  findManyByUserId: (userId: string) => Promise<Post[]>;
  findByUserIdAndId: (
    { userId, id }: PostsRepositoryFindByUserIdAndIdDTO
  ) => Promise<Post | null>;
  updateById: (
    id: string, post: PostsRepositoryUpdateByIdDTO
  ) => Promise<void>;
  findById: (id: string) => Promise<Post | null>;
}
