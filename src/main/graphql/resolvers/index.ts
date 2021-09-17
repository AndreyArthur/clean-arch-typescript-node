import { UserResolvers } from '@/main/graphql/resolvers/User';
import { BaseResolvers } from '@/main/graphql/resolvers/Base';

export {
  UserResolvers,
  BaseResolvers,
};
export default { ...UserResolvers, ...BaseResolvers };
