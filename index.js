const mongoose = require('mongoose')
const mongo = 'mongodb://fotontech:fotontech123@ds037468.mlab.com:37468/fotontech'
const { ApolloServer, gql } = require('apollo-server');
// const bookModel = require('./mongoose')



const bookSchema = mongoose.Schema({
  title: { type: String },
  author: { type: String }
}) // Defining the collection is redundant in this case. 

const bookModel = mongoose.model('book', bookSchema)

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
// const books = [
//   {
//     title: 'Harry Potter and the Chamber of Secrets',
//     author: 'J.K. Rowling',
//   },
//   {
//     title: 'Jurassic Park',
//     author: 'Michael Crichton',
//   },
// ];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }

  type Mutation{
    createBook(title: String!, author: String!): Book!
  }

`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => bookModel.find(),
  },
  Mutation:{
    createBook: (parent, args, { bookModel }) => bookModel.create(args)
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs, resolvers, context: ({ req }) => ({
    bookModel
  }) });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
mongoose.connect(mongo, { useNewUrlParser: true } ).then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
})
