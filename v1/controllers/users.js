const usersRouter = require('express').Router()
const userDao = require('../daos/userdao')

usersRouter.get('/', async (request, response) => {
  if (!request.user) return response.status(401).end()

  const users = await userDao.getUsers()
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  if (!request.user) return response.status(401).end()
  if (!username || !password) return response.status(400).json({ error: 'username and password required' })

  const responseMsg = await userDao.createUser(request)
  response.status(responseMsg.status).json(responseMsg.message)  
})

usersRouter.put('/', async (request, response) => {
  const { username, password } = request.body
  
  if (!request.user) return response.status(401).end()

  const updatedUser = await userDao.updateUser(username, password, request)
  response.status(201).json(updatedUser)
})

usersRouter.delete('/:id', async (request, response) => {

  if (!request.user) return response.status(401).end()

  await userDao.deleteUser(request.params.id)
  response.status(204).end()
})

module.exports = usersRouter