const { mySqlConnection } = require('../../utils/dbConn')
const { 
  selectBeerByIdQuery, 
  selectBeersQuery, 
  insertBeerQuery, 
  updateBeerQuery, 
  deleteBeerQuery 
} = require('../../utils/queries')

const getBeerById = (id, callback) => {  
  return mySqlConnection.execute(selectBeerByIdQuery, [id], callback)
}

const getBeers = (callback) => { 
  return mySqlConnection.query(selectBeersQuery, callback)
}

const createBeer = async (newBeer) => {
  const promisePool = mySqlConnection.promise();
  const [row, fields] = await promisePool.execute(insertBeerQuery, [newBeer.category, newBeer.name, newBeer.style, newBeer.country])
  return row
}

const updateBeer = async (updatedBeer) => {
  const promisePool = mySqlConnection.promise();
  const [row, fields] = await promisePool.execute(updateBeerQuery, [updatedBeer.category, updatedBeer.name, updatedBeer.style, updatedBeer.country, updatedBeer.id])
  return row
}

const deleteBeer = (id, callback) => {  
  return mySqlConnection.execute(deleteBeerQuery, [id], callback)
}

module.exports = {
  getBeerById,
  getBeers,
  createBeer,
  updateBeer,
  deleteBeer,
}