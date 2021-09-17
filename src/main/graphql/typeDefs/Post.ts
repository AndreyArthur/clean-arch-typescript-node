import { gql } from 'apollo-server-express';

export const PostTypeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Mutation {
    createPost(title: String!, content: String!): Post!
  }
`;
