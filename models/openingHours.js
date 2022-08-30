const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const openingHoursSchema = mongoose.Schema({
  day: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  openinghours: {
    type: String,
    required: true,
    minlength: 3
  },
})

openingHoursSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

openingHoursSchema.plugin(uniqueValidator)

const OpeningHours = mongoose.model('OpeningHours', openingHoursSchema)

module.exports = OpeningHours