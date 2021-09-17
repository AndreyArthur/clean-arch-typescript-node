import { CreateSessionControllerFactory } from '@/infra/factories';
import { GraphQLResolverControllerConverter } from '@/main/converters';

const createSession = GraphQLResolverControllerConverter.convert(
  CreateSessionControllerFactory.create(),
);

export const SessionResolvers = {
  Mutation: {
    createSession,
  },
};
