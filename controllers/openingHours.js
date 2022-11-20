const OpeningHours = require('../models/openingHours')
const openingHoursRouter = require('express').Router()

openingHoursRouter.get('/', async (request, response) => {
  const openingHours = await OpeningHours.find({})
  response.json(openingHours)
})

openingHoursRouter.post('/', async (request, response) => {
  const { day, openinghours } = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const openingHour = new OpeningHours({
    day,
    openinghours,
  })

  const savedOpeningHour = await openingHour.save()

  response.status(201).json(savedOpeningHour)
})

openingHoursRouter.put('/:id', async (request, response) => {
  const { day, openinghours } = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const openingHour = {
    day,
    openinghours,
  }

  const updatedOpeningHour = await OpeningHours.findByIdAndUpdate(request.params.id, openingHour, { new: true })

  response.status(201).json(updatedOpeningHour)
})

openingHoursRouter.delete('/:id', async (request, response) => {
  const hoursToDelete = await OpeningHours.findById(request.params.id)

  if (!hoursToDelete) {
    return response.status(404).json({ error: 'opening hours not found' })
  } else {
    if (request.user) {
      await OpeningHours.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(401).json({ error: 'Token missing or invalid' })
    }    
  }  
})

module.exports = openingHoursRouter