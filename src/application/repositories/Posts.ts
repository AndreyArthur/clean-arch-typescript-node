import { PostModel } from '@/application/models';

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
  create: ({ userId, content, title }: PostsRepositoryCreateDTO) => PostModel;
  save: (post: PostModel) => Promise<void>;
  findManyByUserId: (userId: string) => Promise<PostModel[]>;
  findByUserIdAndId: (
    { userId, id }: PostsRepositoryFindByUserIdAndIdDTO
  ) => Promise<PostModel | null>;
  updateById: (
    id: string, post: PostsRepositoryUpdateByIdDTO
  ) => Promise<void>;
  findById: (id: string) => Promise<PostModel | null>;
  deleteById: (id: string) => Promise<void>;
}
