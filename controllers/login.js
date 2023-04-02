const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { generateAccessToken, generateRefreshToken } = require('../utils/middleware')

const loginAttempts = {}

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const userIp = request.headers['x-forwarded-for'] || request.connection.remoteAddress
  const attempts = loginAttempts[userIp] || 0;

  // console.log('userip: ', userIp)

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)


  if (!(user && passwordCorrect)) {
    loginAttempts[userIp] = attempts + 1

    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const token = generateAccessToken(user)

  const refreshToken = generateRefreshToken(user)

  loginAttempts[userIp] = 0

  response.status(200).send({ access: token, refresh: refreshToken, name: user.name })

})

// loginRouter.post('/refresh', async (request, response) => {

//   const { token } = request.body

//   console.log('token: ', token)

//   if (!token) {
//     return response.status(401).json({
//       error: 'token missing'
//     })
//   }

//   const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

//   if (!decodedToken) {
//     return response.status(401).json({
//       error: 'invalid token'
//     })
//   }

//   const user = await User.findById(decodedToken.id)

//   const newToken = generateAccessToken(user)

//   response.status(200).send({ access: newToken })

// })

module.exports = loginRouter