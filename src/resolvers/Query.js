const feed = (parent, args, context) => {
  const allLinks = context.prisma.link.findMany();
  return allLinks;
};

const link = (parent, args, context) => {
  const link = context.prisma.link.findUnique({
    where: {
      id: parseInt(args.id)
    }
  });
  return link;
};

module.exports = {
  feed,
  link
};
