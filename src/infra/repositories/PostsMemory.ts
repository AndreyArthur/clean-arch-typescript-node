import {
  PostsRepository,
  PostsRepositoryCreateDTO,
  PostsRepositoryFindByUserIdAndIdDTO,
  PostsRepositoryUpdateByIdDTO,
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

  public async findByUserIdAndId(
    { id, userId }: PostsRepositoryFindByUserIdAndIdDTO,
  ): Promise<Post | null> {
    const foundPost = await Promise.resolve(
      data.posts
        .find((post) => (
          (post.userId === userId) && (id === post.id)
        )),
    );

    if (!foundPost) return null;

    return foundPost;
  }

  public async updateById(
    id: string, { content, title }: PostsRepositoryUpdateByIdDTO,
  ):Promise<void> {
    const foundPost = await Promise.resolve(
      data.posts.find((post) => post.id === id),
    );

    if (!foundPost) throw new Error('Post not found.');

    const updatedPost = {
      id: foundPost.id,
      content: content || foundPost.content,
      title: title || foundPost.title,
      userId: foundPost.userId,
      createdAt: foundPost.createdAt,
      updatedAt: date.utc(),
    };

    await Promise.resolve(
      data.posts = data.posts
        .filter((post) => post.id !== foundPost.id),
    );

    await Promise.resolve(data.posts.push(updatedPost));
  }

  public async findById(id: string): Promise<Post | null> {
    const foundPost = await Promise.resolve(
      data.posts.find((post) => post.id === id),
    );

    if (!foundPost) return null;

    return foundPost;
  }
}
