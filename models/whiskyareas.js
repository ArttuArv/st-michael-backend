const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const whiskyAreaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  whiskies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Whisky'
    }
  ],
})

whiskyAreaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

whiskyAreaSchema.plugin(uniqueValidator)

const WhiskyArea = mongoose.model('WhiskyArea', whiskyAreaSchema)

module.exports = WhiskyArea