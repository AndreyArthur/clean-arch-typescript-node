import {
  CreatePostControllerFactory,
  DeletePostControllerFactory,
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
const deletePost = GraphQLResolverControllerConverter.convert(
  DeletePostControllerFactory.create(),
);
const posts = GraphQLResolverControllerConverter.convert(
  ListPostsControllerFactory.create(),
);

export const PostResolvers = {
  Mutation: {
    createPost,
    updatePost,
    deletePost,
  },
  Query: {
    posts,
  },
};
