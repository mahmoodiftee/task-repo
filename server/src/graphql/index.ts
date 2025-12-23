import { ApolloServer } from "@apollo/server";
import { Product } from "./product";
import { Transaction } from "./transaction";
import { User } from "./user";

async function createApolloGraphqlServer() {
  const gqpServer = new ApolloServer({
    typeDefs: `
      ${User.typeDefs}
      ${Product.typeDefs}
      ${Transaction.typeDefs}
      
      type Query {
        ${User.queries}
        ${Product.queries}
        ${Transaction.queries}
      }

      type Mutation {
        ${User.mutations}
        ${Product.mutations}
      }`,

    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Product.resolvers.queries,
        ...Transaction.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
        ...Product.resolvers.mutations,
      },
    },
  });

  await gqpServer.start();

  return gqpServer;
}

export default createApolloGraphqlServer;
