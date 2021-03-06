import { gql } from 'apollo-server-express';

export const PostTypeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    posts: [Post!]!
  }

  extend type Mutation {
    createPost(title: String!, content: String!): Post!
    updatePost(id: String!, title: String, content: String): Post!
    deletePost(id: String!): String
  }
`;
