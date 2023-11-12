const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const whiskySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  area: {
    type: String,
    required: true,
    minlength: 3
  },
  price: {
    type: String,
    required: false,
    minlength: 1
  },
})

whiskySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

whiskySchema.plugin(uniqueValidator)

const Whisky = mongoose.model('Whisky', whiskySchema)

module.exports = Whisky