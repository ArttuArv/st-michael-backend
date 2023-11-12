const logoutRouter = require('express').Router()
const userSql = require('../models/user')

logoutRouter.get('/', async (request, response) => {

  const cookies = request.cookies
  if (!cookies?.refreshToken) 
    return response.status(404).send({ message: 'no refresh token' })

  const refreshToken = cookies.refreshToken
  let user = null

  try {
    user = await userSql.getUserByRefreshToken(refreshToken)
  } catch (err) {
    response.status(400).json({ error: 'user not found', message: err.message });
  }

  if (!user) {
    response.clearCookie('refreshToken', { 
      httpOnly: true, 
      sameSite: 'none',
      secure: true
    })

    return response.status(404).send({ message: 'no user found' })
  }

  const updatedUser = {
    id: user.id,
    username: user.username,
    password: user.password,
    refreshToken: null,
  }

  // Save refresh token to database
  await userSql.updateUser(updatedUser, (err, result) => {
    if (err) {
      return response.status(404).json({ error: err.message })
    }
    return result
  })

  response.clearCookie('refreshToken', { 
    httpOnly: true, 
    sameSite: 'none',
    secure: true
  }) // secure: true, sameSite: 'none' for https

  response.status(200).send({ message: 'Logged out'})
})

module.exports = logoutRouter