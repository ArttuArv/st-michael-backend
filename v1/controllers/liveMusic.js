const liveMusicRouter = require('express').Router()
const liveMusicDao = require('../daos/livemusicdao')

liveMusicRouter.get('/', async (request, response) => {
  const liveMusic = await liveMusicDao.getLiveMusic()
  response.json(liveMusic)
})

liveMusicRouter.post('/', async (request, response) => {
  const { name, date, time } = request.body

  if (!request.user)
    return response.status(401).end()
  
  const newLiveMusic = {
    name,
    date,
    time,
  }

  const savedLiveMusic = await liveMusicDao.createLiveMusicEvent(newLiveMusic)

  response.status(201).json(savedLiveMusic)
  
})

liveMusicRouter.put('/:id', async (request, response) => {
  const { name, date, time } = request.body

  if (!request.user)
    return response.status(401).end()
  
  const liveMusic = {
    name,
    date,
    time,
  }

  const updatedLiveMusic = await liveMusicDao.updateLiveMusicEvent(liveMusic, request)

  response.status(201).json(updatedLiveMusic)

})

liveMusicRouter.delete('/:id', async (request, response) => {

  if (!request.user)
    return response.status(401).end()

  await liveMusicDao.deleteLiveMusicEvent(request)

  response.status(204).end()
})

module.exports = liveMusicRouter