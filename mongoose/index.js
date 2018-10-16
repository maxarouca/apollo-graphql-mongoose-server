const mongoose = require('mongoose')


const bookSchema = mongoose.Schema({
  title: { type: String },
  author: { type: String }
}) // Defining the collection is redundant in this case. 

const bookModel = mongoose.model('book', bookSchema)

module.exports = bookModel