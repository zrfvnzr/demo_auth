const { v4: uuidv4 } = require('uuid')
const database = require('./database')
const bcrypt = require('bcrypt')

async function createInitialTables(db) {
  // anthropometrics table
  await database.createTable(db, 'anthropometrics', `
    patient_id TEXT UNIQUE PRIMARY KEY,
    height TEXT,
    weight TEXT,
    bmi TEXT,
    time TEXT
  `)
  // end anthropometrics table
  // user table
  await database.createTable(db, 'user', `
    id TEXT UNIQUE PRIMARY KEY,
    role TEXT,
    username TEXT UNIQUE,
    password TEXT
  `)
  // end user table
  // patient table
  await database.createTable(db, 'patient', `
    patient_id TEXT UNIQUE PRIMARY KEY,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    birthday TEXT NOT NULL,
    birth_place TEXT NOT NULL,
    age INTEGER NOT NULL,
    sex TEXT NOT NULL,
    nationality TEXT NOT NULL,
    religion TEXT NOT NULL,
    current_address TEXT NOT NULL,
    permanent_address TEXT NOT NULL,
    contact_number INTEGER NOT NULL,
    mother_name TEXT NOT NULL,
    mother_age INTEGER NOT NULL,
    mother_nationality TEXT NOT NULL,
    mother_education TEXT NOT NULL,
    mother_occupation TEXT NOT NULL,
    father_name TEXT NOT NULL,
    father_age INTEGER NOT NULL,
    father_nationality TEXT NOT NULL,
    father_education TEXT NOT NULL,
    father_occupation TEXT NOT NULL,
    informant_name TEXT NOT NULL,
    informant_age INTEGER NOT NULL,
    informant_nationality TEXT NOT NULL,
    informant_relationship TEXT NOT NULL,
    informant_education TEXT NOT NULL,
    informant_occupation TEXT NOT NULL,
    informant_address TEXT NOT NULL,
    informant_contact_number INTEGER NOT NULL
  `)
  // end patient table
  // patient_bill
  await database.createTable(db, 'patient_bill', `
    patient_id TEXT UNIQUE PRIMARY KEY,
    bill_id TEXT
  `)
  // end patient_bill
  // patient classification
  await database.createTable(db, 'patient_classification', `
    patient_id TEXT UNIQUE PRIMARY KEY,
    classification TEXT,
    intake TEXT
  `)
  // end patient classification
  // patient consultation
  await database.createTable(db, 'patient_consultation', `
    id TEXT UNIQUE PRIMARY KEY,
    patient_id TEXT,
    consultation TEXT
  `)
  // end patient consultation
  // patient id
  await database.createTable(db, 'patient_id', `
    id TEXT UNIQUE PRIMARY KEY
  `)
  // end patient id
  // queue table
  await database.createTable(db, 'queue', `
    patient_id TEXT UNIQUE PRIMARY KEY,
    station TEXT,
    time TEXT
  `)
  // end queue table
  // record table
  await database.createTable(db, 'record', `
    id TEXT UNIQUE PRIMARY KEY,
    station TEXT,
    start TEXT,
    end TEXT
  `)
  // end record table
  // remarks
  await database.createTable(db, 'remarks', `
    patient_id TEXT UNIQUE PRIMARY KEY,
    remarks TEXT
  `)
  // end remarks
  // station table
  // note: for cashier and doctor only
  await database.createTable(db, 'station', `
    role TEXT UNIQUE PRIMARY KEY,
    next_station TEXT
  `)
  // end station table
}

