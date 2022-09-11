const testingRouter = require('express').Router()

const User = require('../models/user')
const Beer = require('../models/beer')
const Whisky = require('../models/whisky')
const Whiskies = require('../models/whiskyareas')
const OpeningHours = require('../models/openingHours')

testingRouter.post('/reset', async (request, response) => {
  await User.deleteMany({})
  await Beer.deleteMany({})
  await Whisky.deleteMany({})
  await Whiskies.deleteMany({})
  await OpeningHours.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter