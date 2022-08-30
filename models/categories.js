const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // Toimii 7.8.2022

const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beer'
    }
  ],
})

categoriesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

categoriesSchema.plugin(uniqueValidator)

const Categories = mongoose.model('categories', categoriesSchema)

module.exports = Categories