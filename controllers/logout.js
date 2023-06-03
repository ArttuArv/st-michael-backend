const logoutRouter = require('express').Router()
const User = require('../models/user')

logoutRouter.get('/', async (request, response) => {
  // On client, also delete the access token

  const cookies = request.cookies

  if (!cookies?.refreshToken) 
    return response.status(201).send({ message: 'no refresh token' })

  const refreshToken = cookies.refreshToken
  const user = await User.findOne({ refreshToken: refreshToken }).exec()

  if (!user) {
    response.clearCookie('refreshToken', { 
      httpOnly: true, 
      // sameSite: 'none' 
    })

    return response.status(201).send({ message: 'no user found' })
  }

  await User.findByIdAndUpdate(user._id, { refreshToken: null }, { new: true }).exec()

  console.log('user found and updated')

  response.clearCookie('refreshToken', { 
    httpOnly: true, 
    // sameSite: 'none',
    // secure: true
  }) // secure: true, sameSite: 'none' for https

  response.status(201).send({ message: 'Logged out'})
})

module.exports = logoutRouter
