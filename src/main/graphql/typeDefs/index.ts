import { BaseTypeDefs } from '@/main/graphql/typeDefs/Base';
import { UserTypeDefs } from '@/main/graphql/typeDefs/User';
import { SessionTypeDefs } from '@/main/graphql/typeDefs/Session';
import { PostTypeDefs } from '@/main/graphql/typeDefs/Post';

export {
  UserTypeDefs,
  BaseTypeDefs,
  SessionTypeDefs,
  PostTypeDefs,
};

export default [BaseTypeDefs, UserTypeDefs, SessionTypeDefs, PostTypeDefs];
