const { mySqlConnection } = require('../../utils/dbConn')
const {
  getAllUsersQuery,
  insertUserQuery,
  updateUserQuery,
  deleteUserQuery,
  getUserByIdQuery,
  getUserByUsernameQuery,
  getUserByRefreshTokenQuery,
  updateUserRefreshTokenQuery,
  updateUserPasswordQuery,
} = require('../../utils/queries')
const bcrypt = require('bcrypt')

const getAllUsers = (callback) => {
  return mySqlConnection.query(getAllUsersQuery, callback)
}

const getUserById = (id, callback) => {
  return mySqlConnection.execute(getUserByIdQuery, [id], callback)
}

const getUserByUsername = async (username) => {
  const promisePool = mySqlConnection.promise()
  const [rows, fields] = await promisePool.execute(getUserByUsernameQuery, [username])
  return rows[0]
}

const getUserByRefreshToken = async (refreshToken) => {
  const promisePool = mySqlConnection.promise()
  const [rows, fields] = await promisePool.execute(getUserByRefreshTokenQuery, [refreshToken])
  return rows[0]

}

const createUser = async (user) => {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(user.password, saltRounds)
  const promisePool = mySqlConnection.promise()
  const [rows, fields] = await promisePool.execute(insertUserQuery, [user.username, hashedPassword])
  return rows
}

const updateUser = async (user) => {
  const promisePool = mySqlConnection.promise()
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(user.password, saltRounds)
  
  const [selectRows, selectFields] = await promisePool.execute(getUserByUsernameQuery, [user.username])
  const userFound = selectRows[0]
  const [rows, fields] = await promisePool.execute(updateUserPasswordQuery, [hashedPassword, userFound.id])
  return rows

}

const updateUserRefreshToken = async (user) => {
  const promisePool = mySqlConnection.promise()
  const [rows, fields] = await promisePool.execute(updateUserRefreshTokenQuery, [user.refreshToken, user.id])
  return rows
}

const deleteUser = (id, callback) => {
  return mySqlConnection.execute(deleteUserQuery, [id], callback)
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getUserByRefreshToken,
  updateUserRefreshToken,
}

