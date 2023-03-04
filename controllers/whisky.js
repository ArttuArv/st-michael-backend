const Whisky = require('../models/whisky')
const WhiskyAreas = require('../models/whiskyareas')
const whiskyRouter = require('express').Router()

whiskyRouter.get('/', async (request, response) => {
  const whiskies = await Whisky.find({}).populate()
  response.json(whiskies)
})

whiskyRouter.get('/:id', async (request, response) => {
  const whisky = await Whisky.findById(request.params.id)

  if (!whisky)
    response.status(404).json({ message: 'Whisky not found' })

  response.json(whisky)
})

whiskyRouter.post('/', async (request, response) => {
  const { name, area, price, } = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  } else {
    const whiskyArea = await WhiskyAreas.findOne({ name: area })

    if (!whiskyArea) {
      const whiskyAreas = new WhiskyAreas({
        name: area,
      })
      await whiskyAreas.save();
    }

    const newWhiskyArea = await WhiskyAreas.findOne({ name: area })

    const whisky = new Whisky({
      name,
      area,
      price,
    })

    const savedWhisky = await whisky.save()
  
    newWhiskyArea.whiskies = newWhiskyArea.whiskies.concat(savedWhisky._id)
    await newWhiskyArea.save();

    response.status(201).json(savedWhisky)
  }
})

whiskyRouter.delete('/:id', async (request, response) => {
  const whiskyToDelete = await Whisky.findById(request.params.id)

  if (whiskyToDelete) {
    if (request.user) {
      await Whisky.findByIdAndRemove(request.params.id)

      const whiskyArea = await WhiskyAreas.findOne({ name: whiskyToDelete.area })
      whiskyArea.whiskies = whiskyArea.whiskies.filter(whisky => whisky !== whiskyToDelete._id)
      await whiskyArea.save()

      response.status(204).end()
    }
  } else {
    response.status(404).json({ error: 'whisky not found' })
  }
})

whiskyRouter.put('/:id', async (request, response) => {
  const { name, area, price, } = request.body

  if (!request.user)
    return response.status(401).json({ error: 'Token missing or invalid' })

  const whisky = {
    name,
    area,
    price,
  }

  const updatedWhisky = await Whisky.findByIdAndUpdate(request.params.id, whisky, { new: true })

  response.status(201).json(updatedWhisky)
})

module.exports = whiskyRouter