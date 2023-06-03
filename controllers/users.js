require('dotenv').config()

const User = require('../models/user')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const users = await User.find({}).populate()
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!request.user) return response.status(401).json({ error: 'Token missing or invalid' })

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

usersRouter.put('/:id', async (request, response) => {
  const { username, password } = request.body
  const { id } = request.params
  
  console.log('Body: ', request.body)
  console.log('request.user: ', request.user)

  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = {
    username,
    passwordHash,
  }

  const updatedUser = await User.findByIdAndUpdate(id, user, { new: true })

  response.status(201).json(updatedUser)
})

usersRouter.delete('/:id', async (request, response) => {

  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  User.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = usersRouter