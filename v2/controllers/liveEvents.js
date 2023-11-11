const liveEventsRouter = require('express').Router()
const liveEventsSql = require('../models/liveEvents')

liveEventsRouter.get('/', (request, response) => {
  liveEventsSql.getAllLiveEvents((err, result) => {
    if (err) {
      return response.status(404).json({ error: err.message })
    }
    response.json(result)
  })
})

liveEventsRouter.post('/', (request, response) => {
  const { name, date, time } = request.body

  if (!name || !date || !time) {
    return response.status(400).json({ error: 'content missing' })
  }

  const newLiveEvent = {
    name,
    date,
    time,
  }

  liveEventsSql.createLiveEvent(newLiveEvent, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'live event not created', message: err.message })
    }
    response.status(201).json({ id: result.insertId, ...newLiveEvent })
  })
})

liveEventsRouter.put('/:id', (request, response) => {
  const { name, date, time } = request.body

  const liveEvent = {
    id: request.params.id,
    name,
    date,
    time,
  }

  liveEventsSql.updateLiveEvent(liveEvent, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'live event not updated', message: err.message })
    }
    response.status(201).json({ id: result.insertId, ...liveEvent })
  })
})

liveEventsRouter.delete('/:id', (request, response) => {
  liveEventsSql.deleteLiveEvent(request.params.id, (err, result) => {
    if (err) {
      return response.status(400).json({ error: 'live event not deleted', message: err.message })
    }
    response.status(204).end()
  })
})

module.exports = liveEventsRouter