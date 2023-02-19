const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const beerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
    minlength: 3
  },
  style: {
    type: String,
    required: true,
    minlength: 3
  },
  country: {
    type: String,
    required: true,
    minlength: 2
  },
  price: {
    type: String,
    required: false,
    // minlength: 3
  },
  category: {
    type: String,
    required: true,
    minlength: 3
  },
})

beerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

beerSchema.plugin(uniqueValidator)

const Beer = mongoose.model('Beer', beerSchema)

module.exports = Beer