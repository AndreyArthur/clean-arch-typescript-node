import { Post } from '@/core/entities';

export type UpdatePostDTO = {
  id: string;
  userId: string;
  title?: string;
  content?: string;
};

export interface UpdatePost {
  execute: ({
    id, userId, title, content,
  }: UpdatePostDTO) => Promise<Post>;
}
