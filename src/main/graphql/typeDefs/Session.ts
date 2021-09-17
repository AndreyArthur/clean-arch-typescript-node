import { gql } from 'apollo-server-express';

export const SessionTypeDefs = gql`
  type Session {
    user: User!
    token: String!
  }

  extend type Mutation {
    createSession(username: String!, password: String!): Session!
  }
`;
