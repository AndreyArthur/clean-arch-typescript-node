import { BaseTypeDefs } from '@/main/graphql/typeDefs/Base';
import { UserTypeDefs } from '@/main/graphql/typeDefs/User';
import { SessionTypeDefs } from '@/main/graphql/typeDefs/Session';

export {
  UserTypeDefs,
  BaseTypeDefs,
  SessionTypeDefs,
};

export default [BaseTypeDefs, UserTypeDefs, SessionTypeDefs];
