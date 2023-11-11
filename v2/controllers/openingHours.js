const openingHoursRouter = require('express').Router()
const openingHoursSql = require('../models/openinghours')
const { addWhiteSpacesAroundHyphen } = require('../../utils/stringManipulation')

openingHoursRouter.get('/', (request, response) => {
  openingHoursSql.getAllOpeningHours((err, result) => {
    if (err) {
      return response.status(404).json({ error: err.message })
    }
    response.json(result)
  })
})

openingHoursRouter.post('/', (request, response) => {
  let { day, openinghours} = request.body

  if (!day || !openinghours) {
    return response.status(400).json({ error: 'content missing' })
  }

  day = addWhiteSpacesAroundHyphen(day)
  openinghours = addWhiteSpacesAroundHyphen(openinghours)

  const newOpeningHours = {
    day,
    openinghours,
  }

  openingHoursSql.createOpeningHours(newOpeningHours, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'opening hours not created', message: err.message })
    }
    response.status(201).json({ id: result.insertId, ...newOpeningHours })
  })
})

openingHoursRouter.put('/:id', (request, response) => {
  let { day, openinghours } = request.body

  if (!day || !openinghours) {
    return response.status(400).json({ error: 'content missing' })
  }

  day = addWhiteSpacesAroundHyphen(day)
  openinghours = addWhiteSpacesAroundHyphen(openinghours)

  const openingHours = {
    id: request.params.id,
    day,
    openinghours,
  }

  openingHoursSql.updateOpeningHours(openingHours, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'opening hours not updated', message: err.message })
    }
    response.status(201).json({ id: result.insertId, ...openingHours })
  })
})

openingHoursRouter.delete('/:id', (request, response) => {
  openingHoursSql.deleteOpeningHours(request.params.id, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'opening hours not deleted', message: err.message })
    }
    response.status(204).end()
  })
})

module.exports = openingHoursRouter