"use strict"

// db pool config
/* const Pool = require('pg').Pool */
const pg = require('pg');
const { Pool } = pg;

pg.types.setTypeParser(1082, function(stringValue) {
    return stringValue;  //1082 for date type
  });

const connectionString = process.env.CONNECTION_STRING

const conObject = {
    connectionString,
    //ssl: { rejectUnauthorized: false }
}

const pool = new Pool(conObject)

module.exports = {
    pool,
    conObject
}
