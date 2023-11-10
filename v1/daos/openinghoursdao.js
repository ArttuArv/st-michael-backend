const OpeningHours = require('../models/openingHours')
const { addWhiteSpacesAroundHyphen } = require('../../utils/stringManipulation')

const getOpeningHours = async () => {
  return await OpeningHours.find({})
}

const getOpeningHoursById = async (id) => {
  return await OpeningHours.findById(id)
}

const createOpeningHours = async (request) => {
  let { day, openinghours } = request.body
  day = addWhiteSpacesAroundHyphen(day)
  openinghours = addWhiteSpacesAroundHyphen(openinghours)

  const openingHour = new OpeningHours({
    day,
    openinghours,
  })

  const savedOpeningHour = await openingHour.save()
  return savedOpeningHour
}

const updateOpeningHours = async (request) => {
  let { day, openinghours } = request.body
  day = addWhiteSpacesAroundHyphen(day)
  openinghours = addWhiteSpacesAroundHyphen(openinghours)  

  const openingHour = {
    day,
    openinghours,
  }
  const updatedOpeningHour = await OpeningHours.findByIdAndUpdate(request.params.id, openingHour, { new: true })
  return updatedOpeningHour
}

const deleteOpeningHours = async (request) => {
  await OpeningHours.findByIdAndRemove(request.params.id)
}


module.exports = {
  getOpeningHours,
  getOpeningHoursById,
  createOpeningHours,
  updateOpeningHours,
  deleteOpeningHours,
}