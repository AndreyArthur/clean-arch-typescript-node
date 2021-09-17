import { gql } from 'apollo-server-express';

export const UserTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Mutation {
    createUser(username: String!, password: String!): User!
  }
`;
