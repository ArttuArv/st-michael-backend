const whiskyRouter = require('express').Router()
const whiskyDao = require('../daos/whiskydao')

whiskyRouter.get('/', async (request, response) => {
  const whiskies = await whiskyDao.getWhiskies()    
  response.json(whiskies)
})

whiskyRouter.get('/:id', async (request, response) => {
  const whisky = await whiskyDao.getWhiskyById(request.params.id)

  if (!whisky)
    response.status(404).json({ message: 'Whisky not found' })

  response.json(whisky)
})

whiskyRouter.post('/', async (request, response) => {
  const { name, area, price, } = request.body
  if (!request.user) {
    return response.status(401).end()
  } else {
    const newWhisky = {
      name,
      area,
      price,
    }
    const savedWhisky = await whiskyDao.createWhisky(newWhisky)  
    response.status(201).json(savedWhisky)
  }
})

whiskyRouter.delete('/:id', async (request, response) => {
  
  if (!request.user) 
    return response.status(401).end()

  const responseMsg = await whiskyDao.deleteWhisky(request)

  response.status(responseMsg.status).json({ message: responseMsg.message })
 
})

whiskyRouter.put('/:id', async (request, response) => {
  const { name, area, price, } = request.body

  if (!request.user)
    return response.status(401).end()

  const whisky = {
    name,
    area,
    price,
  }

  const updatedWhisky = await whiskyDao.updateWhisky(whisky, request)   

  response.status(201).json(updatedWhisky)
})

module.exports = whiskyRouter
