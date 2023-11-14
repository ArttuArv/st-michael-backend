const usersRouter = require('express').Router()
const usersSql = require('../models/user')

usersRouter.get('/', (request, response) => {

  if (!request.user) 
    return response.status(401).end()

  usersSql.getAllUsers((err, result) => {
    if (err) {
      return response.status(404).json({ error: err.message })
    }
    response.json(result)
  })
})

usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  if (!request.user) 
    return response.status(401).end()

  if (!username || !password) {
    return response.status(400).json({ error: 'content missing' })
  }

  const newUser = {
    username,
    password,
  }

  try {
    const result = await usersSql.createUser(newUser)
    response.status(201).json({ id: result.insertId, username: newUser.username })
  } catch (err) {
    response.status(400).json({ error: 'user not created', message: err.message })
  }
})

usersRouter.put('/', async (request, response) => {
  const { username, password } = request.body

  if (!request.user) 
    return response.status(401).end()

  if (!username || !password) {
    return response.status(400).json({ error: 'content missing' })
  }

  const user = {
    username,
    password,
  }

  try {
    await usersSql.updateUser(user)
    response.status(201).end()
  } catch (err) {
    response.status(400).json({ error: 'user not updated', message: err.message })
  }
})

usersRouter.delete('/:id', (request, response) => {

  if (!request.user) 
    return response.status(401).end()
  
  usersSql.deleteUser(request.params.id, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'user not deleted', message: err.message })
    }
    response.status(204).end()
  })
})

module.exports = usersRouter