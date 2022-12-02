const Whisky = require('../models/whisky')
const WhiskyAreas = require('../models/whiskyareas')

const truncateWhiskyCollections = () => {
  Whisky.deleteMany({}, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Collection truncated')
    }
  })
}

const createWhiskyAreaIfNotExists = (response) => {
  const whiskyAreas = response.map((whisky) => whisky.area)
  const uniqueWhiskyAreas = [...new Set(whiskyAreas)]

  uniqueWhiskyAreas.forEach(async (area) => {

    if (await WhiskyAreas.findOne({ name: area })) {
      console.log('Whisky area already exists')
    } else {

      const whiskyAreas = new WhiskyAreas({
        name: area,
      })

      await whiskyAreas.save()
    }
  })

  return uniqueWhiskyAreas.length
}

const createWhiskyObjectsSeparatedByArea = (response) => {
  return response.reduce((acc, whisky) => {

    const key = whisky.area

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(new Whisky(
      {
        name: whisky.name,
        area: whisky.area,
        price: whisky.price,
      }
    ))

    return acc

  }, {})
}

const insertWhiskiesIntoDatabase = (whiskiesByArea) => {

  Object.keys(whiskiesByArea).forEach(async (area) => {
    const whiskyArea = await WhiskyAreas.findOne({ name: area })

    if (whiskyArea) {
      const whiskies = whiskiesByArea[area]
      const savedWhiskies = await Whisky.insertMany(whiskies)
      whiskyArea.whiskies = whiskyArea.whiskies.concat(savedWhiskies.map(whisky => whisky._id))
      await whiskyArea.save()
    } else {
      console.log('Whisky area not found')
    }
  })

  console.log('Whiskies inserted into database')
}

module.exports = {
  truncateWhiskyCollections,
  createWhiskyAreaIfNotExists,
  createWhiskyObjectsSeparatedByArea,
  insertWhiskiesIntoDatabase
}