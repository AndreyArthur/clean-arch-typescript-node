import { gql } from 'apollo-server-express';

export const BaseTypeDefs = gql`
  type Query {
    _: String
  }
`;
