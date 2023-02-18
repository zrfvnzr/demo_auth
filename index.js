const express = require('express')
const app = express()

require('dotenv').config()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

async function main() {

  // Example route
  app.get('/hello', (req, res) => {
    res.send('Hello world!')
  })
  // end Example route

  // Initialize database
  const database = require('./database/database')
    // Create db.sqlite Database
    const source = './database/db.sqlite'
    const db = await database.openOrCreateDB(source)
    // end Create db.sqlite Database
  // end Initialize database

  // Initial
  const initial = require('./database/initial')
  await initial.createInitialTables(db)
  await initial.createInitialRows(db)
  // end Initial

  // Initialize authentication
  const authentication = require('./authentication')
  await authentication.main(app, db)
  // end Initialize authentication

  // Serving Frontend
  const path = require('path')
  app.use(express.static(path.join(__dirname, 'dist'))) // added

  app.get('*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
  })

  // Prevents error 404 on invalid routes
  var history = require('connect-history-api-fallback')
  app.use(history())
  // end Prevents error 404 on invalid routes

  // Start server
  app.listen(process.env.PORT, () => {
    console.log('Express app listening on port', process.env.PORT)
  })
  // end Start server

}
main()