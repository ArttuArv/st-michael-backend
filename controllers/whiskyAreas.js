const WhiskyAreas = require('../models/whiskyareas')
const whiskyAreasRouter = require('express').Router()

whiskyAreasRouter.get('/', async (request, response) => {
  const whiskyAreas = await WhiskyAreas.find({}).populate('whiskies', { name: 1, style: 1, country: 1, price: 1, category: 1 })
  response.json(whiskyAreas)
})

whiskyAreasRouter.post('/', async (request, response) => {
  const { name } = request.body

  if (!request.user) {
    return response.status(401).end()
  }

  const whiskyAreas = new WhiskyAreas({
    name,
  })

  const savedWhiskyAreas = await whiskyAreas.save()

  response.status(201).json(savedWhiskyAreas)
})

whiskyAreasRouter.delete('/:id', async (request, response) => {
  const existingWhiskyAreas = await WhiskyAreas.findById(request.params.id)

  if (existingWhiskyAreas) {
    await WhiskyAreas.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'whisky area not found' })
  }
})

module.exports = whiskyAreasRouter;