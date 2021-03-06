import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';

import typeDefs from '@/main/graphql/typeDefs';
import resolvers from '@/main/graphql/resolvers';

export const graphql = async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }): any => ({
      req,
      res,
    }),
    formatError: (err): any => {
      try {
        return JSON.parse(err.message);
      } catch {
        return err;
      }
    },
  });

  await server.start();

  server.applyMiddleware({ app });
};
