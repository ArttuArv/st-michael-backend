const logger = require('./logger')
const jwt = require('jsonwebtoken')
const allowedOrigins = require('./allowedOrigins')
require('dotenv').config()

const credentials = (request, response, next) => {
  const origin = request.headers.origin

  if (allowedOrigins.includes(origin)) {
    response.header('Access-Control-Allow-Credentials', true)
  }
  next()
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('DateTime: ', new Date().toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' }))
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  } else if(error.name === 'MulterError') {
    return response.status(400).json({ error: `error handling csv file. ${error.message}` })
  }

  next(error)
}

// JWT generator and middlewares
const generateAccessToken = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  return jwt.sign(
    userForToken,
    process.env.ACCESS_TOKEN_SECRET,
    { 
      expiresIn: '10s' 
    })
}

const generateRefreshToken = (user) => {

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const refreshToken = jwt.sign(
    userForToken,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return refreshToken;
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

const userExtractor = (request, response, next) => {
  if (request.token) {
    jwt.verify(request.token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return response.status(401).json({ error: 'invalid token' })
      } else {
        request.user = decoded
      }
    })
  }
  next()
}

const verifyJWT = (request, response, next) => {
  const authHeader = request.headers['authorization']

  if (!authHeader) {
    return response.status(401)
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return response.status(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      return response.status(403)
    }

    request.user = user
    next()
  })
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  generateAccessToken,
  generateRefreshToken,
  tokenExtractor,
  userExtractor,
  verifyJWT,
  credentials
}