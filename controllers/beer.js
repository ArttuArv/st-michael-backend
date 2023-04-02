const Beer = require('../models/beer')
const Categories = require('../models/categories')
const beerRouter = require('express').Router()

beerRouter.get('/', async (request, response) => {
  const beers = await Beer.find({}).populate('category', { name: 1, })
  response.json(beers)
})

beerRouter.post('/', async (request, response) => {
  const { name, style, country, price, category } = request.body

  if (!request.user) 
    return response.status(401).json({ error: 'Token missing or invalid' })
  
  if (category === 'Seasonal Bottles' || category === 'Seasonal Draughts' || category === 'Regular Bottles' || category === 'Regular Draughts') {
      
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
  
    response.status(201).json(savedBeer)
    
  } else {    
    return response.status(400).json({ error: 'Category must be Seasonal Bottles, Seasonal Draughts, Regular Bottles or Regular Draughts' })
  }  
})

beerRouter.put('/:id', async (request, response) => {
  const { name, style, country, price, category } = request.body

  if (!request.user)
    return response.status(401).json({ error: 'Token missing or invalid' })
  
  if (category === 'Seasonal Bottles' || category === 'Seasonal Draughts' || category === 'Regular Bottles' || category === 'Regular Draughts') {
    const beer = {
      name,
      style,
      country,
      price,
      category,
    }

    await removeOldEntryFromCategories(request)

    const updatedBeer = await updateBeerAndCategory(request, beer)

    response.status(201).json(updatedBeer)

  } else {
    return response.status(400).json({ error: 'Category must be Seasonal Bottles, Seasonal Draughts, Regular Bottles or Regular Draughts' })
  }
  
})

beerRouter.delete('/:id', async (request, response) => {
  const beerToDelete = await Beer.findById(request.params.id)

  if (!request.user)
    return response.status(401).json({ error: 'Token missing or invalid' })
  
  if (beerToDelete) {
    await Beer.findByIdAndRemove(request.params.id)

    const category = await Categories.findOne({ name: beerToDelete.category })
    category.products = category.products.filter(product => product.toString() !== beerToDelete._id.toString())
    await category.save()
    
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

module.exports = beerRouter;

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

