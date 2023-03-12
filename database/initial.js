const { v4: uuidv4 } = require('uuid')
const database = require('./database')
const bcrypt = require('bcrypt')

async function createInitialTables(db) {
  // user table
  await database.createTable(db, 'user', `
    id TEXT UNIQUE PRIMARY KEY,
    role TEXT,
    email TEXT UNIQUE,
    password TEXT
  `,)
  // end user table
}

async function createInitialRows(db) {
  // users
    // admin1
    var hashedPassword = await bcrypt.hash('admin1', 10)
    await database.run(db, `
      INSERT INTO user (
        id, role, email, password
      ) VALUES (
        ?, ?, ?, ?
      )
    `, [
      uuidv4(), 'admin', 'admin@example.com', hashedPassword
    ], true)
    // end admin1
  // end users
}

module.exports = {createInitialTables, createInitialRows}
