const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // Toimii 7.8.2022

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  name: {
    type: String,
    required: false,
    minlength: 3
  },
  passwordHash: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: false
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User