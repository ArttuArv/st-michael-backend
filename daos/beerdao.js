const Beer = require('../models/beer')
const Categories = require('../models/categories')

const getBeers = async () => {
  const beers = await Beer.find({}).populate('category', { name: 1, })
  return beers
}

const getBeerById = async (id) => {
  const beer = await Beer.findById(id)
  return beer
}

const saveBeer = async (category, name, style, country, price) => {
  const beerCategory = await Categories.findOne({ name: category })

  const beer = new Beer({
    name,
    style,
    country,
    price,
    category: beerCategory.name,
  })

  const savedBeer = await beer.save()
  beerCategory.products = beerCategory.products.concat(savedBeer._id)
  await beerCategory.save()
  return savedBeer
}

const updateBeer = async (beer, request) => {  
  await removeOldEntryFromCategories(request)
  const updatedBeer = await updateBeerAndCategory(request, beer)
  return updatedBeer
}

const deleteBeer = async (request, beerToDelete) => {

  await Beer.findByIdAndRemove(request.params.id)

  const category = await Categories.findOne({ name: beerToDelete.category })
  category.products = category.products.filter(product => product.toString() !== beerToDelete._id.toString())
  await category.save()

}

module.exports = {
  saveBeer,
  getBeers,
  getBeerById,
  updateBeer,
  deleteBeer,
}

async function updateBeerAndCategory(request, beer) {
  const newBeerCategory = await Categories.findOne({ name: beer.category })
  const updatedBeer = await Beer.findByIdAndUpdate(request.params.id, beer, { new: true })
  newBeerCategory.products = newBeerCategory.products.concat(updatedBeer._id)
  await newBeerCategory.save()
  return updatedBeer
}

async function removeOldEntryFromCategories(request) {
  const oldBeer = await Beer.findById(request.params.id)
  const oldBeerCategory = await Categories.findOne({ name: oldBeer.category })
  oldBeerCategory.products = oldBeerCategory.products.filter(product => product.toString() !== oldBeer._id.toString())
  await oldBeerCategory.save()
}