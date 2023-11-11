const bcrypt = require('bcrypt')
const User = require('../models/user')

const getUsers = async () => {
  return await User.find({}).populate()
}

const createUser = async (request) => {
  const { username, name, password } = request.body

  const existingUser = await User.findOne({ username }).exec()

  if (existingUser) return { status: 409, message: 'username must be unique' }  

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  let nameToSave = username
  if (name === undefined) {
    nameToSave = username
  } else if (name || name === '') {
    nameToSave = name
  }

  const user = new User({
    username,
    name: nameToSave,
    passwordHash,
  })

  const savedUser = await user.save()
  return { status: 201, message: savedUser }
}

const updateUser = async (request) => {

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const userUpdate = {
    username,
    passwordHash,
  }

  const id = await User.findOne({ username }).exec()
  const updatedUser = await User.findByIdAndUpdate(id, userUpdate, { new: true }).exec()

  return updatedUser
}

const deleteUser = async (id) => {
  User.findByIdAndRemove(id)
}


module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
}