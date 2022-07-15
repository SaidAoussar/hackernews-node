const path = require("path");
const fs = require("fs");
const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { PubSub } = require("apollo-server");
//resolvers
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Vote = require("./resolvers/Vote");

const { getUserId } = require("./utils");

// creating an instance of PrismaClient
const prisma = new PrismaClient();

// creating an instance of PubSub
const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`server is running on ${url}`);
});

// https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e
// https://www.freecodecamp.org/news/synchronous-vs-asynchronous-in-javascript/
//https://www.apollographql.com/blog/graphql/pagination/understanding-pagination-rest-graphql-and-relay/
