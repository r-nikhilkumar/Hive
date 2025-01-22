const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const createUserLoader = require("./dataloader");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: { userLoader: createUserLoader() },
  introspection: true,
  playground: true,
});

module.exports = {
  apolloServer,
  createUserLoader,
};
