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

const getAllWhiskysCsv = async () => {
  return new Promise((resolve, reject) => {
    mySqlConnection.query(getAllWhiskysQuery, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    }
  )})
}

const createWhisky = async (whisky) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.query(insertWhiskyQuery, [whisky.area, whisky.name, whisky.price], (error, results) => {
      if (error) {
        return error.message.includes(`Column 'areas_id' cannot be null`)
          ? reject(new Error(`Area with name '${whisky.area}' not found.`))
          : reject(error);
      } else {
        resolve(results);
      }
    }
  )})
}

const updateWhisky = async (whisky) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.query(updateWhiskyQuery, [whisky.area, whisky.name, whisky.price, whisky.id], (error, results) => {
      if (error) {
        return error.message.includes(`Column 'areas_id' cannot be null`)
          ? reject(new Error(`Area with name '${whisky.area}' not found.`))
          : reject(error);
      } else {
        resolve(results);
      }
    }
  )})
}

const deleteWhisky = (id, callback) => {
  return mySqlConnection.query(deleteWhiskyQuery, [id], callback)
}

const createWhiskyArea = async (area) => {
  return new Promise((resolve, reject) => {
    mySqlConnection.query(insertWhiskyAreaQuery, [area], (error, results) => {
      if (error) {
        return error.message.includes(`Duplicate entry`)
          ? reject(new Error(`Area with name '${area}' already exists.`))
          : reject(error);
      } else {
        resolve(results);
      }
    }
  )})
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
  getAllWhiskysCsv,
}