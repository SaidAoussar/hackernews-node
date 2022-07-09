const path = require("path");
const fs = require("fs");
const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
//resolvers
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");

const { getUserId } = require("./utils");

// initiate instance of PrismaClient
const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
  User,
  Link
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`server is running on ${url}`);
});

// https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e
// https://www.freecodecamp.org/news/synchronous-vs-asynchronous-in-javascript/
