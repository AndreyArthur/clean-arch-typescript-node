import {
  CreatePostControllerFactory, ListPostsControllerFactory,
} from '@/infra/factories';
import { GraphQLResolverControllerConverter } from '@/main/converters';

const createPost = GraphQLResolverControllerConverter.convert(
  CreatePostControllerFactory.create(),
);
const posts = GraphQLResolverControllerConverter.convert(
  ListPostsControllerFactory.create(),
);

export const PostResolvers = {
  Mutation: {
    createPost,
  },
  Query: {
    posts,
  },
};
