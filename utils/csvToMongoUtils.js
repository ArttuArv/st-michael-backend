const Whisky = require('../v1/models/whisky')
const WhiskyAreas = require('../v1/models/whiskyareas')

const truncateWhiskyCollections = async () => {

  Whisky.deleteMany({}, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Whisky Collection truncated')
    }
  })
}

const truncateWhiskyAreasCollection = () => {
  WhiskyAreas.deleteMany({}, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Whisky Areas Collection truncated')
    }
  })
}

async function createWhiskyAreaIfNotExists(response) {
  const whiskyAreas = response.map((whisky) => whisky.area)
  const uniqueWhiskyAreas = [...new Set(whiskyAreas)]

  await uniqueWhiskyAreas.forEach(async (area) => {
    if (await WhiskyAreas.findOne({ name: area })) {
      console.log('Whisky area already exists')
    } else {
      const whiskyAreas = new WhiskyAreas({ name: area })
      console.log(`Whisky area ${area} created`)
      await whiskyAreas.save()
    }
  })
}

const createWhiskyObjectsSeparatedByArea = async (response) => {
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

const insertWhiskiesIntoDatabase = async (whiskiesByArea) => {

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

const deleteAllWhiskyAreasNotInCsv = async (whiskyCsv) => {

  if (whiskyCsv.length === 0) {
    console.log('No whisky areas to delete')
    return
  }

  const existingWhiskyAreas = await WhiskyAreas.find({}).populate()
  const whiskyAreasInCsv = Object.keys(whiskyCsv)

  existingWhiskyAreas.forEach(async (whiskyArea) => {
    if (!whiskyAreasInCsv.includes(whiskyArea.name)) {
      const deletedWhiskyArea = await WhiskyAreas.findByIdAndRemove(whiskyArea._id)
      console.log(`Whisky area ${deletedWhiskyArea.name} deleted`)
    }
  })
}

const compareInsertedWhiskiesCountWithCsvCountUsingLoop = async (csv) => {
  let whiskyAreaCountInDb = 0
  console.log('CSV COUNT: ', csv)
  while (whiskyAreaCountInDb < csv) {
    console.log('Waiting for whisky areas to be created...')
    whiskyAreaCountInDb = await WhiskyAreas.find({}).populate()
  }

  console.log('WHISKY AREA COUNT: ', whiskyAreaCountInDb.length)

  return whiskyAreaCountInDb.length
}

module.exports = {
  truncateWhiskyCollections,
  truncateWhiskyAreasCollection,
  createWhiskyAreaIfNotExists,
  createWhiskyObjectsSeparatedByArea,
  insertWhiskiesIntoDatabase,
  deleteAllWhiskyAreasNotInCsv,
  compareInsertedWhiskiesCountWithCsvCountUsingLoop,
}