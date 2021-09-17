import { CreateUserControllerFactory } from '@/infra/factories';
import { GraphQLResolverControllerConverter } from '@/main/converters';

const createUser = GraphQLResolverControllerConverter.convert(
  CreateUserControllerFactory.create(),
);

export const UserResolvers = {
  Mutation: {
    createUser,
  },
};
