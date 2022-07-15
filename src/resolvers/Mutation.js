const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("./../utils");

const post = (parent, args, context) => {
  const { userId } = context;
  const newLink = context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: { id: userId }
      }
    }
  });
  context.pubsub.publish("NEW_LINK", newLink);
  return newLink;
};

const updateLink = (parent, args, context) => {
  const updatedlink = context.prisma.link.update({
    where: {
      id: parseInt(args.id)
    },
    data: {
      url: args.url,
      description: args.description
    }
  });

  return updatedlink;
};

const deleteLink = (parent, args, context) => {
  const deletedLink = context.prisma.link.delete({
    where: {
      id: args.id
    }
  });

  return deletedLink;
};

//vote

async function vote(parent, args, context, info) {
  // 1
  const userId = context.userId;

  // 2
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId
      }
    }
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  // 3
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } }
    }
  });
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

// signup

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password
    }
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}
//login
async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: {
      email: args.email
    }
  });

  if (!user) {
    throw new Error("No such user find");
  }

  const match = await bcrypt.compare(args.password, user.password);

  if (!match) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

module.exports = {
  post,
  updateLink,
  deleteLink,
  signup,
  login,
  vote
};
