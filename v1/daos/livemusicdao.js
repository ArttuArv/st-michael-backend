const LiveMusic = require('../models/livemusic')

const getLiveMusic = async () => {
  return await LiveMusic.find({})
}

const createLiveMusicEvent = async (newEvent) => {
  const liveMusic = new LiveMusic({
    name: newEvent.name,
    date: newEvent.date,
    time: newEvent.time,
  })

  const savedLiveMusic = await liveMusic.save()
  return savedLiveMusic
}

const updateLiveMusicEvent = async (liveMusic, request) => {
  const updatedLiveMusic = await LiveMusic.findByIdAndUpdate(request.params.id, liveMusic, { new: true })
  return updatedLiveMusic
}

const deleteLiveMusicEvent = async (request) => {
  await LiveMusic.findByIdAndRemove(request.params.id)
}

module.exports = {
  getLiveMusic,
  createLiveMusicEvent,
  updateLiveMusicEvent,
  deleteLiveMusicEvent,
}