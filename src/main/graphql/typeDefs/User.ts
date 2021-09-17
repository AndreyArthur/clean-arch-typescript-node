import { gql } from 'apollo-server-express';

export const UserTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    createUser(username: String!, password: String!): User!
  }
`;
