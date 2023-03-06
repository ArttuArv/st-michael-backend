const LiveMusic = require('../models/livemusic')
const liveMusicRouter = require('express').Router()

liveMusicRouter.get('/', async (request, response) => {
  const liveMusic = await LiveMusic.find({})
  response.json(liveMusic)
})

liveMusicRouter.post('/', async (request, response) => {
  const { name, date, time } = request.body

  if (!request.user)
    return response.status(401).json({ error: 'Token missing or invalid' })
  
  const liveMusic = new LiveMusic({
    name,
    date,
    time,
  })

  const savedLiveMusic = await liveMusic.save()

  response.status(201).json(savedLiveMusic)
  
})

liveMusicRouter.put('/:id', async (request, response) => {
  const { name, date, time } = request.body

  if (!request.user)
    return response.status(401).json({ error: 'Token missing or invalid' })
  
  const liveMusic = {
    name,
    date,
    time,
  }

  const updatedLiveMusic = await LiveMusic.findByIdAndUpdate(request.params.id, liveMusic, { new: true })

  response.status(201).json(updatedLiveMusic)

})

liveMusicRouter.delete('/:id', async (request, response) => {

  if (!request.user)
    return response.status(401).json({ error: 'Token missing or invalid' })

  await LiveMusic.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = liveMusicRouter