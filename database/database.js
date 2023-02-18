const sqlite3 = require('sqlite3').verbose()


// Open/Create Database
async function openOrCreateDB(source) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = new sqlite3.Database(source, (err) => {
        if (err) {
          throw err
        } else {
          // console.log('SQLite database', source, 'opened/created.') // temp
          resolve(db)
        }
      })
    } catch (error) {
      console.log('Error opening/creating database', source, 'in database.js') // temp
      console.log(error) // temp
      reject()
    }
  })
}

// Create Table
async function createTable(db, tableName, columns) {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('database.js > createTable called.') // temp
      db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`, (err) => {
        if (err) {
          throw err
        } else {
          // console.log('Created table', tableName, 'successfully.') // temp
          resolve()
        }
      })
    } catch (error) {
      console.log('Error on database.js > createTable') // temp
      console.log(error) // temp
      reject()
    }
  })
}

// Run SQL Command
async function run(db, sql, params, ignoreErrs) {
  return new Promise(async (resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) {
        // console.log('Error in database.js > run')
        // console.log(err)
        if (ignoreErrs) {
          resolve()
        } else {
          reject(err)
        }
      } else {
        resolve()
      }
    })
  })
}

// Get SQL Query
async function get(db, sql, params, ignoreErrs) {
  return new Promise(async (resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        if (ignoreErrs) {
          resolve()
        } else {
          reject(err)
        }
      } else {
        // console.log('database.js > get success.') // temp
        resolve(row)
      }
    })
  })
}

// All SQL Query
async function all(db, sql, params, ignoreErrs) {
  return new Promise(async (resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        if (ignoreErrs) {
          resolve()
        } else {
          reject(err)
        }
      } else {
        // console.log('database.js > all success.') // temp
        resolve(rows)
      }
    })
  })
}

module.exports = {openOrCreateDB, createTable, run, get, all}