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
  return mySqlConnection.query(insertOpeningHoursQuery, [openingHours.day, openingHours.openinghours], callback)
}

const updateOpeningHours = (openingHours, callback) => {
  return mySqlConnection.query(updateOpeningHoursQuery, [openingHours.day, openingHours.openinghours, openingHours.id], callback)
}

const deleteOpeningHours = (id, callback) => {
  return mySqlConnection.query(deleteOpeningHoursQuery, [id], callback)
}

module.exports = {
  getAllOpeningHours,
  createOpeningHours,
  updateOpeningHours,
  deleteOpeningHours,
}