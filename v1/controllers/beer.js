const beerRouter = require('express').Router()
const beerDao = require('../daos/beerdao')

beerRouter.get('/', async (request, response) => {
  const beers = await beerDao.getBeers()
  response.status(200).json(beers)
})

beerRouter.post('/', async (request, response) => {
  const { name, style, country, price, category } = request.body

  if (!request.user) 
    return response.status(401).end()  
  if (category === 'Seasonal Bottles' || category === 'Seasonal Draughts' 
    || category === 'Regular Bottles' || category === 'Regular Draughts') { 
    
    const newBeer = {
      name,
      style,
      country,
      price,
      category,
    }    

    const savedBeer = await beerDao.saveBeer(newBeer)  
    response.status(201).json(savedBeer)    
  } else {    
    return response.status(400).json({ error: 'Category must be Seasonal Bottles, Seasonal Draughts, Regular Bottles or Regular Draughts' })
  }  

})

beerRouter.put('/:id', async (request, response) => {
  const { name, style, country, price, category } = request.body

  if (!request.user)
  return response.status(401).end()
  
  if (category === 'Seasonal Bottles' || category === 'Seasonal Draughts' 
    || category === 'Regular Bottles' || category === 'Regular Draughts') {

    const beer = {
      name,
      style,
      country,
      price,
      category,
    }

    const updatedBeer = await beerDao.updateBeer(beer, request)
    response.status(201).json(updatedBeer)

  } else {
    return response.status(400).json({ error: 'Category must be Seasonal Bottles, Seasonal Draughts, Regular Bottles or Regular Draughts' })
  }
  
})

beerRouter.delete('/:id', async (request, response) => {

  if (!request.user)
    return response.status(401).end()

  const beerToDelete = await beerDao.getBeerById(request.params.id)
  
  if (beerToDelete) {
    await beerDao.deleteBeer(request, beerToDelete)    
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

module.exports = beerRouter
