const jwt = require('jsonwebtoken')
const refreshRouter = require('express').Router()
const User = require('../models/user')
const { generateAccessToken, generateRefreshToken } = require('../utils/middleware')

refreshRouter.get('/', async (request, response) => {
  const cookies = request.cookies

  if (!cookies?.refreshToken) {
    return response.sendStatus(401)
  }

  const refreshToken = cookies.refreshToken

  const user = await User.findOne({ refreshToken: refreshToken })

  if (!user) {
    return response.sendStatus(403)
  }

  jwt.verify(
    refreshToken, 
    process.env.REFRESH_TOKEN_SECRET, 
    (error, decoded) => {
      if (error || user.username !== decoded.username) {
        return response.sendStatus(403)
      }

      const accessToken = generateAccessToken(user)

      response.status(200).send({ accessToken })
    }
  )
})

module.exports = refreshRouter
