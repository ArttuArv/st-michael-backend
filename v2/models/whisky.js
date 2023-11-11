const { mySqlConnection } = require('../../utils/dbConn')
const {
  getAllWhiskysQuery,
  insertWhiskyQuery,
  insertWhiskyAreaQuery,
  truncateWhiskyTable,
  truncateWhiskyAreaTable,
  updateWhiskyQuery,
  deleteWhiskyQuery,
} = require('../../utils/queries')

const getAllWhiskys = (callback) => {
  return mySqlConnection.query(getAllWhiskysQuery, callback)
}

const createWhisky = async (whisky, callback) => {
  mySqlConnection.query(insertWhiskyQuery, [whisky.area, whisky.name, whisky.price], (error, results) => {
    if (error) {
      return error.message.includes(`Column 'areas_id' cannot be null`)
        ? callback(new Error(`Area with name '${whisky.area}' not found.`), null)
        : callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

const updateWhisky = (whisky, callback) => {
  return mySqlConnection.query(updateWhiskyQuery, [whisky.area, whisky.name, whisky.price, whisky.id], callback)
}

const deleteWhisky = (id, callback) => {
  return mySqlConnection.query(deleteWhiskyQuery, [id], callback)
}

const createWhiskyArea = async (area, callback) => {
  return mySqlConnection.query(insertWhiskyAreaQuery, [area], callback);
}

const truncateWhiskyAndAreaTables = (callback) => {

  mySqlConnection.query(truncateWhiskyTable, (error, results) => {
    if (error) {
      return callback(error, null);
    } else {
      return mySqlConnection.query(truncateWhiskyAreaTable, callback)
    }
  });
}

module.exports = {
  createWhisky,
  createWhiskyArea,
  truncateWhiskyAndAreaTables,
  getAllWhiskys,
  updateWhisky,
  deleteWhisky,
}