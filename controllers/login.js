const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { generateAccessToken, generateRefreshToken } = require('../utils/middleware')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const token = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  // Save refresh token to database
  await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken }, { new: true })

  response.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) // secure: true, sameSite: 'none' for https

  response.status(200).send({ access: token, name: user.name })

})


module.exports = loginRouter