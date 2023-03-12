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
  
  if (!request.user) 
    return response.status(401).json({ error: 'Token missing or invalid' })

  const whiskyToDelete = await Whisky.findById(request.params.id)

  if (whiskyToDelete) {
    await Whisky.findByIdAndRemove(request.params.id)

    const whiskyArea = await WhiskyAreas.findOne({ name: whiskyToDelete.area })
    whiskyArea.whiskies = whiskyArea.whiskies.filter(whisky => whisky.toString() !== whiskyToDelete._id.toString())
    await whiskyArea.save()

    response.status(201).json({ message: `Whisky ${whiskyToDelete.name} deleted` })
    
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

  const existingWhisky = await Whisky.findOne({ name: whisky.name })

  if (whisky.name === existingWhisky.name)
    response.status(400).json({ message: 'Whisky already exists'})

  await removeOldEntryFromWhiskyAreas(request)

  const updatedWhisky = await updateWhiskyAndWhiskyArea(whisky, request)  

  response.status(201).json(updatedWhisky)
})

module.exports = whiskyRouter

async function updateWhiskyAndWhiskyArea(whisky, request) {
  const updatedWhiskyArea = await WhiskyAreas.findOne({ name: whisky.area })
  const updatedWhisky = await Whisky.findByIdAndUpdate(request.params.id, whisky, { new: true })
  updatedWhiskyArea.whiskies = updatedWhiskyArea.whiskies.concat(updatedWhisky._id)

  await updatedWhiskyArea.save()

  return updatedWhisky
}

async function removeOldEntryFromWhiskyAreas(request) {

  const oldWhisky = await Whisky.findById(request.params.id)  
  const oldWhiskyArea = await WhiskyAreas.findOne({ name: oldWhisky.area })  
  oldWhiskyArea.whiskies = oldWhiskyArea.whiskies.filter(whisky => whisky.toString() !== oldWhisky._id.toString())

  await oldWhiskyArea.save()
}
