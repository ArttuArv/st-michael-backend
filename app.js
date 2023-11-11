const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const { connectDB, listenApp } = require('./utils/dbConn')
const path = require('path')

// v1 routes
const usersRouter = require('./v1/controllers/users')
const loginRouter = require('./v1/controllers/login')
const beerRouter = require('./v1/controllers/beer')
const categoriesRouter = require('./v1/controllers/categories')
const whiskyRouter = require('./v1/controllers/whisky')
const whiskyAreasRouter = require('./v1/controllers/whiskyAreas')
const openingHoursRouter = require('./v1/controllers/openingHours')
const whiskyCsvRouter = require('./v1/controllers/whiskyCsvToMongo')
const liveMusicRouter = require('./v1/controllers/liveMusic')
const refreshRouter = require('./v1/controllers/refresh')
const logoutRouter = require('./v1/controllers/logout')

// v2 routes
const usersRouterV2 = require('./v2/controllers/user')
const beerRouterV2 = require('./v2/controllers/beer')
const whiskyCsvRouterV2 = require('./v2/controllers/whiskyCsv')
const whiskyRouterV2 = require('./v2/controllers/whisky')
const liveEventsRouterV2 = require('./v2/controllers/liveEvents')
const openingHoursRouterV2 = require('./v2/controllers/openinghours')

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
// app.use(credentials)
// app.use(cors(corrsOptions))

// Prod
app.use(cors({
  origin: './build',
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.static('build'))
app.use(express.static(path.resolve(__dirname, 'public')))


// Routes and middlewares
app.use('/api/v1/login', loginRouter)
app.use('/api/v1/refresh', refreshRouter)
app.use('/api/v1/logout', logoutRouter)

app.use(requestLogger)
app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/v1/users', usersRouter)
app.use('/api/v1/beer', beerRouter)
app.use('/api/v1/categories', categoriesRouter)
app.use('/api/v1/whisky', whiskyRouter)
app.use('/api/v1/whiskyareas', whiskyAreasRouter)
app.use('/api/v1/csv', whiskyCsvRouter)
app.use('/api/v1/openinghours', openingHoursRouter)
app.use('/api/v1/livemusic', liveMusicRouter)

// Upcoming v2 routes
app.use('/api/v2/users', usersRouterV2)
app.use('/api/v2/beer', beerRouterV2)
app.use('/api/v2/whisky', whiskyRouterV2)
app.use('/api/v2/csv', whiskyCsvRouterV2)
app.use('/api/v2/openinghours', openingHoursRouterV2)
app.use('/api/v2/livemusic', liveEventsRouterV2)

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