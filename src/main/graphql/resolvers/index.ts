import { UserResolvers } from '@/main/graphql/resolvers/User';
import { BaseResolvers } from '@/main/graphql/resolvers/Base';
import { SessionResolvers } from '@/main/graphql/resolvers/Session';

export {
  UserResolvers,
  BaseResolvers,
  SessionResolvers,
};
export default {
  Mutation: {
    ...UserResolvers.Mutation,
    ...BaseResolvers.Mutation,
    ...SessionResolvers.Mutation,
  },
  Query: {
    ...BaseResolvers.Query,
  },
};
