const openingHoursRouter = require('express').Router()
const openinghoursDao = require('../daos/openinghoursdao')

openingHoursRouter.get('/', async (request, response) => {
  const openingHours = await openinghoursDao.getOpeningHours()
  response.json(openingHours)
})

openingHoursRouter.post('/', async (request, response) => {  

  if (!request.user) {
    return response.status(401)
  }

  const savedOpeningHour = await openinghoursDao.createOpeningHours(request)
  response.status(201).json(savedOpeningHour)
})

openingHoursRouter.put('/:id', async (request, response) => { 

  if (!request.user) {
    return response.status(401).end()
  }

  const updatedOpeningHour = await openinghoursDao.updateOpeningHours(request)
  response.status(201).json(updatedOpeningHour)
})

openingHoursRouter.delete('/:id', async (request, response) => {

  if (!request.user) 
    return response.status(401).end()

  const hoursToDelete = await openinghoursDao.getOpeningHoursById(request.params.id)

  if (!hoursToDelete)
    return response.status(404).json({ error: 'opening hours not found' })

  await openinghoursDao.deleteOpeningHours(request)
  response.status(204).end()    
})

module.exports = openingHoursRouter