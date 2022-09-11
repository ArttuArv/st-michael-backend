const Whisky = require('../models/whisky');
const WhiskyAreas = require('../models/whiskyareas');
const whiskyRouter = require('express').Router();

whiskyRouter.get('/', async (request, response) => {
  const whiskies = await Whisky.find({}).populate();
  response.json(whiskies);
})

whiskyRouter.post('/', async (request, response) => {
  const { name, area, price, } = request.body;

  if (!request.user) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  } else {
    const whiskyArea = await WhiskyAreas.findOne({ name: area });

    if (!whiskyArea) {
      const whiskyAreas = new WhiskyAreas({
        name: area,
      })
      await whiskyAreas.save();
    }

    const newWhiskyArea = await WhiskyAreas.findOne({ name: area });

    const whisky = new Whisky({
      name,
      area,
      price,
    })

    const savedWhisky = await whisky.save();
  
    newWhiskyArea.whiskies = newWhiskyArea.whiskies.concat(savedWhisky._id);
    await newWhiskyArea.save();

    response.status(201).json(savedWhisky);
  }
})

whiskyRouter.delete('/:id', async (request, response) => {
  const whiskyToDelete = await Whisky.findById(request.params.id);

  if (whiskyToDelete) {
    if (request.user) {
      await Whisky.findByIdAndRemove(request.params.id);

      const whiskyArea = await WhiskyAreas.findOne({ name: whiskyToDelete.area });
      whiskyArea.whiskies = whiskyArea.whiskies.filter(whisky => whisky !== whiskyToDelete._id);
      await whiskyArea.save();

      response.status(204).end();
    }
  } else {
    response.status(404).json({ error: 'whisky not found' });
  }
})

module.exports = whiskyRouter;