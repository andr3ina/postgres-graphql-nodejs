const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();

// const authors = [
//   { id: 1, name: "J. K. Rowling" },
//   { id: 2, name: "J. R. R. Tolkien" },
//   { id: 3, name: "Brent Weeks" },
// ];

// const books = [
//   { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
//   { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
//   { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
//   { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
//   { id: 5, name: "The Two Towers", authorId: 2 },
//   { id: 6, name: "The Return of the King", authorId: 2 },
//   { id: 7, name: "The Way of Shadows", authorId: 3 },
//   { id: 8, name: "Beyond the Shadows", authorId: 3 },
// ];
async function getAuthors() {
  const authors = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  return authors;
}
async function getPosts() {
  const posts = await prisma.post.findMany({});
  return posts;
}

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "This represents posts",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: UserType,
      resolve: (post) => {
        return getAuthors();
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "Users",
  description: "This represents users",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (author) => {
        return getPosts();
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    // book: {
    //   type: BookType,
    //   description: "A Single Book",
    //   args: {
    //     id: { type: GraphQLInt },
    //   },
    //   resolve: (parent, args) => books.find((book) => book.id === args.id),
    // },
    posts: {
      type: new GraphQLList(PostType),
      description: "List of All posts",
      resolve: () => posts,
    },
    users: {
      type: new GraphQLList(UserType),
      description: "List of All users",
      resolve: () => getAuthors(),
    },
    // author: {
    //   type: AuthorType,
    //   description: "A Single Author",
    //   args: {
    //     id: { type: GraphQLInt },
    //   },
    //   resolve: (parent, args) =>
    //     authors.find((author) => author.id === args.id),
    // },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addPost: {
      type: PostType,
      description: "Add a post",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const post = {
          id: posts.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        prisma.post.create({
          data: {
            post,
          },
        });
        return post;
      },
    },
    addUser: {
      type: UserType,
      description: "Add an user",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name };
        prisma.user.create({
          data: {
            author,
          },
        });
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

console.log(getAuthors());
app.listen(80, () => console.log("Server Running"));
