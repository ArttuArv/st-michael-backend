require('dotenv').config()

const User = require('../models/user')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).end()
  }

  const users = await User.find({}).populate()
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!request.user) return response.status(401).end()

  if (!username || !password) return response.status(400).json({ error: 'username and password required' })

  const existingUser = await User.findOne({ username }).exec()

  if (existingUser) return response.status(409).json({ error: 'username must be unique' })  

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name: name === undefined ? username : (name || name === '') ? username : name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
  
})

usersRouter.put('/', async (request, response) => {
  const { username, password } = request.body
  
  if (!request.user) {
    return response.status(401).end()
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const userUpdate = {
    username,
    passwordHash,
  }

  const id = await User.findOne({ username }).exec()
  const updatedUser = await User.findByIdAndUpdate(id, userUpdate, { new: true }).exec()

  response.status(201).json(updatedUser)
})

usersRouter.delete('/:id', async (request, response) => {

  if (!request.user) {
    return response.status(401).end()
  }

  User.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = usersRouter