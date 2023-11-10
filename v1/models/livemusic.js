const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const liveMusicSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
    minlength: 3
  },
  date: {
    type: String,
    required: true,
    minlength: 3
  },
  time: {
    type: String,
    required: true,
    minlength: 2
  },
})

liveMusicSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

liveMusicSchema.plugin(uniqueValidator)

const LiveMusic = mongoose.model('LiveMusic', liveMusicSchema)

module.exports = LiveMusic