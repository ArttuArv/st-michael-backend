const logoutRouter = require('express').Router()
const User = require('../models/user')

logoutRouter.get('/', async (request, response) => {
  // On client, also delete the access token

  const cookies = request.cookies

  if (!cookies?.refreshToken) {
    return response.sendStatus(204)
  }

  const refreshToken = cookies.refreshToken
  const user = await User.findOne({ refreshToken: refreshToken })

  if (!user) {
    response.clearCookie('refreshToken', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return response.status(204)
  }

  await User.findByIdAndUpdate(user._id, { refreshToken: null }, { new: true })

  response.clearCookie('refreshToken', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) // secure: true, sameSite: 'none' for https

  response.status(204).send()
})

module.exports = logoutRouter
