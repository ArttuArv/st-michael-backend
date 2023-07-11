const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')
const { connectDB, listenApp } = require('./utils/dbConn')

const path = require('path')
const cookieParser = require('cookie-parser')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const beerRouter = require('./controllers/beer')
const categoriesRouter = require('./controllers/categories')
const whiskyRouter = require('./controllers/whisky')
const whiskyAreasRouter = require('./controllers/whiskyAreas')
const openingHoursRouter = require('./controllers/openingHours')
const whiskyCsvRouter = require('./controllers/whiskyCsvToMongo')
const liveMusicRouter = require('./controllers/liveMusic')
const refreshRouter = require('./controllers/refresh')
const logoutRouter = require('./controllers/logout')

const { PORT } = require('./utils/config')

const logger = require('./utils/logger')
const { 
  requestLogger, 
  unknownEndpoint, 
  errorHandler, 
  tokenExtractor, 
  userExtractor, 
  credentials, 
} = require('./utils/middleware')
const corrsOptions = require('./utils/corsOptions')

const frontSendFile = (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
}

connectDB()

// Dev
app.use(credentials)
app.use(cors(corrsOptions))

// Prod
// app.use(cors({
//   origin: './build',
// }))

app.use(express.json())
app.use(cookieParser())
app.use(express.static('build'))
app.use(express.static(path.resolve(__dirname, 'public')))


// Routes and middlewares
app.use('/api/login', loginRouter)
app.use('/api/refresh', refreshRouter)
app.use('/api/logout', logoutRouter)

app.use(requestLogger)
app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/users', usersRouter)
app.use('/api/beer', beerRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/whisky', whiskyRouter)
app.use('/api/whiskyareas', whiskyAreasRouter)
app.use('/api/csv', whiskyCsvRouter)
app.use('/api/openinghours', openingHoursRouter)
app.use('/api/livemusic', liveMusicRouter)

// Frontend Routes
app.get('/', (req, res) => {
  frontSendFile(req, res)
})
app.get('/login', (req, res) => {
  frontSendFile(req, res)
})
app.get('/admin', (req, res) => {
  frontSendFile(req, res)
})
app.get('/beer', (req, res) => {
  frontSendFile(req, res)
})
app.get('/whisky', (req, res) => {
  frontSendFile(req, res)
})
app.get('/story', (req, res) => {
  frontSendFile(req, res)
})
app.get('/sports', (req, res) => {
  frontSendFile(req, res)
})
app.get('*', (req, res) => {
  frontSendFile(req, res)
})

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

listenApp(app)

module.exports = app