const logoutRouter = require('express').Router()
const userSql = require('../models/user')

logoutRouter.get('/', async (request, response) => {

  const cookies = request.cookies
  if (!cookies?.refreshToken) 
    return response.status(404).send({ message: 'no refresh token' })

  const refreshToken = cookies.refreshToken

  const user = await userSql.getUserByRefreshToken(refreshToken)

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
    refreshToken: null,
  }

  // Save refresh token to database
  await userSql.updateUserRefreshToken(updatedUser)

  response.clearCookie('refreshToken', { 
    httpOnly: true, 
    sameSite: 'none',
    secure: true
  }) // secure: true, sameSite: 'none' for https

  response.status(200).send({ message: 'Logged out'})
})

module.exports = logoutRouter