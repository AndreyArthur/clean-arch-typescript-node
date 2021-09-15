import {
  PostsRepository,
  PostsRepositoryCreateDTO,
} from '@/application/repositories';
import { Post } from '@/core/entities';
import { date, uuid } from '@/infra/helpers';
import { data } from '@/infra/sources';

export class PostsRepositoryMemory implements PostsRepository {
  public create({ userId, title, content }: PostsRepositoryCreateDTO): Post {
    return {
      id: uuid.v4(),
      content,
      title,
      userId,
      createdAt: date.utc(),
      updatedAt: date.utc(),
    };
  }

  public async save(post: Post): Promise<void> {
    await Promise.resolve(data.posts.push(post));
  }

  public async findManyByUserId(userId: string): Promise<Post[]> {
    const posts = await Promise.resolve(
      data.posts.filter((post) => post.userId === userId),
    );

    return posts;
  }
}
