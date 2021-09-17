import { CreatePostControllerFactory } from '@/infra/factories';
import { GraphQLResolverControllerConverter } from '@/main/converters';

const createPost = GraphQLResolverControllerConverter.convert(
  CreatePostControllerFactory.create(),
);

export const PostResolvers = {
  Mutation: {
    createPost,
  },
};
