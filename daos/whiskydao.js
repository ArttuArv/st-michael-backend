const Whisky = require('../models/whisky')
const WhiskyAreas = require('../models/whiskyareas')

const getWhiskies = async () => {
  return (typeof Whisky.find({}).populate().then == 'function') 
      ? await Whisky.find({}).populate() 
      : Whisky.find({}).populate()
}

const getWhiskyById = async (id) => {
  return await Whisky.findById(id)
}

const createWhisky = async (newWhisky) => {
  const whiskyArea = await WhiskyAreas.findOne({ name: newWhisky.area })

  if (!whiskyArea) {
    const whiskyAreas = new WhiskyAreas({
      name: newWhisky.area,
    })
    await whiskyAreas.save();
  }

  const newWhiskyArea = await WhiskyAreas.findOne({ name: newWhisky.area })

  const whisky = new Whisky({
    name: newWhisky.name,
    area: newWhisky.area,
    price: newWhisky.price,
  })

  const savedWhisky = await whisky.save()
  newWhiskyArea.whiskies = newWhiskyArea.whiskies.concat(savedWhisky._id)
  await newWhiskyArea.save();

  return savedWhisky
}

const deleteWhisky = async (request) => {

  const whiskyToDelete = await Whisky.findById(request.params.id)

  if (whiskyToDelete) {
    await Whisky.findByIdAndRemove(request.params.id)

    const whiskyArea = await WhiskyAreas.findOne({ name: whiskyToDelete.area })
    whiskyArea.whiskies = whiskyArea.whiskies.filter(whisky => whisky.toString() !== whiskyToDelete._id.toString())
    await whiskyArea.save()

    return { message: 'Whisky deleted', status: 200 }
    
  } else {
    return { message: 'Whisky not found', status: 404 }
  }
}

const updateWhisky = async (whisky, request) => {

  const existingWhisky = await Whisky.findById(request.params.id)
  await removeOldEntryFromWhiskyAreas(existingWhisky)
  const updatedWhisky = await updateWhiskyAndWhiskyArea(whisky, request)

  return updatedWhisky
}

module.exports = {
  getWhiskies,
  getWhiskyById,
  createWhisky,
  deleteWhisky,
  updateWhisky,
}

async function updateWhiskyAndWhiskyArea(whisky, request) {
  const updatedWhiskyArea = await WhiskyAreas.findOne({ name: whisky.area })
  const updatedWhisky = await Whisky.findByIdAndUpdate(request.params.id, whisky, { new: true })
  updatedWhiskyArea.whiskies = updatedWhiskyArea.whiskies.concat(updatedWhisky._id)

  await updatedWhiskyArea.save()

  return updatedWhisky
}

async function removeOldEntryFromWhiskyAreas(oldWhisky) {

  const oldWhiskyArea = await WhiskyAreas.findOne({ name: oldWhisky.area })  
  oldWhiskyArea.whiskies = oldWhiskyArea.whiskies.filter(whisky => whisky.toString() !== oldWhisky._id.toString())

  await oldWhiskyArea.save()
}