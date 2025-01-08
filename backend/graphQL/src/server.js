require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./typedefs/typedefs");
const resolvers = require("./resolvers/resolvers");

const app = express();
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});
server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`GraphQL server running on port ${PORT}`);
  console.log(`GraphQL endpoint: ${server.graphqlPath}`);
});
