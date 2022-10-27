import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.create({
    data: {
      title: "test post",
      content: "adding some test content",
      authorId: 1,
    },
  });
  //   await prisma.user.create({
  //     data: {
  //       name: "Alice",
  //       email: "alice@prisma.io",
  //       posts: {
  //         create: { title: "Hello World" },
  //       },
  //       profile: {
  //         create: { bio: "I like turtles" },
  //       },
  //     },
  //   });

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  console.dir(allUsers, { depth: null });
  const allposts = await prisma.post.findMany({});
  console.dir(allposts, { depth: null });
  const allprofiles = await prisma.profile.findMany({});
  console.dir(allprofiles, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
