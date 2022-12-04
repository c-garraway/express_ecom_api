"use strict"

// db pool config
const Pool = require('pg').Pool
const conObject = {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    ssl: true
}

const pool = new Pool(conObject)

module.exports = {
    pool,
    conObject
}
