import { UserResolvers } from '@/main/graphql/resolvers/User';
import { BaseResolvers } from '@/main/graphql/resolvers/Base';
import { SessionResolvers } from '@/main/graphql/resolvers/Session';
import { PostResolvers } from '@/main/graphql/resolvers/Post';

export {
  UserResolvers,
  BaseResolvers,
  SessionResolvers,
  PostResolvers,
};
export default {
  Mutation: {
    ...UserResolvers.Mutation,
    ...BaseResolvers.Mutation,
    ...SessionResolvers.Mutation,
    ...PostResolvers.Mutation,
  },
  Query: {
    ...BaseResolvers.Query,
    ...PostResolvers.Query,
  },
};
