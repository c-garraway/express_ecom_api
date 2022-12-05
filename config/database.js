"use strict"

// db pool config
const Pool = require('pg').Pool

const connectionString = process.env.CONNECTION_STRING

const conObject = {
    connectionString,
    ssl: { rejectUnauthorized: false }
}

const pool = new Pool(conObject)

module.exports = {
    pool,
    conObject
}