async function createInitialRows(db) {
  // patient
    // samplePatient1
    await database.run(db, `
      INSERT INTO patient (
        patient_id,
        last_name,
        first_name,
        middle_name,
        birthday,
        birth_place,
        age,
        sex,
        nationality,
        religion,
        current_address,
        permanent_address,
        contact_number,
        mother_name,
        mother_age,
        mother_nationality,
        mother_education,
        mother_occupation,
        father_name,
        father_age,
        father_nationality,
        father_education,
        father_occupation,
        informant_name,
        informant_age,
        informant_nationality,
        informant_relationship,
        informant_education,
        informant_occupation,
        informant_address,
        informant_contact_number        
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `, [
      'test_queue_patient0',
      'Cruz',
      'Juan',
      'de la',
      'Nov 27 2022',
      'Manila',
      22,
      'Male',
      'Filipino',
      'Roman Catholic',
      'Ermita, Manila',
      'Ermita, Manila',
      '09129302930',
      'Maria de la',
      60,
      'Filipino',
      'College',
      'Housewife',
      'Pedro',
      60,
      'Filipino',
      'High School',
      'Tambay',
      'Maria de la',
      60,
      'Filipino',
      'Mother',
      'College',
      'Housewife',
      'Ermita, Manila',
      '09273928492'       
    ], true)
    // end samplePatient1
  // end patient
  // patient ids
  for (let i=11111; i<=12222; i++) {
    await database.run(db, `
      INSERT INTO patient_id (id) VALUES (?)
    `, [i.toString()], true)
    // console.log(`inserted ${i} to patient_id`) // temp
  }
  // end patient ids
  // queue
    await database.run(db, `
      INSERT INTO queue (
        patient_id, station, time
      ) VALUES (?, ?, ?)
    `, [
      'test_queue_patient', 'receptionist1', Date.now()
    ], true)
  // end queue
  // users
    // admin1
    var hashedPassword = await bcrypt.hash('admin1', 10)
    await database.run(db, `
      INSERT INTO user (
        id, role, username, password
      ) VALUES (
        ?, ?, ?, ?
      )
    `, [
      uuidv4(), 'admin', 'admin1', hashedPassword
    ], true)
    // receptionist1
    hashedPassword = await bcrypt.hash('receptionist1', 10)
    await database.run(db, `
      INSERT INTO user (
        id, role, username, password
      ) VALUES (
        ?, ?, ?, ?
      )
    `, [
      uuidv4(), 'receptionist', 'receptionist1', hashedPassword
    ], true)
    // socialworker1
    hashedPassword = await bcrypt.hash('socialworker1', 10)
    await database.run(db, `
      INSERT INTO user (
        id, role, username, password
      ) VALUES (
        ?, ?, ?, ?
      )
    `, [
      uuidv4(), 'social worker', 'socialworker1', hashedPassword
    ], true)
    // cashier1
    hashedPassword = await bcrypt.hash('cashier1', 10)
    await database.run(db, `
      INSERT INTO user (
        id, role, username, password
      ) VALUES (
        ?, ?, ?, ?
      )
    `, [
      uuidv4(), 'cashier', 'cashier1', hashedPassword
    ], true)
    // anthropometrics1
    hashedPassword = await bcrypt.hash('anthropometrics1', 10)
    await database.run(db, `
      INSERT INTO user (
        id, role, username, password
      ) VALUES (
        ?, ?, ?, ?
      )
    `, [
      uuidv4(), 'anthropometrics', 'anthropometrics1', hashedPassword
    ], true)
    // doctor1
    hashedPassword = await bcrypt.hash('doctor1', 10)
    await database.run(db, `
      INSERT INTO user (
        id, role, username, password
      ) VALUES (
        ?, ?, ?, ?
      )
    `, [
      uuidv4(), 'doctor', 'doctor1', hashedPassword
    ], true)
  // end users
  // record
    await database.run(db, `
      INSERT INTO record (
        id, station, start, end
      ) VALUES (?, ?, ?, ?)
    `, ['3d0ba867-9b18-4a59-9f00-8d3ceaf21017', 'receptionist', Date.now(), Date.now()], true)
  // end record
  // station
    await database.run(db, `
      INSERT INTO station (
        role,
        next_station
      ) VALUES (?, ?)
    `, ['receptionist', 'socialworker1'], true)
    await database.run(db, `
      INSERT INTO station (
        role,
        next_station
      ) VALUES (?, ?)
    `, ['social worker', 'cashier1'], true)
    await database.run(db, `
      INSERT INTO station (
        role,
        next_station
      ) VALUES (?, ?)
    `, ['cashier', 'anthropometrics'], true)      
    await database.run(db, `
      INSERT INTO station (
        role,
        next_station
      ) VALUES (?, ?)
    `, ['anthropometrics', 'doctor1'], true)    
  // end station
}

module.exports = {createInitialTables, createInitialRows}
