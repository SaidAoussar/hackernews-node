const path = require("path");
const fs = require("fs");
const { ApolloServer } = require("apollo-server");
const { Prisma } = require("@prisma/client");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

console.log("length: ", links.length);

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => {
      let link = links.find((link) => link.id == args.id);
      return link;
    }
  },
  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;
      const link = {
        id: `link-${idCount++}`,
        url: args.url,
        description: args.description
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const linkIndex = links.findIndex((link) => args.id === link.id);
      links[linkIndex].url = args.url;
      links[linkIndex].description = args.description;

      return links[linkIndex];
    },
    deleteLink: (parent, args) => {
      const indexDeleteLink = links.findIndex((link) => args.id === link.id);
      const deletedLink = links[indexDeleteLink];
      console.log(indexDeleteLink);
      if (indexDeleteLink < 0) {
        return null;
      }
      if (links.splice(indexDeleteLink, 1)) {
        return deletedLink;
      }
    }
  }
};

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`server is running on ${url}`);
});

// https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e
// https://www.freecodecamp.org/news/synchronous-vs-asynchronous-in-javascript/
