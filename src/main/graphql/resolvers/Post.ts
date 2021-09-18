import {
  CreatePostControllerFactory,
  ListPostsControllerFactory,
  UpdatePostControllerFactory,
} from '@/infra/factories';
import { GraphQLResolverControllerConverter } from '@/main/converters';

const createPost = GraphQLResolverControllerConverter.convert(
  CreatePostControllerFactory.create(),
);
const updatePost = GraphQLResolverControllerConverter.convert(
  UpdatePostControllerFactory.create(),
);
const posts = GraphQLResolverControllerConverter.convert(
  ListPostsControllerFactory.create(),
);

export const PostResolvers = {
  Mutation: {
    createPost,
    updatePost,
  },
  Query: {
    posts,
  },
};
