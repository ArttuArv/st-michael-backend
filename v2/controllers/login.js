const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const userSql = require('../models/user')
const { generateAccessToken, generateRefreshToken } = require('../../utils/middleware')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  if (!username || !password) {
    return response.status(400).json({ error: 'content missing' })
  }

  const user = await userSql.getUserByUsername(username)

  if (!user) {
    return response.status(401).end()
  }

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const token = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  const updatedUser = {
    id: user.id,
    refreshToken: refreshToken,
  }

  // Save refresh token to database
  await userSql.updateUserRefreshToken(updatedUser, (err, result) => {
    if (err) {
      return response.status(404).json({ error: err.message })
    }
    return result
  })

  response.cookie('refreshToken', refreshToken, { 
    httpOnly: true, 
    maxAge: 24 * 60 * 60 * 1000, 
    sameSite: 'none',
    secure: true
  }) // secure: true, sameSite: 'none' for https

  response.status(200).send({
    access: token,
    name: user.name || 'admin',
  })
})

module.exports = loginRouter