const { mySqlConnection } = require('../../utils/dbConn')
const {
  getAllOpeningHoursQuery,
  insertOpeningHoursQuery,
  updateOpeningHoursQuery,
  deleteOpeningHoursQuery,
} = require('../../utils/queries')

const getAllOpeningHours = (callback) => {
  return mySqlConnection.query(getAllOpeningHoursQuery, callback)
}

const createOpeningHours = (openingHours, callback) => {
  return mySqlConnection.execute(insertOpeningHoursQuery, [openingHours.day, openingHours.openinghours], callback)
}

const updateOpeningHours = (openingHours, callback) => {
  return mySqlConnection.execute(updateOpeningHoursQuery, [openingHours.day, openingHours.openinghours, openingHours.id], callback)
}

const deleteOpeningHours = (id, callback) => {
  return mySqlConnection.execute(deleteOpeningHoursQuery, [id], callback)
}

module.exports = {
  getAllOpeningHours,
  createOpeningHours,
  updateOpeningHours,
  deleteOpeningHours,
}