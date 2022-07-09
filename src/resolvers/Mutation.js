const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("./../utils");

const post = (parent, args, context) => {
  const { userId } = context;
  const link = context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: { id: userId }
      }
    }
  });
  return link;
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
  login
};
