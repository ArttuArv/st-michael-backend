const jwt = require('jsonwebtoken')
const refreshRouter = require('express').Router()
const User = require('../models/user')
const { generateAccessToken } = require('../../utils/middleware')

refreshRouter.get('/', async (request, response) => {
  const cookies = request.cookies

  if (!cookies?.refreshToken) return response.status(401).send('UNAUTHORIZED')

  const refreshToken = cookies.refreshToken

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (error, decoded) => {
      if (error) return response.status(403).send('FORBIDDEN')

      const foundUser = await User.findOne({ username: decoded.username }).exec()

      if (!foundUser) return response.status(401).send('UNAUTHORIZED')

      const accessToken = generateAccessToken(foundUser)

      response.status(200).send({ accessToken })

    }
  )
})

module.exports = refreshRouter
